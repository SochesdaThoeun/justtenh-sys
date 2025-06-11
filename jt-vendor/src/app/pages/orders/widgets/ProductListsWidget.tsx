import React, { FC } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/app/redux/store'
import { KTIcon } from '../../../../_metronic/helpers'
import { PRODUCT_IMAGE_URL } from '@/app/constants/api.constants'

type ProductListsWidgetProps = {}

export const ProductListsWidget: FC<ProductListsWidgetProps> = () => {
  const { orderDetails } = useSelector((state: RootState) => state.orderDetailReducer)
  
  if (!orderDetails || orderDetails.length === 0) {
    return <div>Loading order details...</div>
  }

  // Assuming orderDetails is a non-empty array; fallback values provided if needed.
  const headerDetails = orderDetails[0] || {}
  //console.log('headerDetails', headerDetails)
  // Update shippingRate from orderDetail.order.shipping_cost
  const shippingRate = headerDetails.order?.shipping_cost || 0
  const orderId = headerDetails.order_id || 'N/A'
  const products = orderDetails
  
  // Extract extra discount details
  const extraDiscount = headerDetails.order?.extra_discount || 0
  const extraDiscountType = headerDetails.order?.extra_discount_type || 'amount'
  
  // Extract order tax details
  const orderTax = headerDetails.tax || 0
  const orderTaxModel = headerDetails.tax_model || 'exclude'

  // Calculate base subtotal without including tax
  const baseSubtotal = products.reduce((acc: number, orderDetail: any) => {
    const unitPrice = orderDetail.product_details.unit_price
    const qty = orderDetail.qty
    
    // Calculate discounts
    let computedDiscount = 0
    if(orderDetail.product_details.discount_type === "flat") {
      computedDiscount = orderDetail.product_details.discount * qty
    } else {
      computedDiscount = unitPrice * qty * (orderDetail.product_details.discount/100)
    }
    
    // Calculate product total (without adding tax)
    const productTotal = (unitPrice * qty) - computedDiscount
    return acc + productTotal
  }, 0)

  // Calculate total tax at the summary level
  let totalTax = 0
  if (orderTaxModel === 'exclude') {
    // For exclusive tax, calculate tax on top of base subtotal
    totalTax = baseSubtotal * (orderTax / 100)
  } else {
    // For inclusive tax, extract tax from base subtotal
    totalTax = baseSubtotal - (baseSubtotal / (1 + orderTax / 100))
  }

  // Calculate extra discount based on type
  let calculatedExtraDiscount = 0
  if (extraDiscountType === 'amount') {
    calculatedExtraDiscount = extraDiscount
  } else {
    calculatedExtraDiscount = baseSubtotal * (extraDiscount / 100)
  }

  // Define subtotal based on tax model
  let subtotal
  if (orderTaxModel === 'include') {
    // For inclusive tax, subtotal already includes tax
    subtotal = baseSubtotal
  } else {
    // For exclusive tax, subtotal is before tax
    subtotal = baseSubtotal
  }

  // For demonstration, itemDiscount remains 0, adjust as needed.
  const itemDiscount = 0
  
  // Calculate grand total
  // For exclusive tax, add tax; for inclusive tax, it's already included
  const grandTotal = subtotal + (orderTaxModel === 'exclude' ? totalTax : 0) 
                    + shippingRate - calculatedExtraDiscount

  return (
    <div className='card card-flush py-4 flex-row-fluid overflow-hidden'>
      {/*begin::Card header*/}
      <div className='card-header'>
        <div className='card-title'>
          <h2>Order #{orderId}</h2>
        </div>
        <div className='card-toolbar'>
          <a
            href={`../order_edit/${orderId}`}
            type='button'
            className='btn btn-color-primary btn-active-light-primary me-4'
          >
            Edit Order
          </a>
          <a
            href='../order_add'
            type='button'
            className='btn btn-primary'
          >
            Add Order
          </a>
        </div>
      </div>
      {/*end::Card header*/}

      {/*begin::Card body*/}
      <div className='card-body pt-0'>
        <div className='table-responsive'>
          <table className='table align-middle table-row-dashed fs-6 gy-5 mb-0'>
            <thead>
              <tr className='text-start text-gray-500 fw-bold fs-7 text-uppercase gs-0'>
                <th className='min-w-175px'>Product</th>
                <th className='min-w-100px text-end'>Code</th>
                <th className='min-w-70px text-end'>Qty</th>
                <th className='min-w-100px text-end'>Unit Price</th>
                <th className='min-w-100px text-end'>Tax</th>
                <th className='min-w-100px text-end'>Discount</th>
                <th className='min-w-100px text-end'>Total</th>
              </tr>
            </thead>
            <tbody className='fw-semibold text-gray-600'>
              {products.map((orderDetail: any) => {
                const unitPrice = orderDetail.product_details.unit_price
                const qty = orderDetail.qty
                const taxRate = orderDetail.product_details.tax || 0
                const taxModel = orderDetail.product_details.tax_model || 'exclude'
                
                // Calculate tax for display only
                let computedTax = 0
                if (taxModel === "include") {
                  computedTax = (unitPrice * qty) - (unitPrice * qty)/(1 + taxRate/100)
                } else {
                  computedTax = unitPrice * qty * (taxRate/100)
                }
                
                // Calculate discount
                let computedDiscount = 0
                if (orderDetail.product_details.discount_type === "flat") {
                  computedDiscount = orderDetail.product_details.discount * qty
                } else {
                  computedDiscount = unitPrice * qty * (orderDetail.product_details.discount/100)
                }
                
                // Calculate product total - for inclusive tax, leave tax in; for exclusive tax, don't add it
                let productTotal
                if (taxModel === "include") {
                  // For inclusive tax, the tax is already part of the unit price
                  productTotal = (unitPrice * qty) - computedDiscount
                } else {
                  // For exclusive tax, calculate based on unit price and apply discount
                  // Don't add tax here as it's calculated at the summary level
                  productTotal = (unitPrice * qty) - computedDiscount
                }
                
                return (
                  <tr key={orderDetail.product_id}>
                    <td>
                      <div className='d-flex align-items-center'>
                        {/* Product Thumbnail */}
                        <a href='#' className='symbol symbol-50px me-3'>
                          <span
                            className='symbol-label'
                            style={{ backgroundImage: `url(${orderDetail.product_details.thumbnail_full_url?.path})` }}
                          ></span>
                        </a>
                        {/* Product Title */}
                        <div className='ms-5'>
                          <a
                            href='#'
                            className='fw-bold text-gray-600 text-hover-primary'
                          >
                            {orderDetail.product_details.name}
                          </a>
                          <div className='fs-7 text-muted'>
                            Variant: {orderDetail.variant}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className='text-end'>{orderDetail.product_details.code}</td>
                    <td className='text-end'>{qty}</td>
                    <td className='text-end'>
                      ${unitPrice.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                    </td>
                    <td className='text-end'>
                      ${computedTax.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                    </td>
                    <td className='text-end'>
                      ${computedDiscount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                    </td>
                    <td className='text-end'>
                      ${productTotal.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                    </td>
                  </tr>
                )
              })}
              <tr>
                <td colSpan={6} className='text-end'>
                  Subtotal
                </td>
                <td className='text-end'>
                  ${subtotal.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </td>
              </tr>
              <tr>
                <td colSpan={6} className='text-end'>
                  Item Discount
                </td>
                <td className='text-end'>
                  -${itemDiscount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </td>
              </tr>
              <tr>
                <td colSpan={6} className='text-end'>
                  Extra Discount {extraDiscountType === 'percentage' ? `(${extraDiscount}%)` : '(Flat)'}
                </td>
                <td className='text-end'>
                  -${calculatedExtraDiscount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </td>
              </tr>
              <tr>
                <td colSpan={6} className='text-end'>
                  Tax {orderTaxModel === 'include' ? '(Included)' : `(${orderTax}%)`}
                </td>
                <td className='text-end'>
                  ${totalTax.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </td>
              </tr>
              <tr>
                <td colSpan={6} className='text-end'>
                  Shipping Cost
                </td>
                <td className='text-end'>
                  ${shippingRate.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </td>
              </tr>
              <tr>
                <td colSpan={6} className='fs-3 text-gray-900 text-end'>
                  Grand Total
                </td>
                <td className='text-gray-900 fs-3 fw-bolder text-end'>
                  ${grandTotal.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      {/*end::Card body*/}
    </div>
  )
}
