import { ViewerCanvas } from '../canvas/ViewerCanvas'
import { RightPanelRenderer } from '../panels/RightPanelRenderer'
import './../styles/configurator.css'

export const ConfiguratorLayout = () => {
  return (
    <div className="configurator-layout">
      <div className="viewer-area">
        <ViewerCanvas />
      </div>

      <div className="right-panel">
        <RightPanelRenderer />
      </div>
    </div>
  )
}
