import { observer } from 'mobx-react-lite'
import { useGLTF } from '@react-three/drei'
import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { configuratorStore } from '../store/configuratorStore'
import { CHAIR_OPTIONS } from '../data/chairOptions'
import { CHAIR_COLOR_OPTIONS } from '../data/ChairColorOptions'
import { calculateChairPlacements, type Placement } from '../managers/ChairPlacementManager'
import type { ChairColorOption, ChairColorMaps } from '../types/configurator'

type ChairRenderMode = 'placement' | 'preview_pair'

type ChairModelsProps = {
  visible?: boolean
  mode?: ChairRenderMode
}

const chairTextureCache = new Map<string, THREE.Texture>()
const chairMaterialCache = new Map<string, THREE.MeshStandardMaterial>()
const chairTextureLoader = new THREE.TextureLoader()

const getTexture = (path: string, isColor = false) => {
  const cached = chairTextureCache.get(path)
  if (cached) return cached

  const texture = chairTextureLoader.load(path, (loadedTexture) => {
    loadedTexture.generateMipmaps = true
    loadedTexture.minFilter = THREE.LinearMipmapLinearFilter
    loadedTexture.magFilter = THREE.LinearFilter
    loadedTexture.anisotropy = 8
    loadedTexture.needsUpdate = true
  })
  texture.colorSpace = isColor ? THREE.SRGBColorSpace : THREE.NoColorSpace

  chairTextureCache.set(path, texture)
  return texture
}

const getChairMaterial = (maps: ChairColorMaps, part: 'leg' | 'top') => {
  const key = `${part}:${maps.map}:${maps.normalMap}:${maps.roughnessMap}:${maps.metalnessMap}`
  const cached = chairMaterialCache.get(key)
  if (cached) return cached

  const material = new THREE.MeshStandardMaterial({
    map: getTexture(maps.map, true),
    normalMap: getTexture(maps.normalMap),
    roughnessMap: getTexture(maps.roughnessMap),
    metalnessMap: getTexture(maps.metalnessMap),
    envMapIntensity: 1
  })
  chairMaterialCache.set(key, material)
  return material
}

type SingleChairProps = {
  scene: THREE.Object3D
  colorData: ChairColorOption
  placement: Placement
}

const SingleChair = ({ scene, colorData, placement }: SingleChairProps) => {
  const clone = useMemo(() => scene.clone(true), [scene])

  useEffect(() => {
    clone.traverse((child: THREE.Object3D) => {
      const mesh = child as THREE.Mesh
      if (!mesh.isMesh) return

      const isLeg = mesh.name.toLowerCase().includes('leg')
      const mapSet = isLeg ? colorData.maps.leg : colorData.maps.top
      mesh.material = getChairMaterial(mapSet, isLeg ? 'leg' : 'top')
      mesh.castShadow = true
      mesh.receiveShadow = true
    })
  }, [clone, colorData])

  return (
    <primitive
      object={clone}
      position={placement.position}
      rotation={placement.rotation}
    />
  )
}

const PREVIEW_PAIR_PLACEMENTS: Placement[] = [
  { position: [-0.34, 0, 0], rotation: [0, Math.PI, 0] },
  { position: [0.34, 0, 0], rotation: [0, 0, 0] }
]

export const ChairModels = observer(({ visible = true, mode = 'placement' }: ChairModelsProps) => {
  const { chairId, chairColorId, chairQty, topId, topLength, topWidth } = configuratorStore

  const chairData = useMemo(
    () => CHAIR_OPTIONS.find(c => c.id === chairId),
    [chairId]
  )

  const colorData = useMemo(
    () => (chairId ? CHAIR_COLOR_OPTIONS[chairId]?.find(c => c.id === chairColorId) : null),
    [chairId, chairColorId]
  )

  const { scene } = useGLTF(chairData?.model || CHAIR_OPTIONS[0].model)

  const placements = useMemo(() => {
    if (mode === 'preview_pair') return PREVIEW_PAIR_PLACEMENTS
    return calculateChairPlacements(topId, topLength, topWidth, chairQty)
  }, [mode, topId, topLength, topWidth, chairQty])

  if (!visible || !chairId || !colorData) return null
  if (mode === 'placement' && chairQty <= 0) return null

  return (
    <group>
      {placements.map((placement, index) => (
        <SingleChair
          key={`${chairId}-${mode}-${index}`}
          scene={scene}
          colorData={colorData}
          placement={placement}
        />
      ))}
    </group>
  )
})

CHAIR_OPTIONS.forEach(chair => {
  useGLTF.preload(chair.model)
})
