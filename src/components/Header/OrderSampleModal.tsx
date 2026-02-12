import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, CheckCircle2 } from 'lucide-react'
import { TOP_COLORS, type TopColorOption } from '../../data/topColors'
import './OrderSample.css'

export const OrderSampleModal = ({ onClose }: { onClose: () => void }) => {
  const navigate = useNavigate()
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [hoveredColor, setHoveredColor] = useState<TopColorOption | null>(null)

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const handleBuyNow = () => {
    if (selectedIds.length > 0) {
      onClose()
      // Pass selected IDs via state to the checkout page
      navigate('/checkout', { state: { selectedSamples: selectedIds } })
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="order-sample-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Order Samples</h2>
          <button className="close-x" onClick={onClose}><X /></button>
        </div>

        <div className="sample-pricing-box">
          <h3>Sample Pricing</h3>
          <ul>
            <li>A pair of samples costs £20.</li>
            <li>Ordering just one sample is also £20.</li>
            <li>Every additional pair costs £20.</li>
          </ul>
        </div>

        <div className="samples-container">
          <h4>Natural</h4>
          <div className="samples-grid">
            {TOP_COLORS.map(color => (
              <div 
                key={color.id} 
                className={`sample-item ${selectedIds.includes(color.id) ? 'selected' : ''}`}
                onMouseEnter={() => setHoveredColor(color)}
                onMouseLeave={() => setHoveredColor(null)}
                onClick={() => toggleSelect(color.id)}
              >
                <div className="img-wrapper">
                  <img
                    src={`/assets/images/top-color/${color.folder}/preview.webp`}
                    alt={color.title}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = `/assets/images/top-color/${color.folder}/preview.jpg`;
                    }}
                  />
                  {selectedIds.includes(color.id) && <CheckCircle2 className="check-icon" />}
                </div>
                <p>{color.title}</p>
              </div>
            ))}
          </div>
        </div>

        {/* HOVER LARGE PREVIEW */}
        {hoveredColor && (
          <div className="hover-preview-panel">
            <img 
              src={`/assets/images/top-color/${hoveredColor.folder}/preview.webp`} 
              alt={hoveredColor.title} 
            />
            <div className="preview-details">
              <h5>{hoveredColor.title}</h5>
              <p>{hoveredColor.description}</p>
              {selectedIds.includes(hoveredColor.id) ? (
                <span className="status-badge">Selected</span>
              ) : (
                <span className="status-badge-hint">Click to Select</span>
              )}
            </div>
          </div>
        )}

        <div className="modal-footer">
          <button 
            className={`buy-now-btn ${selectedIds.length > 0 ? 'active' : ''}`}
            disabled={selectedIds.length === 0}
            onClick={handleBuyNow}
          >
            Buy Now &rarr;
          </button>
        </div>
      </div>
    </div>
  )
}
