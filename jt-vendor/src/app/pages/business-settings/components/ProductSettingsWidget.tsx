import React, { useState } from 'react';
import Select from 'react-select';
// ---------------------------------------------------
// 4) PRODUCTS SETTINGS WIDGET
// ---------------------------------------------------
export function ProductSettingsWidget() {
    const [categoryProductCount, setCategoryProductCount] = useState('yes');
    const [itemsPerPage, setItemsPerPage] = useState('10');
    const [allowReviews, setAllowReviews] = useState('yes');
    const [allowGuestReviews, setAllowGuestReviews] = useState('no');
    const [minVoucher, setMinVoucher] = useState('1');
    const [maxVoucher, setMaxVoucher] = useState('10');
    const [displayPricesWithTax, setDisplayPricesWithTax] = useState('yes');
    const [defaultTaxRate, setDefaultTaxRate] = useState('15%');
  
    const handleProductsSubmit = (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      
    };
  
    const handleCancel = (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      
      setCategoryProductCount('yes');
      setItemsPerPage('10');
      setAllowReviews('yes');
      setAllowGuestReviews('no');
      setMinVoucher('1');
      setMaxVoucher('10');
      setDisplayPricesWithTax('yes');
      setDefaultTaxRate('15%');
    };
  
    return (
      <div className="tab-pane fade" id="kt_ecommerce_settings_products" role="tabpanel">
        <form
          id="kt_ecommerce_settings_general_products"
          className="form"
          action="#"
        >
          <div className="row mb-7">
            <div className="col-md-9 offset-md-3">
              <h2>Cateogries Settings</h2>
            </div>
          </div>
  
          {/* Category Product Count */}
          <div className="row fv-row mb-7">
            <div className="col-md-3 text-md-end">
              <label className="fs-6 fw-semibold form-label mt-3">
                <span>Category Product Count</span>
                <span
                  className="ms-1"
                  data-bs-toggle="tooltip"
                  title="Show the number of products inside the subcategories..."
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
              <div className="d-flex mt-3">
                <div className="form-check form-check-custom form-check-solid me-5">
                  <input
                    className="form-check-input"
                    type="radio"
                    value="yes"
                    name="category_product_count"
                    id="category_product_count_yes"
                    checked={categoryProductCount === 'yes'}
                    onChange={() => setCategoryProductCount('yes')}
                  />
                  <label className="form-check-label" htmlFor="category_product_count_yes">
                    Yes
                  </label>
                </div>
                <div className="form-check form-check-custom form-check-solid">
                  <input
                    className="form-check-input"
                    type="radio"
                    value="no"
                    name="category_product_count"
                    id="category_product_count_no"
                    checked={categoryProductCount === 'no'}
                    onChange={() => setCategoryProductCount('no')}
                  />
                  <label className="form-check-label" htmlFor="category_product_count_no">
                    No
                  </label>
                </div>
              </div>
            </div>
          </div>
  
          {/* Default Items Per Page */}
          <div className="row fv-row mb-16">
            <div className="col-md-3 text-md-end">
              <label className="fs-6 fw-semibold form-label mt-3">
                <span className="required">Default Items Per Page</span>
                <span
                  className="ms-1"
                  data-bs-toggle="tooltip"
                  title="Determines how many items are shown per page."
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
                name="products_items_per_page"
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(e.target.value)}
              />
            </div>
          </div>
  
          {/* Reviews Settings Heading */}
          <div className="row mb-7">
            <div className="col-md-9 offset-md-3">
              <h2>Reviews Settings</h2>
            </div>
          </div>
  
          {/* Allow Reviews */}
          <div className="row fv-row mb-7">
            <div className="col-md-3 text-md-end">
              <label className="fs-6 fw-semibold form-label mt-3">
                <span>Allow Reviews</span>
                <span className="ms-1" data-bs-toggle="tooltip" title="Enable/disable review entries...">
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
                    name="allow_reviews"
                    id="allow_reviews_yes"
                    checked={allowReviews === 'yes'}
                    onChange={() => setAllowReviews('yes')}
                  />
                  <label className="form-check-label" htmlFor="allow_reviews_yes">
                    Yes
                  </label>
                </div>
                <div className="form-check form-check-custom form-check-solid">
                  <input
                    className="form-check-input"
                    type="radio"
                    value="no"
                    name="allow_reviews"
                    id="allow_reviews_no"
                    checked={allowReviews === 'no'}
                    onChange={() => setAllowReviews('no')}
                  />
                  <label className="form-check-label" htmlFor="allow_reviews_no">
                    No
                  </label>
                </div>
              </div>
            </div>
          </div>
  
          {/* Allow Guest Reviews */}
          <div className="row fv-row mb-16">
            <div className="col-md-3 text-md-end">
              <label className="fs-6 fw-semibold form-label mt-3">
                <span>Allow Guest Reviews</span>
                <span className="ms-1" data-bs-toggle="tooltip" title="Enable/disable review entries for public guests">
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
                    name="allow_guest_reviews"
                    id="allow_guest_reviews_yes"
                    checked={allowGuestReviews === 'yes'}
                    onChange={() => setAllowGuestReviews('yes')}
                  />
                  <label className="form-check-label" htmlFor="allow_guest_reviews_yes">
                    Yes
                  </label>
                </div>
                <div className="form-check form-check-custom form-check-solid">
                  <input
                    className="form-check-input"
                    type="radio"
                    value="no"
                    name="allow_guest_reviews"
                    id="allow_guest_reviews_no"
                    checked={allowGuestReviews === 'no'}
                    onChange={() => setAllowGuestReviews('no')}
                  />
                  <label className="form-check-label" htmlFor="allow_guest_reviews_no">
                    No
                  </label>
                </div>
              </div>
            </div>
          </div>
  
          {/* Vouchers Settings Heading */}
          <div className="row mb-7">
            <div className="col-md-9 offset-md-3">
              <h2>Vouchers Settings</h2>
            </div>
          </div>
  
          {/* Minimum Vouchers */}
          <div className="row fv-row mb-7">
            <div className="col-md-3 text-md-end">
              <label className="fs-6 fw-semibold form-label mt-3">
                <span className="required">Minimum Vouchers</span>
                <span className="ms-1" data-bs-toggle="tooltip" title="Minimum number of vouchers...">
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
                name="products_min_voucher"
                value={minVoucher}
                onChange={(e) => setMinVoucher(e.target.value)}
              />
            </div>
          </div>
  
          {/* Maximum Vouchers */}
          <div className="row fv-row mb-16">
            <div className="col-md-3 text-md-end">
              <label className="fs-6 fw-semibold form-label mt-3">
                <span className="required">Maximum Vouchers</span>
                <span className="ms-1" data-bs-toggle="tooltip" title="Maximum number of vouchers...">
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
                name="products_max_voucher"
                value={maxVoucher}
                onChange={(e) => setMaxVoucher(e.target.value)}
              />
            </div>
          </div>
  
          {/* Tax Settings Heading */}
          <div className="row mb-7">
            <div className="col-md-9 offset-md-3">
              <h2>Tax Settings</h2>
            </div>
          </div>
  
          {/* Display Prices with Tax */}
          <div className="row fv-row mb-7">
            <div className="col-md-3 text-md-end">
              <label className="fs-6 fw-semibold form-label mt-3">
                <span>Display Prices with Tax</span>
              </label>
            </div>
            <div className="col-md-9">
              <div className="d-flex mt-3">
                <div className="form-check form-check-custom form-check-solid me-5">
                  <input
                    className="form-check-input"
                    type="radio"
                    value="yes"
                    name="product_tax"
                    id="product_tax_yes"
                    checked={displayPricesWithTax === 'yes'}
                    onChange={() => setDisplayPricesWithTax('yes')}
                  />
                  <label className="form-check-label" htmlFor="product_tax_yes">
                    Yes
                  </label>
                </div>
                <div className="form-check form-check-custom form-check-solid">
                  <input
                    className="form-check-input"
                    type="radio"
                    value="no"
                    name="product_tax"
                    id="product_tax_no"
                    checked={displayPricesWithTax === 'no'}
                    onChange={() => setDisplayPricesWithTax('no')}
                  />
                  <label className="form-check-label" htmlFor="product_tax_no">
                    No
                  </label>
                </div>
              </div>
            </div>
          </div>
  
          {/* Default Tax Rate */}
          <div className="row fv-row mb-7">
            <div className="col-md-3 text-md-end">
              <label className="fs-6 fw-semibold form-label mt-3">
                <span className="required">Default Tax Rate</span>
                <span className="ms-1" data-bs-toggle="tooltip" title="Determines the tax percentage (%) applied to orders">
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
                name="products_tax_rate"
                value={defaultTaxRate}
                onChange={(e) => setDefaultTaxRate(e.target.value)}
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
                  onClick={handleProductsSubmit}
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
  