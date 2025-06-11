import { FC } from 'react'
import {KTIcon, toAbsoluteUrl} from '@/_metronic/helpers'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '@/app/redux/store'
import { Products, Product } from '@/app/redux/models'

type Props = {
  className: string
}

const TopSellingListWidget: FC<Props> = ({ className }) => {
  // Get top selling products directly from Redux
  const topSellingProducts = useSelector((state: RootState) => 
    state.product.topSellingProductModel?.products || []
  );
  
  //console.log('topSellingProducts',topSellingProducts);
  // Use provided products or fallback to empty array
  const products = topSellingProducts.length > 0 ? topSellingProducts : [];

  // Default image in case product has no image
  const defaultImage = toAbsoluteUrl('media/stock/600x400/img-1.jpg');

  return (
    <div className={`card ${className}`}>
      {/* begin::Header */}
      <div className='card-header align-items-center border-0 mt-4'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='fw-bold text-gray-900'>Top Selling Products</span>
          <span className='text-muted mt-1 fw-semibold fs-7'>Most profitable products</span>
        </h3>
      </div>
      {/* end::Header */}
      {/* begin::Body */}
      <div className='card-body pt-3'>
        {products.length > 0 ? (
          // Map through the products array and display each product
          products.slice(0, 4).map((item, index) => {
            const product = item.product || {} as Product;
            return (
              <div key={index} className='d-flex align-items-sm-center mb-7'>
                {/* begin::Symbol */}
                <div className='symbol symbol-60px symbol-2by3 me-4'>
                  <div
                    className='symbol-label'
                    style={{
                      backgroundImage: `url(${
                        product.meta_image_full_url?.path 
                          ? product.meta_image_full_url.path 
                          : (product.thumbnail || defaultImage)
                      })`,
                      backgroundSize: 'cover',
                    }}
                  ></div>
                </div>
                {/* end::Symbol */}
                {/* begin::Content */}
                <div className='d-flex flex-row-fluid align-items-center flex-wrap my-lg-0 me-2'>
                  {/* begin::Title */}
                  <div className='flex-grow-1 my-lg-0 my-2 me-2'>
                    <Link to='/products/list/all' className='text-gray-800 fw-bold text-hover-primary fs-6'>
                      {product.name || 'Unnamed Product'}
                    </Link>
                    <span className='text-muted fw-semibold d-block pt-1'>
                      ${product.unit_price?.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      }) || '0.00'}
                    </span>
                  </div>
                  {/* end::Title */}
                  {/* begin::Section */}
                  <div className='d-flex align-items-center'>
                    <div className='me-6'>
                      <span className='text-gray-800 fw-bold'>{item.count || 0} Items</span>
                    </div>
                    <div className='me-6'>
                      <i className='fa fa-star-half-alt me-1 text-warning fs-5'></i>
                      <span className='text-gray-800 fw-bold'>
                        {product.rating && product.rating[0]
                          ? parseFloat(product.rating[0].average || '0').toFixed(1)
                          : '0.0'
                        }
                      </span>
                    </div>
                    <Link to='/products/list/all' className='btn btn-icon btn-light btn-sm border-0'>
                      <KTIcon iconName='arrow-right' className='fs-2 text-primary' />
                    </Link>
                  </div>
                  {/* end::Section */}
                </div>
                {/* end::Content */}
              </div>
            );
          })
        ) : (
          // Display when no products are available
          <div className='text-center py-10'>
            <span className='text-muted'>No top selling products found</span>
          </div>
        )}
      </div>
      {/* end::Body */}
    </div>
  )
}

export {TopSellingListWidget}
