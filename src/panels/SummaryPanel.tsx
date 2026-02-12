import { observer } from 'mobx-react-lite'
import { useNavigate } from 'react-router-dom'
import { configuratorStore } from '../store/configuratorStore'
import { formatGBP, getBuildSummary } from '../utils/buildSummary'

export const SummaryPanel = observer(() => {
  const navigate = useNavigate()
  const summary = getBuildSummary(configuratorStore)

  const handlePlaceOrder = () => {
    const previousSnapshot = configuratorStore.canvasSnapshot

    // Force the checkout preview to use the chair-focused camera.
    configuratorStore.setPreferredView('chair_view')

    // Let the camera move to chair_view, then request a fresh snapshot.
    setTimeout(() => {
      configuratorStore.requestCanvasSnapshot()
    }, 900)

    // Wait until we receive a *new* snapshot before navigating.
    const start = Date.now()
    const iv = setInterval(() => {
      if (
        configuratorStore.canvasSnapshot &&
        configuratorStore.canvasSnapshot !== previousSnapshot
      ) {
        clearInterval(iv)
        navigate('/checkout')
        return
      }
      if (Date.now() - start > 3200) {
        clearInterval(iv)
        // Fallback: keep flow unblocked even if WebGL capture fails.
        navigate('/checkout')
      }
    }, 100)
  }

  return (
    <div className="build-summary">
      <h2>YOUR BUILD</h2>

      <SummaryRow label="Table Top" value={summary.topColor} />
      <SummaryRow label="Base" value={summary.baseName} />
      <SummaryRow label="Base Colour" value={summary.baseColor} />
      <SummaryRow
        label="Dimensions"
        value={
          configuratorStore.topLength && configuratorStore.topWidth
            ? `Length: ${configuratorStore.topLength} mm x Width: ${configuratorStore.topWidth} mm`
            : 'N/A'
        }
      />
      <SummaryRow label="Table Top Shape" value={summary.topShape} />
      <SummaryRow label="Chair Type" value={summary.chairName} />
      <SummaryRow label="Chair Colour" value={summary.chairColor} />
      <SummaryRow label="Chair Quantity" value={configuratorStore.chairQty.toString()} />

      <div className="price-box">
        <div className="price-row">
          <span>Dining Table</span>
          <span>{formatGBP(summary.tablePrice)}</span>
        </div>
        <div className="price-row">
          <span>Chairs</span>
          <span>{formatGBP(summary.chairsPrice)}</span>
        </div>
        <div className="price-divider" />
        <div className="price-total">
          <span>Total</span>
          <span>{formatGBP(summary.total)}</span>
        </div>
      </div>

      <div className="delivery-box">
        <h3>Estimated Delivery:</h3>
        <p>
          Our products are all unique, made to order and this takes some time in our factory.
        </p>
        <p>
          Once your order has been made, we will notify and arrange delivery with you.
        </p>
        <p>
          Currently the estimated delivery times are within <strong>14-21 days.</strong>
        </p>
      </div>

      <button className="place-order-btn" onClick={handlePlaceOrder}>
        PLACE ORDER
      </button>
    </div>
  )
})

const SummaryRow = ({ label, value }: { label: string; value: string }) => (
  <div className="summary-row">
    <span>{label}</span>
    <span>{value}</span>
  </div>
)
