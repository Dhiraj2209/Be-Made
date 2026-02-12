import { observer } from 'mobx-react-lite'
import { configuratorStore } from '../store/configuratorStore'
import './../styles/dimension.css'

export const DimensionPanel = observer(() => {
  const top = configuratorStore.currentTopOption

  if (!top) return null

  const isRound = top.id === 'ROUND'
  const isSquare = top.id === 'SQUARE'
  const showSingleDimension = isRound || isSquare
  const primaryLabel = isRound
    ? 'Diameter'
    : isSquare
      ? 'Length'
      : 'Top Length'

  return (
    <div className="dimension-wrapper panel-section">
      <h2>Dimensions</h2>

      <div className="dimension-info">
        All table heights are fixed between <b>730mm to 750mm</b>
      </div>

      <Slider
        label={primaryLabel}
        min={top.minLength}
        max={top.maxLength}
        value={configuratorStore.topLength}
        onChange={(val) => configuratorStore.setTopLength(val)}
      />

      {!showSingleDimension && (
        <Slider
          label="Top Width"
          min={top.minWidth}
          max={top.maxWidth}
          value={configuratorStore.topWidth}
          onChange={(val) => configuratorStore.setTopWidth(val)}
        />
      )}
    </div>
  )
})

type SliderProps = {
  label: string
  min: number
  max: number
  value: number
  onChange: (val: number) => void
}

const Slider = ({ label, min, max, value, onChange }: SliderProps) => {
  return (
    <div className="dimension-group">
      <label>{label}</label>

      <div className="slider-row">
        <button
          onClick={() => onChange(Math.max(min, value - 50))}
        >
          −
        </button>

        <input
          type="range"
          min={min}
          max={max}
          step={10}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />

        <button
          onClick={() => onChange(Math.min(max, value + 50))}
        >
          +
        </button>
      </div>

      <div className="dimension-value">
        {value} mm
      </div>
    </div>
  )
}
