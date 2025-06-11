import {Navigate, Outlet, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'
import { AllProductsPage } from '../products/AllProductsPage'
import AllCustomerPage from './AllCustomersPage'
import CustomerDetailsPage from './CustomerDetailsPage'





const widgetsBreadCrumbs: Array<PageLink> = [
  {
    title: 'customers',
    path: '/customers/',
    isSeparator: false,
    isActive: false,
  },
]

const CustomersPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path='all'
          element={
            <>
              <PageTitle breadcrumbs={widgetsBreadCrumbs}>Customers</PageTitle>
              <AllCustomerPage  />
            </>
          }
        />
        <Route
          path='details/:customerId'
          element={
            <>
              <PageTitle breadcrumbs={widgetsBreadCrumbs} showBackButton>Customer Details</PageTitle>
              <CustomerDetailsPage />
            </>
          }
        />

        <Route index element={<Navigate to='/customers/all' />} />
      </Route>
    </Routes>
  )
}

export default CustomersPage
