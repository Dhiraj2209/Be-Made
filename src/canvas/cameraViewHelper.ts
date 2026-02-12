import type { OrbitControls as OrbitControlsImpl } from "three-stdlib"
import * as THREE from "three"

export type CameraView = {
  id:
    | "front_view"
    | "left_view"
    | "top_view"
    | "right_view"
    | "two_chair_view"
    | "chair_view"
    | "chair_top_view"
  label: string
  position: [number, number, number]
  target: [number, number, number]
}

const BASE_CAMERA_VIEWS: CameraView[] = [
  {
    id: "front_view",
    label: "Front View",
    position: [0, 1.3, 3],
    target: [0, 0.5, 0]
  },
  {
    id: "left_view",
    label: "Left View",
    position: [-2.8, 1, 1.2],
    target: [0, 0.4, 0]
  },
  {
    id: "top_view",
    label: "Top View",
    position: [0, 3.5, 0.01],
    target: [0, 0.5, 0]
  },
  {
    id: "right_view",
    label: "Right View",
    position: [3.2, 1.2, 1.2],
    target: [0, 0.7, 0]
  }
]

const CHAIR_CAMERA_VIEWS: CameraView[] = [
  {
    id: "two_chair_view",
    label: "Two Chair View",
    position: [0, 0.75, 2],
    target: [0, 0.4, 0]
  },
  {
    id: "chair_view",
    label: "Chair Right View",
    position: [3.1, 1.35, 1.5],
    target: [0, 0.4, 0]
  },
  {
    id: "chair_top_view",
    label: "Chair Top View",
    position: [0, 3.8, 0.2],
    target: [0, 0.7, 0]
  }
]

export const getCameraViews = (chairQty: number): CameraView[] => {
  if (chairQty > 0) {
    return [...BASE_CAMERA_VIEWS, ...CHAIR_CAMERA_VIEWS]
  }

  return BASE_CAMERA_VIEWS
}

export const applyCameraView = (
  controls: OrbitControlsImpl | null,
  view: CameraView
) => {
  if (!controls) return

  controls.object.position.set(...view.position)
  controls.target.set(...view.target)
  controls.update()
}


export const animateCameraView = (
  controls: OrbitControlsImpl | null,
  view: CameraView,
  duration = 1200
) => {
  if (!controls) return () => {}

  const camera = controls.object
  const startPosition = camera.position.clone()
  const startTarget = controls.target.clone()
  const endPosition = new THREE.Vector3(...view.position)
  const endTarget = new THREE.Vector3(...view.target)

  const distance = startPosition.distanceTo(endPosition)

  // 🔥 Prevent tiny awkward movements
  if (distance < 0.15) {
    camera.position.copy(endPosition)
    controls.target.copy(endTarget)
    controls.update()
    return () => {}
  }

  const startTime = performance.now()
  let rafId = 0

  // 🎬 Smooth cinematic easing
  const easeInOutCubic = (t: number) =>
    t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2

  // 🌀 Create slight arc for premium motion
  const midPoint = startPosition.clone().lerp(endPosition, 0.5)

  const arcHeight = distance * 0.2
  midPoint.y += arcHeight

  const curve = new THREE.QuadraticBezierCurve3(
    startPosition,
    midPoint,
    endPosition
  )

  const tick = (now: number) => {
    const elapsed = now - startTime
    const progress = Math.min(elapsed / duration, 1)
    const eased = easeInOutCubic(progress)

    const newPos = curve.getPoint(eased)
    camera.position.copy(newPos)

    // Slight delay on target for elegance
    const targetEase = easeInOutCubic(Math.min(progress * 1.25, 1))
    controls.target.lerpVectors(startTarget, endTarget, targetEase)

    controls.update()

    if (progress < 1) {
      rafId = requestAnimationFrame(tick)
    }
  }

  rafId = requestAnimationFrame(tick)

  return () => {
    cancelAnimationFrame(rafId)
  }
}
