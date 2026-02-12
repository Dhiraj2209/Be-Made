// src/managers/ChairManager.ts
import * as THREE from 'three';

export class ChairManager {
  private static loader = new THREE.TextureLoader();

  static applyChairTextures(scene: THREE.Group, chairId: string, colorId: string) {
    const path = `/assets/images/accessories/${chairId}/${colorId}`;

    const load = (file: string, isColor = false) => {
      const tex = this.loader.load(`${path}/${file}`);
      tex.flipY = false;
      if (isColor) tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    };

    scene.traverse((child: any) => {
      if (child.isMesh) {
        // We look for mesh names containing 'leg' or 'top' 
        // Note: Ensure your GLB mesh names match these keywords
        const isLeg = child.name.toLowerCase().includes('leg');
        const prefix = isLeg ? 'chairLeg' : 'chairTop';

        child.material = new THREE.MeshStandardMaterial({
          map: load(`${prefix}Color.webp`, true),
          normalMap: load(`${prefix}Normal.webp`),
          roughnessMap: load(`${prefix}Roughness.webp`),
          metalnessMap: load(`${prefix}Metalness.webp`),
        });
      }
    });
  }
}