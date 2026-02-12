import { observer } from "mobx-react-lite"
import { BasePanel } from "./BasePanel"
import { TopColorPanel } from "./TopColorPanel"
import { SummaryPanel } from "./SummaryPanel"
import { BaseColorPanel } from "./baseColorPanel"
import { TopShapePanel } from "./TopShapePanel"
import { DimensionPanel } from "./DimensionPanel"
import { ChairPanel } from "./ChairPanel"

export const RightPanelRenderer = observer(() => {
  return (
    <div className="right-panel-scroll" id="rightPanel">

      <div id="BASE" className="right-panel-section"><BasePanel /></div>
      <div id="BASE_COLOR" className="right-panel-section"><BaseColorPanel /></div>
      <div id="TOP_COLOR" className="right-panel-section"><TopColorPanel /></div>
      <div id="TOP_SHAPE" className="right-panel-section"><TopShapePanel /></div>
      <div id="DIMENSION" className="right-panel-section"><DimensionPanel /></div>
      <div id="CHAIR" className="right-panel-section"><ChairPanel /></div>
      <div id="SUMMARY" className="right-panel-section"><SummaryPanel /></div>

    </div>
  )
})
