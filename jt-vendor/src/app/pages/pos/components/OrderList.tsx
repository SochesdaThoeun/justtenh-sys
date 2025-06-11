import React, { useEffect, useState } from "react";
import CustomerDetailsModal from "./CustomerDetailsModal";
import { BillingAddressData as Address, Customer } from '@/app/redux/models';
import { ORDER_STATUS } from '@/app/constants/api.constants';
import OrderCompletionModal from "./OrderCompletionModal";
import OrderFailureModal from "./OrderFailureModal";

// Local interface for order items
export interface OrderItem {
  id: number;
  image: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
  variant_type?: string;
  variant_name?: string;
  variant_id?: number;
  current_stock?: number; // Added for stock validation
  discount?: number;
  discount_type?: string;
  tax?: number;
  tax_model?: string;
}

interface OrderListProps {
  orderItems: OrderItem[];
  onClearAll: () => void;
  onQuantityDecrease: (itemId: number) => void;
  onQuantityIncrease: (itemId: number) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  onTaxUpdate?: (rate: number, model: string) => void;
  onDiscountUpdate?: (value: number, type: string) => void;
  onShippingUpdate?: (cost: number) => void;
  taxRate?: number;
  taxModel?: string;
  discountValue?: number;
  discountType?: string;
  shippingCost?: number;
}

// Customer data interface
interface CustomerData {
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: string;
  orderStatus: string;
  paymentStatus: string;
  orderDate: string;
  selectedCustomer?: Customer | null;
}

