// import '../styles/global.css'
// import { Header } from '../components/Header/Header'
// import { ConfiguratorLayout } from '../layouts/ConfiguratorLayout'
// import { SummaryBar } from '../components/SummaryBar/SummaryBar'

// export const App = () => {
//   return (
//     <div className="app-root">
//       <Header />
//       <ConfiguratorLayout />
//       <SummaryBar />
//     </div>
//   )
// }

import '../styles/global.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { Header } from '../components/Header/Header'
import { ConfiguratorLayout } from '../layouts/ConfiguratorLayout'
import { SummaryBar } from '../components/SummaryBar/SummaryBar'
import { CheckoutPage } from '../layouts/CheckoutPage'

export const App = () => {
  return (
    <BrowserRouter>
      <div className="app-root">
        <Header />

        <Routes>
          {/* Configurator */}
          <Route
            path="/"
            element={
              <>
                <ConfiguratorLayout />
                <SummaryBar />
              </>
            }
          />

          {/* Checkout */}
          <Route path="/checkout" element={<CheckoutPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
