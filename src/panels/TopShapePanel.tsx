import { observer } from 'mobx-react-lite'
import { configuratorStore } from '../store/configuratorStore'
import { TOP_OPTIONS } from '../data/topOptions'
import { CheckCircle2 } from 'lucide-react'

export const TopShapePanel = observer(() => {
  return (
    <div className="panel-section">
      <h2>Choose Table Top Shape</h2>
      <div className="shape-grid">
        {TOP_OPTIONS.map(shape => {
          const allowed =
            configuratorStore.isTopShapeAllowed(shape.id)

          const active =
            configuratorStore.topId === shape.id

          return (
            <div
              key={shape.id}
              className={`shape-card 
              ${active ? 'active' : ''} 
              ${!allowed ? 'disabled' : ''}
            `}
              onClick={() => {
                if (!allowed) return
                configuratorStore.setTop(shape.id)
              }}
            >
              <img src={shape.preview} />
              {active && <CheckCircle2 className="unified-selected-icon" />}
              <p>{shape.label}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
})
