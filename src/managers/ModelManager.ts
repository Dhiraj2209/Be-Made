import * as THREE from 'three'
import { BASE_COLOR_OPTIONS } from '../data/baseColors'
import { configuratorStore } from '../store/configuratorStore'

export class ModelManager {
  private static textureLoader = new THREE.TextureLoader()
  private static textureCache = new Map<string, THREE.Texture>()
  private static materialCache = new Map<string, THREE.MeshStandardMaterial>()
  private static readonly OUTSIDE_TEXTURE_BASES = new Set([
    'LINEA',
    'LINEA_DOME',
    'LINEA_CONTOUR',
  ])

  static applyBaseColor(scene: THREE.Object3D) {
    const baseId = configuratorStore.baseId
    const colorId = configuratorStore.baseColorId    

    const colors = BASE_COLOR_OPTIONS[baseId]
    if (!colors) return

    const selectedColor = colors.find(c => c.id === colorId)
    if (!selectedColor) return

    const flipY = this.OUTSIDE_TEXTURE_BASES.has(baseId)
    const cacheKey = `${baseId}:${colorId}:${flipY ? 'flipY' : 'default'}`
    let material = this.materialCache.get(cacheKey)
    if (!material) {
      const map = this.getTexture(selectedColor.maps.map, true, flipY)
      const normalMap = this.getTexture(selectedColor.maps.normalMap, false, flipY)
      const roughnessMap = this.getTexture(selectedColor.maps.roughnessMap, false, flipY)
      const metalnessMap = this.getTexture(selectedColor.maps.metalnessMap, false, flipY)

      material = new THREE.MeshStandardMaterial({
        map,
        normalMap: normalMap || undefined,
        roughnessMap: roughnessMap || undefined,
        metalnessMap: metalnessMap || undefined,
        metalness: 0.05,
        roughness: 0.55,
        envMapIntensity: 1,
        side: THREE.FrontSide,
      })

      // ensure correct color space for color map on the material if available
      try {
        if (map) {
          // three r152+ uses .colorSpace, earlier versions use .encoding
          // set both where available for compatibility
          // @ts-ignore
          if (map.colorSpace !== undefined) map.colorSpace = THREE.SRGBColorSpace
          // @ts-ignore
          if (map.encoding !== undefined) map.encoding = THREE.sRGBEncoding
        }
      } catch (e) {
        // ignore
      }

      material.needsUpdate = true
      this.materialCache.set(cacheKey, material)
    }



    scene.traverse((child: any) => {
      if (child.isMesh) {
        child.material = material
      }
    })
  }

  private static getTexture(path: string, isColor = false, flipY = false): THREE.Texture {
    const textureKey = `${path}:${isColor ? 'color' : 'data'}:${flipY ? 'flipY' : 'default'}`
    const cached = this.textureCache.get(textureKey)
    if (cached) return cached

    const texture = this.textureLoader.load(path, (loadedTexture) => {
      loadedTexture.generateMipmaps = true
      loadedTexture.minFilter = THREE.LinearMipmapLinearFilter
      loadedTexture.magFilter = THREE.LinearFilter
      loadedTexture.anisotropy = 8
      loadedTexture.flipY = flipY
      loadedTexture.needsUpdate = true
    })
    texture.colorSpace = isColor ? THREE.SRGBColorSpace : THREE.NoColorSpace
    texture.flipY = flipY
    this.textureCache.set(textureKey, texture)
    return texture
  }
}
