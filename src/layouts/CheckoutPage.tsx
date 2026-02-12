import { observer } from "mobx-react-lite"
import { useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { configuratorStore } from "../store/configuratorStore"
import { TOP_COLORS } from "../data/topColors"
import { formatGBP, getBuildSummary } from "../utils/buildSummary"
import './../styles/checkout.css'

export const CheckoutPage = observer(() => {
  const navigate = useNavigate()
  const location = useLocation()
  const summary = getBuildSummary(configuratorStore)

  const selectedSampleIds = (location.state as { selectedSamples?: string[] } | null)?.selectedSamples ?? []
  const isSampleCheckout = selectedSampleIds.length > 0

  const selectedSamples = selectedSampleIds
    .map((id) => TOP_COLORS.find((color) => color.id === id))
    .filter((color): color is NonNullable<typeof color> => Boolean(color))

  const sampleTypes = Array.from(new Set(selectedSamples.map((sample) => sample.type)))
  const sampleCount = selectedSamples.length
  const samplePackPrice = 20
  const sampleTotal = Math.ceil(sampleCount / 2) * samplePackPrice
  const samplePricePerItem = sampleCount > 0 ? sampleTotal / sampleCount : 0

  return (
    <div className="checkout-page">
      <div className="checkout-left">
        <h1>Checkout</h1>

        <div className="form-grid">
          <Input label="Full Name *" />
          <Input label="Address Line 1 *" />
          <Input label="Address Line 2" />
          <Input label="City *" />
          <Input label="Postcode *" />
          <Input label="County" />
          <Input label="Phone Number *" />
          <Input label="Email Address *" />
        </div>

        <div className="checkout-actions">
          <button className="back-btn" onClick={() => navigate('/')}>
            Back to Design
          </button>

          <div>
            <button className="terms-btn">Terms & Conditions</button>
            <button className="pay-btn">Pay Now</button>
          </div>
        </div>

        <div className="important-box">
          <strong>IMPORTANT</strong>
          <p>
            Due to the bespoke nature of your order, we can only provide 48 hours after placing your
            order, where you may cancel or make any changes before production begins. After this point,
            cancellations and amendments will not be possible.
          </p>
        </div>
      </div>

      <div className="checkout-right">
        {isSampleCheckout ? (
          <>
            <div className="sample-photo-grid">
              {selectedSamples.map((sample) => (
                <div key={sample.id} className="sample-photo-item">
                  <img
                    src={`/assets/images/top-color/${sample.folder}/preview.webp`}
                    alt={sample.title}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.onerror = null
                      target.src = `/assets/images/top-color/${sample.folder}/preview.jpg`
                    }}
                  />
                </div>
              ))}
            </div>

            <h2>BeMade</h2>
            <p className="tagline">SAMPLE CHECKOUT</p>

            <div className="build-summary sample-summary">
              <h3>SELECTED SAMPLES</h3>
              <Row label="Shape" value={sampleTypes.join(', ') || 'N/A'} />
              <Row label="Selected Colours" value={selectedSamples.map((sample) => sample.title).join(', ') || 'N/A'} />
              <Row label="Quantity" value={sampleCount.toString()} />
              <Row label="Price Per Sample" value={formatGBP(samplePricePerItem)} />

              <div className="price-box">
                <div className="price-row">
                  <span>Sample Pack Price</span>
                  <span>{formatGBP(samplePackPrice)} / 2 samples</span>
                </div>
                <div className="price-divider" />
                <div className="price-total">
                  <span>Total</span>
                  <span>{formatGBP(sampleTotal)}</span>
                </div>
              </div>

              <button className="sample-order-now-btn">ORDER NOW</button>
            </div>
          </>
        ) : (
          <>
            <div className="brand-block">
              {configuratorStore.canvasSnapshot ? (
                <img
                  src={configuratorStore.canvasSnapshot}
                  alt="Your configured table"
                  className="brand-preview-image"
                />
              ) : (
                <div className="brand-fallback">Preview unavailable</div>
              )}
            </div>

            <h2>BeMade</h2>
            <p className="tagline">YOUR DESIGN | OUR PERFECTION</p>

            <div className="build-summary">
              <h3>YOUR BUILD</h3>

              <Row label="Table Top" value={summary.topColor} />
              <Row label="Base" value={summary.baseName} />
              <Row label="Base Colour" value={summary.baseColor} />
              <Row
                label="Dimensions"
                value={
                  configuratorStore.topLength && configuratorStore.topWidth
                    ? `Length: ${configuratorStore.topLength} mm x Width: ${configuratorStore.topWidth} mm`
                    : 'N/A'
                }
              />
              <Row label="Table Top Shape" value={summary.topShape} />
              <Row label="Chair Type" value={summary.chairName} />
              <Row label="Chair Colour" value={summary.chairColor} />
              <Row label="Chair Quantity" value={configuratorStore.chairQty.toString()} />

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
            </div>
          </>
        )}
      </div>
    </div>
  )
})

const Input = ({ label }: { label: string }) => (
  <div className="form-field">
    <label>{label}</label>
    <input placeholder={`Enter ${label.toLowerCase()}`} />
  </div>
)

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="summary-row">
    <span>{label}</span>
    <span>{value}</span>
  </div>
)
