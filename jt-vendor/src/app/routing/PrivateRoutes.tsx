import {FC, lazy, Suspense} from 'react'
import {Navigate, Route, Routes} from 'react-router-dom'
import {MasterLayout} from '../../_metronic/layout/MasterLayout'
import TopBarProgress from 'react-topbar-progress-indicator'
import {HomeWrapper} from '../pages/home/HomeWrapper'
import {getCSSVariableValue} from '../../_metronic/assets/ts/_utils'
import {DisableSidebar} from '../../_metronic/layout/core'
import {WithChildren} from '../../_metronic/helpers'

const PrivateRoutes = () => {
  const OrdersPage = lazy(() => import('./OrdersPage'))
  const ProductsPage = lazy(() => import('../pages/products/ProductsPage'))
  const ReviewsPage = lazy(() => import('../pages/reviews/ReviewsPage'))
  const CustomersPage = lazy(() => import('../pages/customers/CustomersPage'))
  const ChatPage = lazy(() => import('../pages/chat/ChatPage'))
  const PosPage = lazy(() => import('../pages/pos/PosPage'))
  const ReportPages = lazy(() => import('../pages/report/ReportPages'))
  const ShippingPage = lazy(() => import('../pages/shipping/ShippingPage'))
  const Bankpage = lazy(() => import('../pages/bank/BankPage'))
  const AccountingPage = lazy(() => import('../pages/accounting/AccountingPage'))
  const StoreSettingPage = lazy(() => import('../pages/business-settings/StoreSettingPage'))

  return (
    <Routes>
      <Route element={<MasterLayout />}>
        {/* Redirect to Dashboard after success login/registartion */}
        <Route path='auth/*' element={<Navigate to='/home' />} />
        {/* Pages */}
        <Route path='home' element={<HomeWrapper />} />
        <Route path='dashboard' element={<HomeWrapper />} />
        {/* Lazy Modules */}
        <Route
          path='orders/list/*'
          element={
            <SuspensedView>
              <OrdersPage />
            </SuspensedView>
          }
        />
        <Route
          path='products/list/*'
          element={
            <SuspensedView>
              <ProductsPage />
            </SuspensedView>
          }
        />
        <Route
          path='customers/*'
          element={
            <SuspensedView>
              <CustomersPage />
            </SuspensedView>
          }
        />
        <Route
          path='reviews/*'
          element={
            <SuspensedView>
              <ReviewsPage />
            </SuspensedView>
          }
        />
        <Route
          path='reports/*'
          element={
            <SuspensedView>
              <ReportPages />
            </SuspensedView>
          }
        />

        <Route
          path='shipping/*'
          element={
            <SuspensedView>
              <ShippingPage />
            </SuspensedView>
          }
        />

        <Route
          path='chat/*'
          element={
            <SuspensedView>
              <ChatPage />
            </SuspensedView>
          }
        />

        <Route
          path='pos/*'
          element={
            <SuspensedView>
              <PosPage />
            </SuspensedView>
          }
        />
        <Route
          path='store_settings/*'
          element={
            <SuspensedView>
              <StoreSettingPage />
            </SuspensedView>
          } 
        />


        <Route
          path='bank/*'
          element={
            <SuspensedView>
              <Bankpage />
            </SuspensedView>
          } 
        />
        <Route
          path='accounting/*'
          element={
            <SuspensedView>
              <AccountingPage />
            </SuspensedView>
          } 
        />
        
        {/* Page Not Found */}
        <Route path='*' element={<Navigate to='/error/404' />} />
      </Route>
    </Routes>
  )
}

const SuspensedView: FC<WithChildren> = ({children}) => {
  const baseColor = getCSSVariableValue('--bs-primary')
  TopBarProgress.config({
    barColors: {
      '0': baseColor,
    },
    barThickness: 1,
    shadowBlur: 5,
  })
  return (
    <Suspense fallback={<TopBarProgress />}>
      <DisableSidebar>{children}</DisableSidebar>
    </Suspense>
  )
}

export {PrivateRoutes}
