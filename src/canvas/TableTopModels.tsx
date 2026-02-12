import { observer } from 'mobx-react-lite'
import { useGLTF } from '@react-three/drei'
import { Suspense, useEffect, useMemo, useRef } from 'react'
import { configuratorStore } from '../store/configuratorStore'
import { TableTopManager } from '../managers/TableTopManager'
import { TOP_OPTIONS } from '../data/topOptions'
import * as THREE from 'three'

type TopModelProps = {
  stonePath: string
  mdfPath: string
  visible: boolean
}

const TopModel = observer(({ stonePath, mdfPath, visible }: TopModelProps) => {
  const stone = useGLTF(stonePath)
  const mdf = useGLTF(mdfPath)

  const groupRef = useRef<THREE.Group>(null)

  const stoneClone = useMemo(() => stone.scene.clone(true), [stone.scene])
  const mdfClone = useMemo(() => mdf.scene.clone(true), [mdf.scene])

  const originalSize = useMemo(() => {
    const box = new THREE.Box3().setFromObject(stoneClone)
    const size = new THREE.Vector3()
    box.getSize(size)
    return size
  }, [stoneClone])

  useEffect(() => {
    if (!visible) return
    TableTopManager.apply(stoneClone)
    mdfClone.traverse((child: any) => {
      if (!child.isMesh) return
      child.castShadow = true
      child.receiveShadow = true
    })
  }, [visible, stoneClone, mdfClone, configuratorStore.topColorId])

  const scale = useMemo(() => {
    let scaleX = 1
    let scaleZ = 1

    const lengthMM = originalSize.x * 1000
    const widthMM = originalSize.z * 1000

    if (configuratorStore.topLength && configuratorStore.topWidth) {
      if (configuratorStore.topId === 'ROUND' || configuratorStore.topId === 'SQUARE') {
        const uniformScale = configuratorStore.topLength / lengthMM
        scaleX = uniformScale
        scaleZ = uniformScale
      } else {
        scaleX = configuratorStore.topLength / lengthMM
        scaleZ = configuratorStore.topWidth / widthMM
      }
    }

    return { scaleX, scaleZ }
  }, [
    originalSize.x,
    originalSize.z,
    configuratorStore.topId,
    configuratorStore.topLength,
    configuratorStore.topWidth
  ])

  useEffect(() => {
    if (!visible) return
    TableTopManager.applyTextureProjection(stoneClone, scale.scaleX, scale.scaleZ)
  }, [visible, stoneClone, scale.scaleX, scale.scaleZ, configuratorStore.topColorId])

  return (
    <group ref={groupRef} visible={visible} scale={[scale.scaleX, 1, scale.scaleZ]}>
      <primitive object={mdfClone} />
      <primitive object={stoneClone} position={[0, 0, 0]} />
    </group>
  )
})

type TableTopModelsProps = {
  visible?: boolean
}

export const TableTopModels = observer(({ visible = true }: TableTopModelsProps) => {
  return (
    <Suspense fallback={null}>
      {TOP_OPTIONS.map(top => (
        <TopModel
          key={top.id}
          stonePath={top.model}
          mdfPath={top.modelMdf}
          visible={visible && configuratorStore.topId === top.id}
        />
      ))}
    </Suspense>
  )
})

TOP_OPTIONS.forEach(top => {
  useGLTF.preload(top.model)
  useGLTF.preload(top.modelMdf)
})