const OrderList: React.FC<OrderListProps> = ({
  orderItems,
  onClearAll,
  onQuantityDecrease,
  onQuantityIncrease,
  onSubmit,
  isSubmitting = false,
  onTaxUpdate,
  onDiscountUpdate,
  onShippingUpdate,
  taxRate: propTaxRate,
  taxModel: propTaxModel,
  discountValue: propDiscountValue,
  discountType: propDiscountType,
  shippingCost: propShippingCost,
}) => {
  // States for totals, discount, tax, etc.
  const [subtotal, setSubtotal] = useState<number>(0);
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);

  // Payment method state
  const [paymentMethod, setPaymentMethod] = useState("1"); // "Card" default
  
  // Customer details modal state
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  
  // Tax and discount modals state
  const [isTaxModalOpen, setIsTaxModalOpen] = useState(false);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  
  // Tax settings - use props if available, otherwise use local state
  const [taxRate, setTaxRate] = useState<number>(propTaxRate || 0);
  const [taxModel, setTaxModel] = useState<string>(propTaxModel || "exclude"); // "exclude" or "include"
  
  // Discount settings - use props if available, otherwise use local state
  const [discountValue, setDiscountValue] = useState<number>(propDiscountValue || 0);
  const [discountType, setDiscountType] = useState<string>(propDiscountType || "amount"); // "amount" or "percent"
  
  // Shipping cost - use prop if available
  const [shippingValue, setShippingValue] = useState<number>(propShippingCost || 0);

  // Order completion modals
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailureModal, setShowFailureModal] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [createdOrderId, setCreatedOrderId] = useState<number | null>(null);

  // Dynamically recalc subtotal, tax, grand total whenever orderItems changes
  useEffect(() => {
    // sum of all item totals
    const newSubtotal = orderItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    // Calculate tax based on tax model and rate
    let newTax = 0;
    if (taxModel === "exclude") {
      // Tax is additional to subtotal
      newTax = newSubtotal * (taxRate / 100);
    } else {
      // Tax is included in subtotal
      newTax = newSubtotal - (newSubtotal / (1 + (taxRate / 100)));
    }
    
    // Calculate discount
    let discountAmount = 0;
    if (discountType === "percent") {
      discountAmount = newSubtotal * (discountValue / 100);
    } else {
      discountAmount = discountValue;
    }
    
    const newGrandTotal = Number(
      (newSubtotal - discountAmount + (taxModel === "exclude" ? newTax : 0) + shippingValue).toFixed(2)
    );

    setSubtotal(Number(newSubtotal.toFixed(2)));
    setTax(Number(newTax.toFixed(2)));
    setDiscount(Number(discountAmount.toFixed(2)));
    setGrandTotal(newGrandTotal);
  }, [orderItems, taxRate, taxModel, discountValue, discountType, shippingValue]);
  
  // Update local states when props change
  useEffect(() => {
    if (propTaxRate !== undefined) setTaxRate(propTaxRate);
    if (propTaxModel) setTaxModel(propTaxModel);
    if (propDiscountValue !== undefined) setDiscountValue(propDiscountValue);
    if (propDiscountType) setDiscountType(propDiscountType);
    if (propShippingCost !== undefined) setShippingValue(propShippingCost);
  }, [propTaxRate, propTaxModel, propDiscountValue, propDiscountType, propShippingCost]);
  
  // Handle customer details save
  const handleSaveCustomerDetails = (data: CustomerData) => {
    setCustomerData(data);
    setIsCustomerModalOpen(false);
    // You can add additional logic here, like updating Redux state or API calls
  };
  
  // Handle tax settings save
  const handleSaveTaxSettings = () => {
    setIsTaxModalOpen(false);
    // Pass the raw tax rate and model to parent, not the calculated tax amount
    if (onTaxUpdate) {
      onTaxUpdate(taxRate, taxModel);
    }
  };
  
  // Handle discount settings save
  const handleSaveDiscountSettings = () => {
    setIsDiscountModalOpen(false);
    // Discount calculation is handled in the useEffect
    if (onDiscountUpdate) {
      onDiscountUpdate(discountValue, discountType);
    }
  };

  // Handle shipping cost change
  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = parseFloat(value) || 0;
    setShippingValue(numericValue);
    if (onShippingUpdate) {
      onShippingUpdate(numericValue);
    }
  };

  // Handle order creation
  const handleCreateOrder = () => {
    // Check for stock validation
    const stockIssues = orderItems.filter(item => {
      return item.current_stock !== undefined && item.quantity > item.current_stock;
    });

    if (stockIssues.length > 0) {
      setOrderError(`Some items exceed available stock: ${stockIssues.map(item => item.name).join(', ')}`);
      setShowFailureModal(true);
      return;
    }

    // Call the onSubmit callback from parent component
    onSubmit();
  };

  // Reset all form data after order completion
  const handleOrderComplete = () => {
    // Close the modal
    setShowSuccessModal(false);
    
    // Reset customer data
    setCustomerData(null);
    
    // Reset tax and discount settings
    setTaxRate(0);
    setTaxModel("exclude");
    setDiscountValue(0);
    setDiscountType("amount");
    
    // Reset payment method
    setPaymentMethod("1");
    
    // Clear cart items (via parent component)
    onClearAll();
  };

  return (
    <>
      <div className="card card-flush bg-body" id="kt_pos_form">
        {/*begin::Header*/}
        <div className="card-header pt-5">
          <h3 className="card-title fw-bold text-gray-800 fs-2qx">
            Current Order
          </h3>
          {/*begin::Toolbar*/}
          <div className="card-toolbar">
            <a
              href="#"
              className="btn btn-light-primary fs-4 fw-bold py-4"
              onClick={(e) => {
                e.preventDefault();
                onClearAll();
              }}
            >
              Clear All
            </a>
          </div>
          {/*end::Toolbar*/}
        </div>
        {/*end::Header*/}

        {/*begin::Body*/}
        <div className="card-body pt-0">
          {/*begin::Table container*/}
          <div className="table-responsive mb-8">
            {/*begin::Table*/}
            <table className="table align-middle gs-0 gy-4 my-0">
              <thead>
                <tr>
                  <th className="min-w-175px"></th>
                  <th className="w-125px"></th>
                  <th className="w-60px"></th>
                </tr>
              </thead>
              <tbody>
                {orderItems.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center py-5">
                      <p className="fs-6 text-gray-500">No items in your order yet</p>
                    </td>
                  </tr>
                ) : (
                  orderItems.map((item) => (
                    <tr
                      key={item.variant_id ? `${item.id}-${item.variant_id}` : item.id}
                      data-kt-pos-element="item"
                      data-kt-pos-item-price={item.price}
                    >
                      <td className="pe-0">
                        <div className="d-flex align-items-center">
                          <img
                            src={item.image}
                            className="w-50px h-50px rounded-3 me-3"
                            alt=""
                          />
                          <div>
                            <span className="fw-bold text-gray-800 cursor-pointer text-hover-primary fs-6 me-1">
                              {item.name}
                            </span>
                            {/* Display variant information if available */}
                            {item.variant_type && item.variant_name && (
                              <div className="fs-7 text-muted">
                                {item.variant_type}: {item.variant_name}
                              </div>
                            )}
                            {/* Stock warning if quantity is close to or exceeds stock */}
                            {item.current_stock !== undefined && item.quantity >= item.current_stock && (
                              <div className="fs-7 text-danger mt-1">
                                Max stock reached!
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="pe-0">
                        {/*begin::Dialer*/}
                        <div
                          className="position-relative d-flex align-items-center"
                          data-kt-dialer="true"
                          data-kt-dialer-min="1"
                          data-kt-dialer-max="10"
                          data-kt-dialer-step="1"
                          data-kt-dialer-decimals="0"
                        >
                          {/*begin::Decrease control*/}
                          <a
                            href="#"
                            className="btn btn-icon btn-sm btn-light btn-icon-gray-500"
                            data-kt-dialer-control="decrease"
                            onClick={(e) => {
                              e.preventDefault();
                              onQuantityDecrease(item.id);
                            }}
                          >
                            <i className="ki-duotone ki-minus fs-3x"></i>
                          </a>
                          {/*end::Decrease control*/}

                          {/*begin::Input control*/}
                          <input
                            type="text"
                            className="form-control border-0 text-center px-0 fs-3 fw-bold text-gray-800 w-30px"
                            data-kt-dialer-control="input"
                            placeholder="Amount"
                            name="manageBudget"
                            readOnly
                            value={item.quantity}
                          />
                          {/*end::Input control*/}

                          {/*begin::Increase control*/}
                          <a
                            href="#"
                            className={`btn btn-icon btn-sm btn-light btn-icon-gray-500 ${
                              item.current_stock !== undefined && item.quantity >= item.current_stock ? 'disabled' : ''
                            }`}
                            data-kt-dialer-control="increase"
                            onClick={(e) => {
                              e.preventDefault();
                              // Only allow increase if stock permits
                              if (item.current_stock === undefined || item.quantity < item.current_stock) {
                                onQuantityIncrease(item.id);
                              }
                            }}
                          >
                            <i className="ki-duotone ki-plus fs-3x"></i>
                          </a>
                          {/*end::Increase control*/}
                        </div>
                        {/*end::Dialer*/}
                      </td>
                      <td className="text-end">
                        <span
                          className="fw-bold text-primary fs-2"
                          data-kt-pos-element="item-total"
                        >
                          ${item.total.toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            {/*end::Table*/}
          </div>
          {/*end::Table container*/}

          {/*begin::Summary*/}
          <div className="d-flex flex-stack bg-success rounded-3 p-6 mb-11">
            <div className="fs-6 fw-bold text-white">
              <span className="d-block lh-1 mb-2">Subtotal</span>
              <span className="d-block mb-2">Discounts</span>
              <span className="d-block mb-2">Tax</span>
              <span className="d-block mb-9">Shipping</span>
              <span className="d-block fs-2qx lh-1">Total</span>
            </div>
            <div className="fs-6 fw-bold text-white text-end">
              <span className="d-block lh-1 mb-2" data-kt-pos-element="total">
                ${subtotal}
              </span>
              <span className="d-block mb-2" data-kt-pos-element="discount">
                -${discount} {discountType === "percent" && discountValue > 0 && `(${discountValue}%)`}
              </span>
              <span className="d-block mb-2" data-kt-pos-element="tax">
                ${tax} {taxModel === "include" ? "(Included)" : taxRate > 0 ? `(${taxRate}%)` : ""}
              </span>
              <span className="d-block mb-9" data-kt-pos-element="shipping">
                ${shippingValue.toFixed(2)}
              </span>
              <span
                className="d-block fs-2qx lh-1"
                data-kt-pos-element="grant-total"
              >
                ${grandTotal}
              </span>
            </div>
          </div>
          {/*end::Summary*/}

          {/* BEGIN::Tax, Discount, and Shipping Buttons */}
          <div className="d-flex flex-stack mb-6">
            <div className="w-33 me-2">
              <button 
                type="button" 
                className="btn btn-light-success w-100 py-3 fs-6 fw-bold"
                onClick={(e) => {
                  e.preventDefault();
                  setIsDiscountModalOpen(true);
                }}
              >
                <i className="ki-duotone ki-tag fs-2 me-2"></i>
                Discount
              </button>
            </div>
            <div className="w-33 mx-2">
              <button 
                type="button" 
                className="btn btn-light-primary w-100 py-3 fs-6 fw-bold"
                onClick={(e) => {
                  e.preventDefault();
                  setIsTaxModalOpen(true);
                }}
              >
                <i className="ki-duotone ki-dollar fs-2 me-2"></i>
                Tax
              </button>
            </div>
            <div className="w-33 ms-2">
              <button
                type="button"
                className="btn btn-light-info w-100 py-3 fs-6 fw-bold"
                data-bs-toggle="modal"
                data-bs-target="#shippingModal"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('shippingModal')?.classList.add('show');
                  document.getElementById('shippingModal')?.style.setProperty('display', 'block');
                }}
              >
                <i className="ki-duotone ki-truck fs-2 me-2"></i>
                Shipping
              </button>
            </div>
          </div>
          {/* END::Tax, Discount, and Shipping Buttons */}

          {/*begin::Payment Method*/}
          <div className="m-0">
            <h1 className="fw-bold text-gray-800 mb-5">Payment Method</h1>
            <div
              className="d-flex flex-equal gap-5 gap-xxl-9 px-0 mb-5"
              data-kt-buttons="true"
              data-kt-buttons-target="[data-kt-button]"
            >
              {/*begin::Radio - CASH*/}
              <label
                className={`btn bg-light btn-color-gray-600 btn-active-text-gray-800 border border-3 border-gray-100 border-active-primary btn-active-light-primary w-100 px-4 ${
                  paymentMethod === "0" ? "active" : ""
                }`}
                data-kt-button="true"
              >
                <input
                  className="btn-check"
                  type="radio"
                  name="method"
                  value="0"
                  onChange={() => setPaymentMethod("0")}
                  checked={paymentMethod === "0"}
                />
                <i className="ki-solid ki-dollar fs-2hx mb-2 pe-0"></i>
                <span className="fs-7 fw-bold d-block">Cash</span>
              </label>
              {/*end::Radio*/}

              {/*begin::Radio - CARD*/}
              <label
                className={`btn bg-light btn-color-gray-600 btn-active-text-gray-800 border border-3 border-gray-100 border-active-primary btn-active-light-primary w-100 px-4 ${
                  paymentMethod === "1" ? "active" : ""
                }`}
                data-kt-button="true"
              >
                <input
                  className="btn-check"
                  type="radio"
                  name="method"
                  value="1"
                  onChange={() => setPaymentMethod("1")}
                  checked={paymentMethod === "1"}
                />
                <i className="ki-solid ki-credit-cart fs-2hx mb-2 pe-0"></i>
                <span className="fs-7 fw-bold d-block">Card</span>
              </label>
              {/*end::Radio*/}

              {/*begin::Radio - E-WALLET*/}
              <label
                className={`btn bg-light btn-color-gray-600 btn-active-text-gray-800 border border-3 border-gray-100 border-active-primary btn-active-light-primary w-100 px-4 ${
                  paymentMethod === "2" ? "active" : ""
                }`}
                data-kt-button="true"
              >
                <input
                  className="btn-check"
                  type="radio"
                  name="method"
                  value="2"
                  onChange={() => setPaymentMethod("2")}
                  checked={paymentMethod === "2"}
                />
                <i className="ki-solid ki-paypal fs-2hx mb-2 pe-0"></i>
                <span className="fs-7 fw-bold d-block">E-Wallet</span>
              </label>
              {/*end::Radio*/}
            </div>
            {/*end::Radio group*/}
            
            {/* BEGIN::Customer Info Button */}
            <button
              type="button"
              className="btn btn-light-success w-100 mb-5 py-3 fs-6 fw-bold"
              onClick={() => setIsCustomerModalOpen(true)}
            >
              <i className="ki-duotone ki-profile-user fs-2 me-2">
                <span className="path1"></span>
                <span className="path2"></span>
                <span className="path3"></span>
              </i>
              {customerData ? 'Update Customer Details' : 'Add Customer Details'}
            </button>
            
            {/* Display customer info if available */}
            {customerData && (
              <div className="bg-light-primary p-4 rounded mb-5">
                <h6 className="fs-6 mb-3">Customer Information</h6>
                <div className="d-flex flex-column gap-2 fs-7">
                  {customerData.selectedCustomer ? (
                    <>
                      <div>
                        <span className="fw-bold">Name:</span> {customerData.selectedCustomer.f_name} {customerData.selectedCustomer.l_name}
                      </div>
                      <div>
                        <span className="fw-bold">Phone:</span> {customerData.selectedCustomer.phone}
                      </div>
                      <div>
                        <span className="fw-bold">Email:</span> {customerData.selectedCustomer.email}
                      </div>
                      <div>
                        <span className="fw-bold">Address:</span> {customerData.shippingAddress.address}, {customerData.shippingAddress.city}, {customerData.shippingAddress.zip}
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <span className="fw-bold">Name:</span> {customerData.shippingAddress.contact_person_name}
                      </div>
                      <div>
                        <span className="fw-bold">Phone:</span> {customerData.shippingAddress.phone}
                      </div>
                      <div>
                        <span className="fw-bold">Email:</span> {customerData.shippingAddress.email}
                      </div>
                      <div>
                        <span className="fw-bold">Address:</span> {customerData.shippingAddress.address}, {customerData.shippingAddress.city}, {customerData.shippingAddress.zip}
                      </div>
                    </>
                  )}
                  <div>
                    <span className="fw-bold">Order Status:</span> {customerData.orderStatus}
                  </div>
                  <div>
                    <span className="fw-bold">Payment Method:</span> {customerData.paymentMethod === 'cash_on_delivery' ? 'Cash on Delivery' : 'ABA KHQR'}
                  </div>
                  <div>
                    <span className="fw-bold">Payment Status:</span> {customerData.paymentStatus}
                  </div>
                </div>
              </div>
            )}
            {/* END::Customer Info Button */}

            {/*begin::Actions*/}
            <button
              className="btn btn-primary fs-1 w-100 py-4"
              id="kt_pos_place_order_button"
              onClick={handleCreateOrder}
              disabled={orderItems.length === 0 || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Processing...
                </>
              ) : (
                'Place Order'
              )}
            </button>
            {/*end::Actions*/}
          </div>
          {/*end::Payment Method*/}
        </div>
        {/*end::Card Body*/}
      </div>
      
      {/* Customer Details Modal */}
      <CustomerDetailsModal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        onSave={handleSaveCustomerDetails}
      />
      
      {/* Tax Settings Modal */}
      {isTaxModalOpen && (
        <div
          className="modal fade show"
          id="taxSettingsModal"
          tabIndex={-1}
          aria-hidden="true"
          role="dialog"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered mw-500px">
            <div className="modal-content">
              <div className="modal-header pb-0 border-0 justify-content-end">
                <div className="btn btn-sm btn-icon btn-active-color-primary" onClick={() => setIsTaxModalOpen(false)}>
                  <i className="ki-duotone ki-cross fs-1">
                    <span className="path1"></span>
                    <span className="path2"></span>
                  </i>
                </div>
              </div>
              
              <div className="modal-body scroll-y mx-5 mx-xl-15 my-7">
                <div className="d-flex flex-column scroll-y me-n7 pe-7" id="taxSettingsModal_scroll">
                  <h2 className="fw-bold mb-5">Tax Settings</h2>
                  
                  <div className="mb-5">
                    <label className="form-label fw-bold">Tax Rate (%)</label>
                    <input 
                      type="number" 
                      className="form-control"
                      value={taxRate}
                      min="0"
                      step="0.1"
                      onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  
                  <div className="mb-5">
                    <label className="form-label fw-bold">Tax Model</label>
                    <select 
                      className="form-select"
                      value={taxModel}
                      onChange={(e) => setTaxModel(e.target.value)}
                    >
                      <option value="exclude">Tax Excluded (add on top)</option>
                      <option value="include">Tax Included (already in price)</option>
                    </select>
                    <div className="form-text">
                      {taxModel === "exclude" 
                        ? "Tax will be added on top of the product price"
                        : "Tax is already included in the product price"
                      }
                    </div>
                  </div>
                </div>
                
                <div className="text-center pt-5">
                  <button 
                    type="button" 
                    className="btn btn-primary" 
                    onClick={handleSaveTaxSettings}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Discount Settings Modal */}
      {isDiscountModalOpen && (
        <div
          className="modal fade show"
          id="discountSettingsModal"
          tabIndex={-1}
          aria-hidden="true"
          role="dialog"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered mw-500px">
            <div className="modal-content">
              <div className="modal-header pb-0 border-0 justify-content-end">
                <div className="btn btn-sm btn-icon btn-active-color-primary" onClick={() => setIsDiscountModalOpen(false)}>
                  <i className="ki-duotone ki-cross fs-1">
                    <span className="path1"></span>
                    <span className="path2"></span>
                  </i>
                </div>
              </div>
              
              <div className="modal-body scroll-y mx-5 mx-xl-15 my-7">
                <div className="d-flex flex-column scroll-y me-n7 pe-7" id="discountSettingsModal_scroll">
                  <h2 className="fw-bold mb-5">Discount Settings</h2>
                  
                  <div className="mb-5">
                    <label className="form-label fw-bold">Discount Value</label>
                    <input 
                      type="number" 
                      className="form-control"
                      value={discountValue}
                      min="0"
                      step={discountType === "percent" ? "0.1" : "1"}
                      onChange={(e) => setDiscountValue(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  
                  <div className="mb-5">
                    <label className="form-label fw-bold">Discount Type</label>
                    <select 
                      className="form-select"
                      value={discountType}
                      onChange={(e) => setDiscountType(e.target.value)}
                    >
                      <option value="amount">Fixed Amount ($)</option>
                      <option value="percent">Percentage (%)</option>
                    </select>
                    <div className="form-text">
                      {discountType === "amount" 
                        ? "A fixed amount will be deducted from the total"
                        : "A percentage of the subtotal will be deducted"
                      }
                    </div>
                  </div>
                </div>
                
                <div className="text-center pt-5">
                  <button 
                    type="button" 
                    className="btn btn-primary" 
                    onClick={handleSaveDiscountSettings}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shipping Cost Modal */}
      <div 
        className="modal fade" 
        id="shippingModal" 
        tabIndex={-1} 
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered mw-500px">
          <div className="modal-content">
            <div className="modal-header pb-0 border-0 justify-content-end">
              <div 
                className="btn btn-sm btn-icon btn-active-color-primary" 
                data-bs-dismiss="modal"
                onClick={() => {
                  document.getElementById('shippingModal')?.classList.remove('show');
                  document.getElementById('shippingModal')?.style.setProperty('display', 'none');
                }}
              >
                <i className="ki-duotone ki-cross fs-1">
                  <span className="path1"></span>
                  <span className="path2"></span>
                </i>
              </div>
            </div>
            
            <div className="modal-body scroll-y mx-5 mx-xl-15 my-7">
              <div className="d-flex flex-column scroll-y me-n7 pe-7">
                <h2 className="fw-bold mb-5">Shipping Cost</h2>
                
                <div className="mb-5">
                  <label className="form-label fw-bold">Shipping Amount ($)</label>
                  <input 
                    type="number" 
                    className="form-control"
                    value={shippingValue}
                    min="0"
                    step="0.01"
                    onChange={handleShippingChange}
                  />
                </div>
              </div>
              
              <div className="text-center pt-5">
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  data-bs-dismiss="modal"
                  onClick={() => {
                    document.getElementById('shippingModal')?.classList.remove('show');
                    document.getElementById('shippingModal')?.style.setProperty('display', 'none');
                  }}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Success Modal */}
      <OrderCompletionModal
        isOpen={showSuccessModal}
        orderId={createdOrderId}
        onClose={handleOrderComplete}
      />

      {/* Order Failure Modal */}
      <OrderFailureModal
        isOpen={showFailureModal}
        errorMessage={orderError}
        onClose={() => setShowFailureModal(false)}
      />
    </>
  );
};

export default OrderList; 