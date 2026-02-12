import { observer } from 'mobx-react-lite'
import { configuratorStore } from '../../store/configuratorStore'
import { BASE_OPTIONS } from '../../data/baseOptions'
import { BASE_COLOR_OPTIONS } from '../../data/baseColors'
import { TOP_OPTIONS } from '../../data/topOptions'
import { TOP_COLORS } from '../../data/topColors'
import { CHAIR_OPTIONS } from '../../data/chairOptions'
import { CHAIR_COLOR_OPTIONS } from '../../data/ChairColorOptions'
import './summaryBar.css'

export const SummaryBar = observer(() => {
  const {
    baseId,
    baseColorId,
    topId,
    topLength,
    topWidth,
    chairId,
    chairColorId
  } = configuratorStore

  const selectedBase = BASE_OPTIONS.find(base => base.id === baseId)
  const selectedBaseColor = BASE_COLOR_OPTIONS[baseId]?.find(c => c.id === baseColorId)
  const selectedTopShape = TOP_OPTIONS.find(t => t.id === topId)
  const selectedTopColor = TOP_COLORS.find(c => c.id === configuratorStore.topColorId)
  const selectedChair = CHAIR_OPTIONS.find(c => c.id === chairId)
  const selectedChairColor = chairId
    ? CHAIR_COLOR_OPTIONS[chairId]?.find(c => c.id === chairColorId)
    : null

  const dimensionsValue =
    topId === 'ROUND'
      ? `${topLength}`
      : topId === 'SQUARE'
        ? `${topLength}`
        : topLength && topWidth
          ? `${topLength}x${topWidth}`
          : 'N/A'

  return (
    <div className="summary-bar">
      <SummaryItem label="Your Build" value="Dining Table" />
      <SummaryItem label="Table Top" value={selectedTopColor?.title || 'N/A'} />
      <SummaryItem label="Table Base" value={selectedBase?.title || 'N/A'} />
      <SummaryItem label="Table Base Colour" value={selectedBaseColor?.title || 'N/A'} />
      <SummaryItem label="Dimensions (mm)" value={dimensionsValue} />
      <SummaryItem label="Table Top Shape" value={selectedTopShape?.label || 'N/A'} />
      <SummaryItem label="Chair Style" value={selectedChair?.title || 'N/A'} />
      <SummaryItem label="Chair Color" value={selectedChairColor?.title || 'N/A'} />
    </div>
  )
})

const SummaryItem = ({ label, value }: { label: string; value: string }) => (
  <div className="summary-item">
    <div className="summary-label">{label}</div>
    <div className="summary-value">{value}</div>
  </div>
)
