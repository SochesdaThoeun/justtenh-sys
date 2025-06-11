import {FC} from 'react'
import {useSelector} from 'react-redux'
import {KTIcon} from '@/_metronic/helpers'
import {RootState} from '@/app/redux/store'

type Props = {
  className: string
  backGroundColor: string
}

const SummaryStats: FC<Props> = ({className, backGroundColor}) => {
  // Get dashboard data directly from Redux state
  const data = useSelector((state: RootState) => state.vendorReducer.profile?.dashboardData)

  const profit = data
    ? data.total_earning - data.total_tax_collected - (data.admin_commission || 0)
    : 0
  const balance = data?.collected_cash || 0
  const products = data?.products_count || 0
  const delivered = data?.orderStatus?.delivered || 0

  return (
    <div
      className={`card ${className} theme-dark-bg-body`}
      style={{backgroundColor: backGroundColor}}
    >
      {/* begin::Body */}
      <div className='card-body d-flex flex-column'>
        {/* begin::Wrapper */}
        <div className='d-flex flex-column mb-7'>
          {/* begin::Title  */}
          <a href='#' className='text-gray-900 text-hover-primary fw-bolder fs-3'>
            Summary
          </a>
          {/* end::Title */}
        </div>
        {/* end::Wrapper */}

        <div className='row g-0'>
          {/*begin::Col*/}
          <div className='col-6'>
            <div className='d-flex align-items-center mb-9 me-2'>
              {/*begin::Symbol*/}
              <div className='symbol symbol-40px me-3'>
                <div className='symbol-label bg-body bg-opacity-50'>
                  <KTIcon iconName='bill' className='fs-1 text-gray-900' />
                </div>
              </div>
              {/*end::Symbol*/}

              {/*begin::Title*/}
              <div>
                <div className='fs-5 text-gray-900 fw-bolder lh-1'>
                  ${profit.toLocaleString()}
                </div>
                <div className='fs-7 text-gray-600 fw-bold'>Profit</div>
              </div>
              {/*end::Title*/}
            </div>
          </div>
          {/*end::Col*/}

          {/*begin::Col*/}
          <div className='col-6'>
            <div className='d-flex align-items-center mb-9 ms-2'>
              {/*begin::Symbol*/}
              <div className='symbol symbol-40px me-3'>
                <div className='symbol-label bg-body bg-opacity-50'>
                  <KTIcon iconName='bank' className='fs-1 text-gray-900' />
                </div>
              </div>
              {/*end::Symbol*/}

              {/*begin::Title*/}
              <div>
                <div className='fs-5 text-gray-900 fw-bolder lh-1'>
                  ${balance.toLocaleString()}
                </div>
                <div className='fs-7 text-gray-600 fw-bold'>Balance</div>
              </div>
              {/*end::Title*/}
            </div>
          </div>
          {/*end::Col*/}

          {/*begin::Col*/}
          <div className='col-6'>
            <div className='d-flex align-items-center me-2'>
              {/*begin::Symbol*/}
              <div className='symbol symbol-40px me-3'>
                <div className='symbol-label bg-body bg-opacity-50'>
                  <KTIcon iconName='purchase' className='fs-1 text-gray-900' />
                </div>
              </div>
              {/*end::Symbol*/}

              {/*begin::Title*/}
              <div>
                <div className='fs-5 text-gray-900 fw-bolder lh-1'>
                  {products}
                </div>
                <div className='fs-7 text-gray-600 fw-bold'>Products</div>
              </div>
              {/*end::Title*/}
            </div>
          </div>
          {/*end::Col*/}

          {/*begin::Col*/}
          <div className='col-6'>
            <div className='d-flex align-items-center ms-2'>
              {/*begin::Symbol*/}
              <div className='symbol symbol-40px me-3'>
                <div className='symbol-label bg-body bg-opacity-50'>
                  <KTIcon iconName='delivery' className='fs-1 text-gray-900' />
                </div>
              </div>
              {/*end::Symbol*/}

              {/*begin::Title*/}
              <div>
                <div className='fs-5 text-gray-900 fw-bolder lh-1'>
                  {delivered}
                </div>
                <div className='fs-7 text-gray-600 fw-bold'>Delivered</div>
              </div>
              {/*end::Title*/}
            </div>
          </div>
          {/*end::Col*/}
        </div>
      </div>
    </div>
  )
}

export {SummaryStats}
