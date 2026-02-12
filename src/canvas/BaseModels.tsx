import { observer } from 'mobx-react-lite'
import { useGLTF } from '@react-three/drei'
import { BASE_OPTIONS } from '../data/baseOptions'
import { configuratorStore } from '../store/configuratorStore'
import { Suspense, useEffect, useMemo} from 'react'
import { Box3, Vector3 } from 'three'
import { ModelManager } from '../managers/ModelManager'

type ModelProps = {
  path: string
  visible: boolean
}

const Model = observer(({ path, visible }: ModelProps) => {
  const { scene } = useGLTF(path)

  console.log(scene);

  useEffect(() => {
    if (visible) {
      ModelManager.applyBaseColor(scene)
      scene.traverse((child: any) => {
        if (!child.isMesh) return
        child.castShadow = true
        child.receiveShadow = true
      })
    }
  }, [visible, configuratorStore.baseColorId, scene])

  // Adjust left/right mesh x-positions when top length changes
  useEffect(() => {
    if (!visible) return

    const adjustableBases = ['LINEA', 'CURVA', 'TWISTE', 'MOON']
    if (!adjustableBases.includes(configuratorStore.baseId)) return

    // find candidate meshes (named left / right). Some models use different names
    // so we fall back to selecting the leftmost and rightmost candidate meshes.
    let left: any = null
    let right: any = null

    const candidates: any[] = []
    scene.traverse((child: any) => {
      if (!child.isMesh) return
      // prefer meshes that are direct children or one-level deep
      if (child.parent === scene || child.parent?.parent === scene) candidates.push(child)
    })

    // try to detect by name first
    for (const c of candidates) {
      if (!c.name) continue
      const name = c.name.toLowerCase()
      if (name.includes('left')) left = c
      if (name.includes('right')) right = c
    }

    // fallback: pick leftmost and rightmost by x position
    if ((!left || !right) && candidates.length >= 2) {
      candidates.sort((a, b) => a.position.x - b.position.x)
      left = candidates[0]
      right = candidates[candidates.length - 1]
    }

    if (!left || !right) return

    // store original positions once
    const origLeftKey = 'origX'
    const origRightKey = 'origX'
    if (left.userData[origLeftKey] == null) left.userData[origLeftKey] = left.position.x
    if (right.userData[origRightKey] == null) right.userData[origRightKey] = right.position.x

    const origLeftX = left.userData[origLeftKey]
    const origRightX = right.userData[origRightKey]
    let originalDistance = Math.abs(origRightX - origLeftX)
    if (originalDistance === 0) originalDistance = Math.abs(right.position.x - left.position.x) || 0.001

    // compute bounding boxes to avoid collision
    const boxL = new Box3().setFromObject(left)
    const boxR = new Box3().setFromObject(right)
    const sizeL = new Vector3()
    const sizeR = new Vector3()
    boxL.getSize(sizeL)
    boxR.getSize(sizeR)

    const halfL = sizeL.x / 2
    const halfR = sizeR.x / 2
    const clearance = 0.005 // small gap in world units
    const minDistance = halfL + halfR + clearance

    const topOption = configuratorStore.currentTopOption
    const defaultLength = topOption?.defaultLength || configuratorStore.topLength || 1

    // scale target distance proportional to top length relative to default
    const requestedLength = Math.max(1, configuratorStore.topLength)
    let targetDistance = originalDistance * (requestedLength / defaultLength)
    // clamp between minDistance and originalDistance
    targetDistance = Math.max(minDistance, Math.min(originalDistance, targetDistance))

    // center is assumed 0
    const centerX = 0
    const leftTargetX = centerX - targetDistance / 2
    const rightTargetX = centerX + targetDistance / 2

    // animate instantly by setting positions; if you want easing, replace with tween logic
    left.position.x = leftTargetX
    right.position.x = rightTargetX
    left.matrixWorldNeedsUpdate = true
    right.matrixWorldNeedsUpdate = true

  }, [visible, scene, configuratorStore.topLength, configuratorStore.baseId])

  return (
    <group visible={visible} >
      <primitive object={scene} />
    </group>
  )
  
})


type BaseModelsProps = {
  visible?: boolean
}

export const BaseModels = observer(({ visible = true }: BaseModelsProps) => {
  // Find only the active base object
  const activeBase = useMemo(() => 
    BASE_OPTIONS.find(b => b.id === configuratorStore.baseId),
    [configuratorStore.baseId]
  );

  if (!activeBase) return null;

  return (
    <Suspense fallback={null}>
      <Model 
        path={activeBase.model} 
        visible={visible}
      />
    </Suspense>
  )
})
// Preload models
BASE_OPTIONS.forEach(base => {
  useGLTF.preload(base.model)
})
