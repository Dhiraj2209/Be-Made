import './header.css'
import { StepTabs } from '../StepTabs/StepTabs'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { OrderSampleModal } from './OrderSampleModal'

export const Header = () => {
  const location = useLocation()
  const isCheckoutPage = location.pathname === '/checkout'
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)

  return (
    <header className={`header ${isCheckoutPage ? 'checkout-header' : ''}`}>
      {/* Left */}
      <div className="header-left">
        <img
          src="/images/bemade_logo.svg"
          alt="BeMade"
          className="header-logo"
        />
      </div>

      {!isCheckoutPage && (
        <>
          {/* Center */}
          <div className="header-center">
            <StepTabs />
            <button className="header-login-btn">Login / Signup</button>
          </div>

          {/* Right */}
          <div className="header-right">
            <button className="order-btn" onClick={() => setIsOrderModalOpen(true)}>
              Order Sample
            </button>
          </div>
        </>
      )}

      {!isCheckoutPage && isOrderModalOpen && (
        <OrderSampleModal onClose={() => setIsOrderModalOpen(false)} />
      )}
    </header>
  )
}
