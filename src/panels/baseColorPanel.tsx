import { observer } from "mobx-react-lite"
import { configuratorStore } from "../store/configuratorStore"
import { BASE_COLOR_OPTIONS } from "../data/baseColors"
import { CheckCircle2 } from "lucide-react"

export const BaseColorPanel = observer(() => {
  const colors =
    BASE_COLOR_OPTIONS[configuratorStore.baseId] || []

    if (!colors.length) {
    return <p style={{ opacity: 0.6 }}>No colours available</p>
  }
  
  return (
    <div className="panel-section">
      <h2>Choose Base Colour</h2>

      <div className="color-grid">
        {colors.map((color) => (
          <div
            key={color.id}
            className={`color-card ${
              configuratorStore.baseColorId === color.id ? "active" : ""
            }`}
            onClick={() =>
              configuratorStore.setBaseColor(color.id)
            }
          >
            <img src={color.preview} />
            {configuratorStore.baseColorId === color.id && (
              <CheckCircle2 className="unified-selected-icon" />
            )}
            <p>{color.title}</p>

          </div>
        ))}
      </div>
    </div>
  )
})
