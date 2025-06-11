import React, { useState } from 'react';
import Select from 'react-select';

// ---------------------------------------------------
// 5) CUSTOMERS SETTINGS WIDGET
// ---------------------------------------------------
export function CustomersSettingsWidget() {
    const [customersOnline, setCustomersOnline] = useState('yes');
    const [customersActivity, setCustomersActivity] = useState('yes');
    const [customersSearches, setCustomersSearches] = useState('yes');
    const [customersGuestCheckout, setCustomersGuestCheckout] = useState('no');
    const [customersLoginPrices, setCustomersLoginPrices] = useState('no');
    const [customerLoginAttempts, setCustomerLoginAttempts] = useState('');
  
    const handleCustomersSubmit = (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
     
    };
  
    const handleCancel = (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      
      setCustomersOnline('yes');
      setCustomersActivity('yes');
      setCustomersSearches('yes');
      setCustomersGuestCheckout('no');
      setCustomersLoginPrices('no');
      setCustomerLoginAttempts('');
    };
  
    return (
      <div className="tab-pane fade" id="kt_ecommerce_settings_customers" role="tabpanel">
        <form
          id="kt_ecommerce_settings_general_customers"
          className="form"
          action="#"
        >
          <div className="row mb-7">
            <div className="col-md-9 offset-md-3">
              <h2>Customers Settings</h2>
            </div>
          </div>
  
          {/* Customers Online */}
          <div className="row fv-row mb-7">
            <div className="col-md-3 text-md-end">
              <label className="fs-6 fw-semibold form-label mt-3">
                <span>Customers Online</span>
                <span className="ms-1" data-bs-toggle="tooltip" title="Enable/disable tracking customers online status.">
                  <i className="ki-duotone ki-information-5 text-gray-500 fs-6">
                    <span className="path1"></span>
                    <span className="path2"></span>
                    <span className="path3"></span>
                  </i>
                </span>
              </label>
            </div>
            <div className="col-md-9">
              <div className="d-flex mt-3">
                <div className="form-check form-check-custom form-check-solid me-5">
                  <input
                    className="form-check-input"
                    type="radio"
                    value="yes"
                    name="customers_online"
                    id="customers_online_yes"
                    checked={customersOnline === 'yes'}
                    onChange={() => setCustomersOnline('yes')}
                  />
                  <label className="form-check-label" htmlFor="customers_online_yes">
                    Yes
                  </label>
                </div>
                <div className="form-check form-check-custom form-check-solid">
                  <input
                    className="form-check-input"
                    type="radio"
                    value="no"
                    name="customers_online"
                    id="customers_online_no"
                    checked={customersOnline === 'no'}
                    onChange={() => setCustomersOnline('no')}
                  />
                  <label className="form-check-label" htmlFor="customers_online_no">
                    No
                  </label>
                </div>
              </div>
            </div>
          </div>
  
          {/* Customers Activity */}
          <div className="row fv-row mb-7">
            <div className="col-md-3 text-md-end">
              <label className="fs-6 fw-semibold form-label mt-3">
                <span>Customers Activity</span>
                <span className="ms-1" data-bs-toggle="tooltip" title="Enable/disable tracking customers activity.">
                  <i className="ki-duotone ki-information-5 text-gray-500 fs-6">
                    <span className="path1"></span>
                    <span className="path2"></span>
                    <span className="path3"></span>
                  </i>
                </span>
              </label>
            </div>
            <div className="col-md-9">
              <div className="d-flex mt-3">
                <div className="form-check form-check-custom form-check-solid me-5">
                  <input
                    className="form-check-input"
                    type="radio"
                    value="yes"
                    name="customers_activity"
                    id="customers_activity_yes"
                    checked={customersActivity === 'yes'}
                    onChange={() => setCustomersActivity('yes')}
                  />
                  <label className="form-check-label" htmlFor="customers_activity_yes">
                    Yes
                  </label>
                </div>
                <div className="form-check form-check-custom form-check-solid">
                  <input
                    className="form-check-input"
                    type="radio"
                    value="no"
                    name="customers_activity"
                    id="customers_activity_no"
                    checked={customersActivity === 'no'}
                    onChange={() => setCustomersActivity('no')}
                  />
                  <label className="form-check-label" htmlFor="customers_activity_no">
                    No
                  </label>
                </div>
              </div>
            </div>
          </div>
  
          {/* Customers Searches */}
          <div className="row fv-row mb-7">
            <div className="col-md-3 text-md-end">
              <label className="fs-6 fw-semibold form-label mt-3">
                <span>Customer Searches</span>
                <span className="ms-1" data-bs-toggle="tooltip" title="Enable/disable logging customers search keywords.">
                  <i className="ki-duotone ki-information-5 text-gray-500 fs-6">
                    <span className="path1"></span>
                    <span className="path2"></span>
                    <span className="path3"></span>
                  </i>
                </span>
              </label>
            </div>
            <div className="col-md-9">
              <div className="d-flex mt-3">
                <div className="form-check form-check-custom form-check-solid me-5">
                  <input
                    className="form-check-input"
                    type="radio"
                    value="yes"
                    name="customers_searches"
                    id="customers_searches_yes"
                    checked={customersSearches === 'yes'}
                    onChange={() => setCustomersSearches('yes')}
                  />
                  <label className="form-check-label" htmlFor="customers_searches_yes">
                    Yes
                  </label>
                </div>
                <div className="form-check form-check-custom form-check-solid">
                  <input
                    className="form-check-input"
                    type="radio"
                    value="no"
                    name="customers_searches"
                    id="customers_searches_no"
                    checked={customersSearches === 'no'}
                    onChange={() => setCustomersSearches('no')}
                  />
                  <label className="form-check-label" htmlFor="customers_searches_no">
                    No
                  </label>
                </div>
              </div>
            </div>
          </div>
  
          {/* Allow Guest Checkout */}
          <div className="row fv-row mb-7">
            <div className="col-md-3 text-md-end">
              <label className="fs-6 fw-semibold form-label mt-3">
                <span>Allow Guest Checkout</span>
                <span className="ms-1" data-bs-toggle="tooltip" title="Enable/disable guest customers to checkout.">
                  <i className="ki-duotone ki-information-5 text-gray-500 fs-6">
                    <span className="path1"></span>
                    <span className="path2"></span>
                    <span className="path3"></span>
                  </i>
                </span>
              </label>
            </div>
            <div className="col-md-9">
              <div className="d-flex mt-3">
                <div className="form-check form-check-custom form-check-solid me-5">
                  <input
                    className="form-check-input"
                    type="radio"
                    value="yes"
                    name="customers_guest_checkout"
                    id="customers_guest_checkout_yes"
                    checked={customersGuestCheckout === 'yes'}
                    onChange={() => setCustomersGuestCheckout('yes')}
                  />
                  <label className="form-check-label" htmlFor="customers_guest_checkout_yes">
                    Yes
                  </label>
                </div>
                <div className="form-check form-check-custom form-check-solid">
                  <input
                    className="form-check-input"
                    type="radio"
                    value="no"
                    name="customers_guest_checkout"
                    id="customers_guest_checkout_no"
                    checked={customersGuestCheckout === 'no'}
                    onChange={() => setCustomersGuestCheckout('no')}
                  />
                  <label className="form-check-label" htmlFor="customers_guest_checkout_no">
                    No
                  </label>
                </div>
              </div>
            </div>
          </div>
  
          {/* Login Display Prices */}
          <div className="row fv-row mb-7">
            <div className="col-md-3 text-md-end">
              <label className="fs-6 fw-semibold form-label mt-3">
                <span>Login Display Prices</span>
                <span className="ms-1" data-bs-toggle="tooltip" title="Only show prices when customers log in.">
                  <i className="ki-duotone ki-information-5 text-gray-500 fs-6">
                    <span className="path1"></span>
                    <span className="path2"></span>
                    <span className="path3"></span>
                  </i>
                </span>
              </label>
            </div>
            <div className="col-md-9">
              <div className="d-flex mt-3">
                <div className="form-check form-check-custom form-check-solid me-5">
                  <input
                    className="form-check-input"
                    type="radio"
                    value="yes"
                    name="customers_login_prices"
                    id="customers_login_prices_yes"
                    checked={customersLoginPrices === 'yes'}
                    onChange={() => setCustomersLoginPrices('yes')}
                  />
                  <label className="form-check-label" htmlFor="customers_login_prices_yes">
                    Yes
                  </label>
                </div>
                <div className="form-check form-check-custom form-check-solid">
                  <input
                    className="form-check-input"
                    type="radio"
                    value="no"
                    name="customers_login_prices"
                    id="customers_login_prices_no"
                    checked={customersLoginPrices === 'no'}
                    onChange={() => setCustomersLoginPrices('no')}
                  />
                  <label className="form-check-label" htmlFor="customers_login_prices_no">
                    No
                  </label>
                </div>
              </div>
            </div>
          </div>
  
          {/* Max Login Attempts */}
          <div className="row fv-row mb-7">
            <div className="col-md-3 text-md-end">
              <label className="fs-6 fw-semibold form-label mt-3">
                <span className="required">Max Login Attempts</span>
                <span
                  className="ms-1"
                  data-bs-toggle="tooltip"
                  title="Set the max number of login attempts before account is locked"
                >
                  <i className="ki-duotone ki-information-5 text-gray-500 fs-6">
                    <span className="path1"></span>
                    <span className="path2"></span>
                    <span className="path3"></span>
                  </i>
                </span>
              </label>
            </div>
            <div className="col-md-9">
              <input
                type="text"
                className="form-control form-control-solid"
                name="customer_login_attempts"
                value={customerLoginAttempts}
                onChange={(e) => setCustomerLoginAttempts(e.target.value)}
              />
            </div>
          </div>
  
          {/* Action buttons */}
          <div className="row py-5">
            <div className="col-md-9 offset-md-3">
              <div className="d-flex">
                <a
                  href="#"
                  data-kt-ecommerce-settings-type="cancel"
                  className="btn btn-light me-3"
                  onClick={handleCancel}
                >
                  Cancel
                </a>
                <a
                  href="#"
                  data-kt-ecommerce-settings-type="submit"
                  className="btn btn-primary"
                  onClick={handleCustomersSubmit}
                >
                  <span className="indicator-label">Save</span>
                  <span className="indicator-progress">
                    Please wait...
                    <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
  