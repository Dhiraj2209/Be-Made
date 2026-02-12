import * as THREE from 'three'
import { configuratorStore } from '../store/configuratorStore'

THREE.Cache.enabled = true;

export class TableTopManager {
  private static textureCache = new Map<string, THREE.Texture>();
  private static materialCache = new Map<string, THREE.MeshStandardMaterial>();
  private static materialFadeRaf = new Map<string, number>();
  private static readonly TEXTURE_CENTER = new THREE.Vector2(0.5, 0.5);
  private static readonly textureLoader = new THREE.TextureLoader();

  static apply(scene: THREE.Object3D) {
    const { topColorId } = configuratorStore;
    if (!topColorId) return;

    const material = this.getMaterialForColor(topColorId);
    this.fadeInMaterial(material);

    scene.traverse((child: THREE.Object3D) => {
      const mesh = child as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.material = material;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
  }

  static applyTextureProjection(scene: THREE.Object3D, scaleX: number, scaleZ: number) {
    const repeatX = Math.max(scaleX, 0.01);
    const repeatY = Math.max(scaleZ, 0.01);

    scene.traverse((child: THREE.Object3D) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh) return;

      const materials = Array.isArray(mesh.material)
        ? mesh.material
        : [mesh.material];

      materials.forEach((material: THREE.Material | null) => {
        if (!(material instanceof THREE.MeshStandardMaterial)) return;

        this.updateTextureTransform(material.map, repeatX, repeatY);
        this.updateTextureTransform(material.normalMap, repeatX, repeatY);
        this.updateTextureTransform(material.roughnessMap, repeatX, repeatY);
        this.updateTextureTransform(material.metalnessMap, repeatX, repeatY);
      });
    });
  }

  private static updateTextureTransform(
    texture: THREE.Texture | null,
    repeatX: number,
    repeatY: number
  ) {
    if (!texture) return;
    const nextOffsetX = this.TEXTURE_CENTER.x - repeatX * 0.5
    const nextOffsetY = this.TEXTURE_CENTER.y - repeatY * 0.5
    const unchanged =
      Math.abs(texture.repeat.x - repeatX) < 0.00001 &&
      Math.abs(texture.repeat.y - repeatY) < 0.00001 &&
      Math.abs(texture.offset.x - nextOffsetX) < 0.00001 &&
      Math.abs(texture.offset.y - nextOffsetY) < 0.00001

    if (unchanged) return;

    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    const useRoundSquareCenter =
      configuratorStore.topId === 'ROUND' || configuratorStore.topId === 'SQUARE';
    texture.center.set(useRoundSquareCenter ? -0.3 : 0, 0.3);
    texture.repeat.set(repeatX, repeatY);
    texture.offset.set(
      nextOffsetX,
      nextOffsetY
    );
  }

  private static getMaterialForColor(topColorId: string): THREE.MeshStandardMaterial {
    const cached = this.materialCache.get(topColorId);
    if (cached) return cached;

    const path = `/assets/images/top-color/${topColorId}`;
    const material = new THREE.MeshStandardMaterial({
      transparent: true,
      opacity: 1,
      map: this.getTexture(`${path}/base_color.webp`, true),
      normalMap: this.getTexture(`${path}/normal.webp`),
      roughnessMap: this.getTexture(`${path}/roughness.webp`),
      metalnessMap: this.getTexture(`${path}/metalness.webp`)
    });


    this.materialCache.set(topColorId, material);
    return material;
  }

  private static getTexture(fullPath: string, isColor = false): THREE.Texture {
    const cached = this.textureCache.get(fullPath);
    if (cached) return cached;

    const texture = this.textureLoader.load(fullPath, (loadedTexture) => {
      loadedTexture.generateMipmaps = true;
      loadedTexture.minFilter = THREE.LinearMipmapLinearFilter;
      loadedTexture.magFilter = THREE.LinearFilter;
      loadedTexture.anisotropy = 8;
      loadedTexture.needsUpdate = true;
    });
    texture.flipY = false;
    texture.colorSpace = isColor ? THREE.SRGBColorSpace : THREE.NoColorSpace;

    this.textureCache.set(fullPath, texture);
    return texture;
  }

  private static fadeInMaterial(material: THREE.MeshStandardMaterial) {
    const previousRaf = this.materialFadeRaf.get(material.uuid)
    if (previousRaf) {
      cancelAnimationFrame(previousRaf)
    }

    material.transparent = true
    material.opacity = 0.86

    const start = performance.now()
    const duration = 240

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      material.opacity = 0.86 + progress * 0.14
      material.needsUpdate = true

      if (progress < 1) {
        const rafId = requestAnimationFrame(tick)
        this.materialFadeRaf.set(material.uuid, rafId)
      } else {
        material.opacity = 1
        this.materialFadeRaf.delete(material.uuid)
      }
    }

    const rafId = requestAnimationFrame(tick)
    this.materialFadeRaf.set(material.uuid, rafId)
  }
}
