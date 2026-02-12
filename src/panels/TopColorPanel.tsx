import { observer } from 'mobx-react-lite'
import { configuratorStore } from '../store/configuratorStore'
import { TOP_COLORS, type TopColorOption } from '../data/topColors'
import { CheckCircle2 } from 'lucide-react'

export const TopColorPanel = observer(() => {
  const colors: TopColorOption[] = TOP_COLORS

  // Group colors by type
  const colorsByType = colors.reduce((acc, color) => {
    if (!acc[color.type]) {
      acc[color.type] = []
    }
    acc[color.type].push(color)
    return acc
  }, {} as Record<string, TopColorOption[]>)

  const typeOrder = ['Natural', 'Polish', 'Silk']

  return (
    <div className="panel-section top-color-panel">
      <h2>Choose Table Top</h2>

      {typeOrder.map((type) => (
        colorsByType[type] && colorsByType[type].length > 0 && (
          <div key={type}>
            <div className="top-color-type-tag">{type}</div>
            <div className="color-grid">
              {colorsByType[type].map((color: TopColorOption) => (
                <div
                  key={color.id}
                  className={`color-card ${
                    configuratorStore.topColorId === color.id
                      ? 'active'
                      : ''
                  }`}
                  onClick={() =>
                    configuratorStore.setTopColor(color.id)
                  }
                >
                  <img
                    src={`/assets/images/top-color/${color.folder}/preview.webp`}
                    alt={color.title}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.onerror = null
                      target.src = `/assets/images/top-color/${color.folder}/preview.jpg`
                    }}
                  />
                  {configuratorStore.topColorId === color.id && (
                    <CheckCircle2 className="unified-selected-icon" />
                  )}
                  <p>{color.title}</p>
                </div>
              ))}
            </div>
          </div>
        )
      ))}
    </div>
  )
})
