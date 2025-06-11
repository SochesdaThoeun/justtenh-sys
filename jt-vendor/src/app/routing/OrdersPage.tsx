import {Navigate, Outlet, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../_metronic/layout/core'
import {AllOrdersPage} from '../pages/orders/order-pages/AllOrdersPage'
import {OrdersFailedPage} from '../pages/orders/order-pages/OrdersFailedPage'
import {OrderDeliveredPage} from '../pages/orders/order-pages/OrdersDeliveredPage'
import {OutForDeliveryPage} from '../pages/orders/order-pages/OutForDeliveryPage'
import {PendingOrdersPage} from '../pages/orders/order-pages/PendingOrdersPage'
import {OrderDetailsPage} from '../pages/orders/order-management/OrderDetailsPage'
import {OrderEditPage} from '../pages/orders/order-management/OrderEditPage'
import { OrderAddPage } from '../pages/orders/order-management/OrderAddPage'
import { InvoicePage } from '../pages/orders/order-management/InvoicePage'


const widgetsBreadCrumbs: Array<PageLink> = [
  {
    title: 'Orders',
    path: '/orders/list/',
    isSeparator: false,
    isActive: false,
  },
]

const OrdersPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path='all'
          element={
            <>
              <PageTitle breadcrumbs={widgetsBreadCrumbs}>All Orders</PageTitle>
              <AllOrdersPage className="mt-5" />
            </>
          }
        />
        <Route
          path='pending'
          element={
            <>
              <PageTitle breadcrumbs={widgetsBreadCrumbs}>Pending Orders</PageTitle>
              <PendingOrdersPage className="mt-5" />
            </>
          }
        />
        <Route
          path='out_for_delivery'
          element={
            <>
              <PageTitle breadcrumbs={widgetsBreadCrumbs}>Out For Delivery</PageTitle>
              <OutForDeliveryPage className="mt-5" />
            </>
          }
        />
        <Route
          path='orders_delivered'
          element={
            <>
              <PageTitle breadcrumbs={widgetsBreadCrumbs}>Order Delivered</PageTitle>
              <OrderDeliveredPage className="mt-5" />
            </>
          }
        />
        <Route
          path='orders_failed'
          element={
            <>
              <PageTitle breadcrumbs={widgetsBreadCrumbs}>Orders Failed</PageTitle>
              <OrdersFailedPage className="mt-5" />
            </>
          }
        />
        <Route
          path='/all/order_details/:orderId'
          element={
            <>
              <PageTitle breadcrumbs={widgetsBreadCrumbs} showBackButton>Order Details</PageTitle>
              <OrderDetailsPage />
            </>
          }
        />
         <Route
          path='/all/order_edit/:orderId'
          element={
            <>
              <PageTitle breadcrumbs={widgetsBreadCrumbs} showBackButton>Order Edit</PageTitle>
              <OrderEditPage />
            </>
          }
        />

        <Route
          path='/all/order_add'
          element={
            <>
              <PageTitle breadcrumbs={widgetsBreadCrumbs} showBackButton>Order Add</PageTitle>
              <OrderAddPage />
            </>
          }
        />

        <Route
          path='/invoice/:orderId'
          element={
            <>
              <PageTitle breadcrumbs={widgetsBreadCrumbs} showBackButton>Invoice</PageTitle>
              <InvoicePage />
            </>
          }
        />
        
        <Route index element={<Navigate to='/orders/list/' />} />
      </Route>
    </Routes>
  )
}

export default OrdersPage
