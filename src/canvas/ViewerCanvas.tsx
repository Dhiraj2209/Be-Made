import { useEffect, useMemo, useRef, useState } from "react"
import { useThree } from '@react-three/fiber'
import { Canvas } from "@react-three/fiber"
import { OrbitControls, useProgress } from "@react-three/drei"
import { ChevronLeft, ChevronRight, Info, Maximize, Save, Share2, X } from "lucide-react"
import { observer } from "mobx-react-lite"
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib"
import { PCFSoftShadowMap, type PerspectiveCamera } from "three"
import { BaseModels } from "./BaseModels"
import { TableTopModels } from "./TableTopModels"
import { ChairModels } from "./ChairModels"
import { TOP_COLORS } from "./../data/topColors"
import { configuratorStore } from "../store/configuratorStore"
import { animateCameraView, getCameraViews } from "./cameraViewHelper"
import { getBuildSummary } from "../utils/buildSummary"
import "./viewer.css"

export const ViewerCanvas = observer(() => {
  const [showInfo, setShowInfo] = useState(false)
  const [showSharePanel, setShowSharePanel] = useState(false)
  const { active: assetsLoading } = useProgress()
  const [showLoadingText, setShowLoadingText] = useState(false)
  const viewerRef = useRef<HTMLDivElement>(null)
  const controlsRef = useRef<OrbitControlsImpl | null>(null)
  const stopCameraAnimationRef = useRef<(() => void) | null>(null)
  const isInitialCameraSyncRef = useRef(true)
  const [activeViewIndex, setActiveViewIndex] = useState(0)
  const [hoveredViewIndex, setHoveredViewIndex] = useState<number | null>(null)

  const currentColor =
    TOP_COLORS.find(c => c.id === configuratorStore.topColorId) || TOP_COLORS[0]
  const cameraViews = useMemo(
    () => getCameraViews(configuratorStore.chairQty),
    [configuratorStore.chairQty]
  )
  const activeView = cameraViews[activeViewIndex] || cameraViews[0]
  const activeViewId = activeView?.id
  const showTableOnlyView =
    activeViewId === "front_view" ||
    activeViewId === "left_view" ||
    activeViewId === "top_view" ||
    activeViewId === "right_view"
  const showTwoChairPreview = activeViewId === "two_chair_view"
  const showTableWithChairs =
    activeViewId === "chair_view" || activeViewId === "chair_top_view"
  const summary = getBuildSummary(configuratorStore)

  useEffect(() => {
    if (activeViewIndex > cameraViews.length - 1 || activeViewIndex < 0) {
      setActiveViewIndex(0)
    }
  }, [activeViewIndex, cameraViews.length])

  useEffect(() => {
    if (!assetsLoading) {
      setShowLoadingText(false)
      return
    }
    const timeoutId = window.setTimeout(() => {
      setShowLoadingText(true)
    }, 550)
    return () => window.clearTimeout(timeoutId)
  }, [assetsLoading])

  useEffect(() => {
    if (!activeView) return
    if (isInitialCameraSyncRef.current) {
      stopCameraAnimationRef.current?.()
      stopCameraAnimationRef.current = animateCameraView(controlsRef.current, activeView, 1)
      isInitialCameraSyncRef.current = false
      return
    }
    stopCameraAnimationRef.current?.()
    stopCameraAnimationRef.current = animateCameraView(
      controlsRef.current,
      activeView,
      // sceneTweak.animationDuration
      1600
    )
  }, [activeView, 1600])

  useEffect(() => {
    return () => {
      stopCameraAnimationRef.current?.()
    }
  }, [])

  useEffect(() => {
    const preferredViewIndex = cameraViews.findIndex(
      view => view.id === configuratorStore.preferredViewId
    )
    if (preferredViewIndex >= 0 && preferredViewIndex !== activeViewIndex) {
      setActiveViewIndex(preferredViewIndex)
    }
  }, [cameraViews, activeViewIndex, configuratorStore.viewPreferenceVersion])

  useEffect(() => {
    const canvas = viewerRef.current?.querySelector("canvas")
    if (!canvas) return
    configuratorStore.setCanvasSnapshot(canvas.toDataURL("image/webp", 0.92))
  }, [configuratorStore.canvasSnapshotRequestVersion])

  useEffect(() => {
    const camera = controlsRef.current?.object as PerspectiveCamera | undefined
    if (!camera) return
    camera.fov = 55
    camera.updateProjectionMatrix()
  },)

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      viewerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen()
    }
  }

  const goToPreviousView = () => {
    setActiveViewIndex(prev => {
      const nextIndex = (prev - 1 + cameraViews.length) % cameraViews.length
      const view = cameraViews[nextIndex]
      if (view) configuratorStore.setPreferredView(view.id)
      return nextIndex
    })
  }

  const goToNextView = () => {
    setActiveViewIndex(prev => {
      const nextIndex = (prev + 1) % cameraViews.length
      const view = cameraViews[nextIndex]
      if (view) configuratorStore.setPreferredView(view.id)
      return nextIndex
    })
  }

  const getCanvasElement = () =>
    viewerRef.current?.querySelector("canvas") as HTMLCanvasElement | null

  const getCanvasImageDataUrl = () => {
    const canvas = getCanvasElement()
    if (!canvas) return null
    try {
      return canvas.toDataURL("image/png", 1)
    } catch {
      return null
    }
  }

  const downloadDataUrl = (dataUrl: string, fileName: string) => {
    const link = document.createElement("a")
    link.href = dataUrl
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  const getDimensionsText = () => {
    if (configuratorStore.topId === "ROUND") {
      return `${configuratorStore.topLength} (Diameter)`
    }
    if (configuratorStore.topId === "SQUARE") {
      return `${configuratorStore.topLength}`
    }
    return `${configuratorStore.topLength} x ${configuratorStore.topWidth}`
  }

  const getShareRows = () => [
    { label: "Table Top", value: summary.topColor },
    { label: "Table Base", value: summary.baseName },
    { label: "Table Base Colour", value: summary.baseColor },
    { label: "Dimensions (mm)", value: getDimensionsText() },
    { label: "Table Top Shape", value: summary.topShape },
    { label: "Chair Style", value: summary.chairName },
    { label: "Chair Color", value: summary.chairColor },
  ]

  const escapeHtml = (value: string) =>
    value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;")

  const handleSaveImage = () => {
    const dataUrl = getCanvasImageDataUrl()
    if (!dataUrl) return
    downloadDataUrl(dataUrl, `bemade-design-${Date.now()}.png`)
  }

  const handleDownloadPdf = () => {
    const dataUrl = getCanvasImageDataUrl() || configuratorStore.canvasSnapshot
    if (!dataUrl) return

    const rowsMarkup = getShareRows()
      .map(
        row =>
          `<tr><td>${escapeHtml(row.label)}</td><td>${escapeHtml(
            row.value || "N/A"
          )}</td></tr>`
      )
      .join("")

    const popup = window.open("", "_blank", "width=960,height=860")
    if (!popup) return

    popup.document.write(`
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>BeMade Summary</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 24px; color: #111; }
            .sheet { max-width: 860px; margin: 0 auto; }
            h1 { font-size: 24px; margin: 0 0 12px; }
            .meta { color: #555; margin-bottom: 18px; font-size: 13px; }
            img { width: 100%; border-radius: 12px; border: 1px solid #ddd; margin-bottom: 16px; }
            table { width: 100%; border-collapse: collapse; }
            td { border: 1px solid #ddd; padding: 10px; font-size: 14px; }
            td:first-child { width: 40%; font-weight: 600; background: #f8f8f8; }
            .print-note { margin-top: 12px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="sheet">
            <h1>BeMade Build Summary</h1>
            <div class="meta">Generated on ${new Date().toLocaleString()}</div>
            <img src="${dataUrl}" alt="Configured table preview" />
            <table>
              <tbody>${rowsMarkup}</tbody>
            </table>
            <div class="print-note">Use Print -> Save as PDF to download this file.</div>
          </div>
          <script>
            window.addEventListener('load', function () {
              setTimeout(function () { window.print(); }, 250);
            });
          </script>
        </body>
      </html>
    `)
    popup.document.close()
  }

  const handleShareWhatsApp = async () => {
    const messageLines = [
      "BeMade Build Summary",
      ...getShareRows().map(row => `${row.label}: ${row.value || "N/A"}`),
      `Design URL: ${window.location.href}`,
    ]
    const message = messageLines.join("\n")
    const dataUrl = getCanvasImageDataUrl()

    if (navigator.share && dataUrl) {
      try {
        const response = await fetch(dataUrl)
        const blob = await response.blob()
        const imageFile = new File([blob], "bemade-design.png", { type: "image/png" })
        if (navigator.canShare?.({ files: [imageFile] })) {
          await navigator.share({
            title: "BeMade Build Summary",
            text: message,
            files: [imageFile],
          })
          return
        }
      } catch {
        // Fall back to WhatsApp URL below.
      }
    }

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank", "noopener,noreferrer")
  }

  return (
    <div ref={viewerRef} className="viewer-wrapper">
      <Canvas
        camera={{ position: [0, 1.25, 3], fov: 55 }}
        shadows
        dpr={[5, 2]}
        gl={{ alpha: true, antialias: true, preserveDrawingBuffer: true }}
        onCreated={({ gl }) => {
          // Use soft shadow filtering globally so edges stay smooth instead of sharp/hard.
          gl.shadowMap.enabled = true
          gl.shadowMap.type = PCFSoftShadowMap
        }}
      >
        {/* Soft global lift: keeps all materials readable without flattening contrast. */}
        <ambientLight intensity={0.52} />
        {/* Sky/ground fill: adds subtle top/bottom color separation for a natural studio look. */}
        <hemisphereLight groundColor={0x555555} intensity={0.2} />

        {/* Key light: main sculpting light for shape definition and primary contact shadows. */}
        <directionalLight
          position={[3.8, 5.4, 3.2]}
          intensity={1.05}
          // castShadow
          // shadow-mapSize-width={4096}
          // shadow-mapSize-height={4096}
          // shadow-camera-near={0.5}
          // shadow-camera-far={20}
          // shadow-camera-left={-7}
          // shadow-camera-right={7}
          // shadow-camera-top={7}
          // shadow-camera-bottom={-7}
          // shadow-bias={-0.00022}
          // shadow-normalBias={0.02}
        />

        {/* Fill light from opposite side: softens dark areas while preserving depth. */}
        <directionalLight
          position={[-3.2, 3.2, -2.4]}
          intensity={0.34}
          color={0xffffff}
        />

        {/* Overhead spot: gives a controlled highlight on top surfaces and gentle center grounding. */}
        <spotLight
          position={[0, 8.8, 2.2]}
          angle={0.62}
          penumbra={0.8}
          intensity={0.62}
          distance={15}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-bias={-0.0002}
          shadow-normalBias={0.02}
        />

        <group>
          <BaseModels visible={showTableOnlyView || showTableWithChairs} />
          <TableTopModels visible={showTableOnlyView || showTableWithChairs} />
          <ChairModels visible={showTwoChairPreview} mode="preview_pair" />
          <ChairModels visible={showTableWithChairs} mode="placement" />
        </group>

        {/* Handler inside Canvas to reliably capture the renderer DOM when requested */}
        <SnapshotHandler />

        <mesh
          position={[0, -0.001, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          receiveShadow
        >
          <planeGeometry args={[30, 30]}  />
          <shadowMaterial transparent opacity={0.13} />
        </mesh>

        <OrbitControls
          ref={controlsRef}
          enabled={false}
          enablePan={false}
          enableRotate={false}
          enableZoom={false}
        />
      </Canvas>

      {/* Top Right Controls */}
      <div className="top-right-controls">
        <button className="icon-btn-simple" onClick={handleSaveImage} title="Save image">
          <Save size={20} />
        </button>
        <button
          className="icon-btn-simple"
          onClick={() => setShowSharePanel(prev => !prev)}
          title="Share"
        >
          <Share2 size={20} />
        </button>
        <button className="icon-btn-simple" onClick={toggleFullscreen}><Maximize size={20} /></button>
      </div>

      {showSharePanel && (
        <div className="share-panel">
          <button className="share-action-btn" onClick={handleDownloadPdf}>
            Download PDF
          </button>
          <button className="share-action-btn" onClick={handleShareWhatsApp}>
            WhatsApp
          </button>
        </div>
      )}

      {/* Bottom Left Info Trigger */}
      <div className="bottom-left-controls">
        <button className="icon-btn-simple" onClick={() => setShowInfo(!showInfo)}>
          <Info size={24} />
        </button>
      </div>

      <div className="camera-views-controls">
        <div className="camera-view-nav">
          <button
            className="camera-arrow-btn"
            onClick={goToPreviousView}
            aria-label="Previous camera view"
          >
            <ChevronLeft size={24} />
          </button>

          <div className="camera-view-dots">
            {cameraViews.map((view, index) => (
              <div
                key={view.id}
                className="camera-dot-wrap"
                onMouseEnter={() => setHoveredViewIndex(index)}
                onMouseLeave={() => setHoveredViewIndex(null)}
              >
                <button
                  className={`camera-dot ${index === activeViewIndex ? "active" : ""}`}
                  onClick={() => {
                    setActiveViewIndex(index)
                    configuratorStore.setPreferredView(view.id)
                  }}
                  onFocus={() => setHoveredViewIndex(index)}
                  onBlur={() => setHoveredViewIndex(null)}
                  aria-label={view.label}
                />
                {hoveredViewIndex === index && (
                  <div className="camera-dot-tooltip">{view.label}</div>
                )}
              </div>
            ))}
          </div>

          <button
            className="camera-arrow-btn"
            onClick={goToNextView}
            aria-label="Next camera view"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      {/* Floating Info Panel - Exact Match to Screenshot */}
      {showInfo && (
        <div className="info-card-overlay">
          <div className="info-card-content">
            <div className="info-card-header">
               <h2 className="info-card-title">{currentColor.title}</h2>
               <button className="info-card-close" onClick={() => setShowInfo(false)}>
                 <X size={20} />
               </button>
            </div>
            
            <div className="info-card-pill">{currentColor.type}</div>
            
            <p className="info-card-description">
              {currentColor.description}
            </p>
          </div>
        </div>
      )}

      {showLoadingText && (
        <div className="viewer-loading-indicator">Loading 3D Configurator...</div>
      )}

    </div>
  )
})

function SnapshotHandler() {
  const { gl } = useThree()

  useEffect(() => {
    const tryCapture = () => {
      try {
        // prefer renderer's canvas
        const rendererCtx = (gl as any).getContext ? (gl as any).getContext() : null
        if (rendererCtx && rendererCtx.isContextLost && rendererCtx.isContextLost()) {
          throw new Error('webgl context lost')
        }
        const canvas = (gl as any).domElement as HTMLCanvasElement
        if (canvas && canvas.toDataURL) {
          const data = canvas.toDataURL('image/webp', 0.92)
          configuratorStore.setCanvasSnapshot(data)
          return true
        }
      } catch (e) {
        // ignore and fallback below
      }

      // fallback: try DOM query for canvas
      try {
        const canvas = document.querySelector('.viewer-wrapper canvas') as HTMLCanvasElement | null
        if (canvas && canvas.toDataURL) {
          configuratorStore.setCanvasSnapshot(canvas.toDataURL('image/webp', 0.92))
          return true
        }
      } catch (e) {
        // ignore
      }

      return false
    }

    const handler = () => {
      // try capture immediately; if it fails, try again shortly
      const ok = tryCapture()
      if (!ok) {
        setTimeout(() => tryCapture(), 200)
      }
    }

    // subscribe to mobx change via polling on version value
    let last = configuratorStore.canvasSnapshotRequestVersion
    const iv = setInterval(() => {
      if (configuratorStore.canvasSnapshotRequestVersion !== last) {
        last = configuratorStore.canvasSnapshotRequestVersion
        handler()
      }
    }, 80)

    return () => clearInterval(iv)
  }, [gl])

  return null
}
