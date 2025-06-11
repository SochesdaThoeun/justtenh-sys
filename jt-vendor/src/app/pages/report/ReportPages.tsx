import {Navigate, Outlet, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'
import ProductReportPage from './ProductReportPage'
import { KTIcon } from '../../../_metronic/helpers'
import { ChartsWidget1, ChartsWidget3 } from '../../../_metronic/partials/widgets'
import OrderReportPage from './OrderReportPage'
import SalesReportPage from './SaleReportPage'
import ShippingReportPage from './ShippingReportPage'
import ReturnReportPage from './ReturnReportPage'






const widgetsBreadCrumbs: Array<PageLink> = [
  {
    title: 'reports',
    path: '/reports/',
    isSeparator: false,
    isActive: false,
  },
]

const ReportPages = () => {
  return (
    <>  
        <PageTitle breadcrumbs={widgetsBreadCrumbs}>Reports</PageTitle>
        <ul className="nav nav-tabs nav-line-tabs nav-line-tabs-2x border-transparent fs-4 fw-semibold mb-15">
          <li className="nav-item">
            <a
              className="nav-link text-active-primary d-flex align-items-center pb-5 active"
              data-bs-toggle="tab"
              href="#report_products"
            >
              <KTIcon iconName="archive" className='fs-2 me-2' />
              Products Views
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link text-active-primary d-flex align-items-center pb-5"
              data-bs-toggle="tab"
              href="#report_orders"
            >
               <KTIcon iconName="purchase" className='fs-2 me-2' />
              Orders
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link text-active-primary d-flex align-items-center pb-5"
              data-bs-toggle="tab"
              href="#report_sales"
            >
               <KTIcon iconName="basket-ok" className='fs-2 me-2' />
              Sales
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link text-active-primary d-flex align-items-center pb-5"
              data-bs-toggle="tab"
              href="#report_shipping"
            >
               <KTIcon iconName="delivery" className='fs-2 me-2' />
              Shipping
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link text-active-primary d-flex align-items-center pb-5"
              data-bs-toggle="tab"
              href="#report_return"
            >
              <KTIcon iconName="update-folder" className='fs-2 me-2' />
              Returns
            </a>
          </li>
          
          
        </ul>
        
        <div className="tab-content" id="myTabContent">
          <div className="tab-pane fade show active" id="report_products" role="tabpanel">
            <ProductReportPage />
          </div>
          <div className="tab-pane fade" id="report_orders" role="tabpanel">
            <OrderReportPage />
          </div>
          <div className="tab-pane fade" id="report_sales" role="tabpanel">
            <SalesReportPage />
          </div>
          <div className="tab-pane fade" id="report_shipping" role="tabpanel">
            <ShippingReportPage /> 
          </div>
          <div className="tab-pane fade" id="report_return" role="tabpanel">
            <ReturnReportPage /> 
          </div>
  
        </div>
        
    </>

  )
}

export default ReportPages
