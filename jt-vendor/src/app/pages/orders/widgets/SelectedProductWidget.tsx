import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/app/redux/store';
import {
  updateCartItemQuantity,
  removeCartItem,
  calculateSubtotal,
  calculateTotalDiscount,
  calculateTotalTax,
  calculateGrandTotal,
  setExtraDiscount,
  setExtraDiscountType,
  updateTaxSettings,
  setShippingCost
} from '@/app/redux/order/orderCreation.slice';
import { calculateCartTotals } from '@/app/redux/order/orderCreation.service';
import { KTIcon } from '../../../../_metronic/helpers';

interface ProductWidgetProps {
  onRemoveProduct?: (productId: number) => void;
  onUpdateQuantity?: (productId: number, newQuantity: number) => void;
}

// Widget for displaying selected products
const SelectedProductWidget: React.FC<ProductWidgetProps> = ({
  onRemoveProduct,
  onUpdateQuantity
}) => {
  const dispatch = useDispatch<AppDispatch>();
  
  // Get Redux state for cart items and pricing
  const { 
    cartItems,
    extraDiscount,
    extraDiscountType,
    couponDiscount,
    couponDiscountType,
    shippingCost
  } = useSelector((state: RootState) => state.orderCreation);
  
  // Local state for form inputs
  const [discountValue, setDiscountValue] = useState<string>(extraDiscount.toString());
  const [taxRate, setTaxRate] = useState<string>('0');
  const [taxModel, setTaxModel] = useState<string>('exclude');
  const [shippingValue, setShippingValue] = useState<string>(shippingCost.toString());
  
  // Decrement quantity
  const handleDecrement = (itemId: number, variantId?: number) => {
    const item = cartItems.find(item => 
      (variantId && item.variant_id === variantId) || 
      (!variantId && item.id === itemId)
    );
    
    if (item) {
      if (onUpdateQuantity) {
        // Use custom handler if provided
        onUpdateQuantity(itemId, item.quantity - 1);
      } else {
        // Fall back to default behavior - use variantId if it exists
        dispatch(updateCartItemQuantity({ 
          id: variantId || itemId, 
          quantity: item.quantity - 1 
        }));
      }
    }
  };
  
  // Increment quantity
  const handleIncrement = (itemId: number, variantId?: number) => {
    const item = cartItems.find(item => 
      (variantId && item.variant_id === variantId) || 
      (!variantId && item.id === itemId)
    );
    
    if (item) {
      if (onUpdateQuantity) {
        // Use custom handler if provided
        onUpdateQuantity(itemId, item.quantity + 1);
      } else {
        // Fall back to default behavior - use variantId if it exists
        dispatch(updateCartItemQuantity({ 
          id: variantId || itemId, 
          quantity: item.quantity + 1 
        }));
      }
    }
  };
  
  // Remove item from cart
  const handleRemoveItem = (itemId: number, variantId?: number) => {
    if (onRemoveProduct) {
      // Use custom handler if provided
      onRemoveProduct(itemId);
    } else {
      // Fall back to default behavior - use variantId if it exists
      dispatch(removeCartItem(variantId || itemId));
    }
  };

  // Handle discount change
  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDiscountValue(value);
    const numericValue = parseFloat(value) || 0;
    dispatch(setExtraDiscount(numericValue));
  };

  // Handle discount type change
  const handleDiscountTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // Only allow "amount" or "percent" as values
    const value = e.target.value === 'percent' ? 'percent' : 'amount';
    dispatch(setExtraDiscountType(value));
  };

  // Handle tax rate change
  const handleTaxRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Validate tax rate (ensure it's a non-negative number)
    const numericValue = Math.max(0, parseFloat(value) || 0);
    
    // Update local state
    setTaxRate(numericValue.toString());
    
    // Update tax rate for all cart items
    dispatch(updateTaxSettings({ 
      taxRate: numericValue,
      taxModel
    }));
  };

  // Handle tax model change
  const handleTaxModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    
    // Update local state
    setTaxModel(value);
    
    // Update tax model for all cart items
    const numericTaxRate = parseFloat(taxRate) || 0;
    dispatch(updateTaxSettings({ 
      taxRate: numericTaxRate,
      taxModel: value
    }));
  };

  // Handle shipping cost change
  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setShippingValue(value);
    const numericValue = parseFloat(value) || 0;
    dispatch(setShippingCost(numericValue));
  };

  // Initialize tax rate from first cart item if available
  useEffect(() => {
    if (cartItems.length > 0) {
      const firstItemTax = cartItems[0].tax;
      const firstItemTaxModel = cartItems[0].tax_model;
      
      setTaxRate(firstItemTax.toString());
      setTaxModel(firstItemTaxModel);
    }
  }, [cartItems.length]);
  
  // Initialize tooltips
  useEffect(() => {
    // Only try to initialize tooltips if Bootstrap is available
    if (window.bootstrap && window.bootstrap.Tooltip) {
      const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
      const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new window.bootstrap.Tooltip(tooltipTriggerEl);
      });
      
      // Clean up tooltips on unmount
      return () => {
        tooltipList.forEach(tooltip => {
          if (tooltip && typeof tooltip.dispose === 'function') {
            tooltip.dispose();
          }
        });
      };
    }
  }, [cartItems.length]); // Re-initialize when cart items change
  
  // Calculate values for display
  const subtotal = useSelector((state: RootState) => calculateSubtotal(state.orderCreation));
  const totalDiscount = useSelector((state: RootState) => calculateTotalDiscount(state.orderCreation));
  const totalTax = useSelector((state: RootState) => calculateTotalTax(state.orderCreation));
  const grandTotal = useSelector((state: RootState) => calculateGrandTotal(state.orderCreation));
  
  return (
    <div className="card card-flush py-4 flex-row-fluid overflow-hidden">
      <div className="card-header">
        <div className="card-title">
          <h2>Selected Products</h2>
        </div>
      </div>

      <div className="card-body pt-0">
        {cartItems.length === 0 ? (
          <span className="text-muted">
            No products have been added yet.
          </span>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle table-row-dashed fs-6 gy-5 mb-0">
              <thead>
                <tr className="text-start text-gray-500 fw-bold fs-7 text-uppercase gs-0">
                  <th className="min-w-175px">Product</th>
                  <th className="min-w-100px text-end">Price</th>
                  <th className="min-w-70px text-end">Qty</th>
                  <th className="min-w-100px text-end">Total</th>
                </tr>
              </thead>
              <tbody className="fw-semibold text-gray-600">
                {cartItems.map((item) => {
                  // Calculate tax value for display
                  const itemTaxValue = item.tax_model === 'include' 
                    ? (item.price * item.quantity) - ((item.price * item.quantity) / (1 + item.tax / 100))
                    : (item.price * item.quantity * (item.tax / 100));
                    
                  // Calculate discount value for display - only 'percent' or 'amount' allowed
                  const itemDiscountValue = item.discount_type === 'percent'
                    ? (item.price * item.quantity * (item.discount / 100))
                    : (item.discount * item.quantity);
                  
                  return (
                    <tr key={item.variant_id || item.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          {item.image ? (
                            <a href="#" className="symbol symbol-50px me-3">
                              <span
                                className="symbol-label"
                                style={{
                                  backgroundImage: `url(${item.image})`
                                }}
                              />
                            </a>
                          ) : (
                            <div className="symbol symbol-50px">
                              <span className="symbol-label bg-light-primary">
                                <i className="ki-outline ki-product fs-2x text-primary"></i>
                              </span>
                            </div>
                          )}
                          <div className="ms-5">
                            <a
                              href="#"
                              className="fw-bold text-gray-600 text-hover-primary"
                            >
                              {item.name}
                              {item.variant && !item.name.includes(item.variant) && ` - ${item.variant}`}
                            </a>
                            <div className="fs-7 text-muted">
                              Variant: {item.variant || 'None'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="text-end">
                        ${item.price.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                      </td>
                      <td className="text-end">
                        <div className="d-flex justify-content-end align-items-center">
                          <button
                            type="button"
                            className="btn btn-icon btn-sm btn-light-primary me-2"
                            onClick={() => handleDecrement(item.id, item.variant_id)}
                          >
                            <i className="ki-outline ki-minus fs-2"></i>
                          </button>
                          {item.quantity}
                          <button
                            type="button"
                            className="btn btn-icon btn-sm btn-light-primary ms-2"
                            onClick={() => handleIncrement(item.id, item.variant_id)}
                            disabled={item.quantity >= item.stock}
                          >
                            <i className="ki-outline ki-plus fs-2"></i>
                          </button>
                          <button
                            type="button"
                            className="btn btn-icon btn-sm btn-light-danger ms-3"
                            onClick={() => handleRemoveItem(item.id, item.variant_id)}
                          >
                            <i className="ki-outline ki-trash fs-2"></i>
                          </button>
                        </div>
                      </td>
                      <td className="text-end">
                        ${item.subtotal.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                      </td>
                    </tr>
                  );
                })}
                
                {/* Summary rows */}
                <tr>
                  <td colSpan={3} className="text-end">
                    Subtotal
                  </td>
                  <td className="text-end">
                    ${subtotal.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                  </td>
                </tr>
                
                <tr>
                <td>  </td>
                <td>  </td>
                  <td colSpan={3} className="text-end d-flex justify-content-end align-items-center">
                    <span className="me-3">Item Discount</span>
                    <div className="d-flex align-items-center">
                      <input
                        type="number"
                        className="form-control form-control-sm w-75px"
                        value={discountValue}
                        onChange={handleDiscountChange}
                        min="0"
                        placeholder="0.00"
                      />
                      <select
                        className="form-select form-select-sm w-60px ms-2"
                        value={extraDiscountType}
                        onChange={handleDiscountTypeChange}
                      >
                        <option value="amount">$</option>
                        <option value="percent">%</option>
                      </select>
                    </div>
                  </td>
                  <td className="text-end">
                    -${totalDiscount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                  </td>
                </tr>
                <tr>
                  <td>  </td>
                  <td>  </td>
                  <td colSpan={3} className="text-end d-flex justify-content-end align-items-center">
                    <span className="me-3">VAT</span>
                    <div className="d-flex align-items-center">
                      <input
                        type="number"
                        className="form-control form-control-sm w-75px"
                        value={taxRate}
                        onChange={handleTaxRateChange}
                        min="0"
                        max="100"
                        placeholder="0"
                      />
                      <span className="mx-2">%</span>
                      <select
                        className="form-select form-select-sm w-auto"
                        value={taxModel}
                        onChange={handleTaxModelChange}
                      >
                        <option value="exclude">Exclusive</option>
                        <option value="include">Inclusive</option>
                      </select>
                    </div>
                  </td>
                  <td className="text-end">
                    ${totalTax.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                  </td>
                </tr>
                <tr>
                <td>  </td>
                <td>  </td>
                  <td colSpan={3} className="text-end d-flex justify-content-end align-items-center">
                    <span className="me-3">Shipping Cost</span>
                    <div className="d-flex align-items-center">
                      <input
                        type="number"
                        className="form-control form-control-sm w-75px"
                        value={shippingValue}
                        onChange={handleShippingChange}
                        min="0"
                        placeholder="0.00"
                      />
                      <span className="mx-2">$</span>
                    </div>
                  </td>
                  <td className="text-end">
                    ${shippingCost.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                  </td>
                </tr>
                <tr>
                  <td colSpan={3} className="fs-3 text-gray-900 text-end">
                    Grand Total
                  </td>
                  <td className="text-gray-900 fs-3 fw-bolder text-end">
                    ${grandTotal.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectedProductWidget; 