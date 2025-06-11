import React, { useState, useEffect } from 'react'
import Select from 'react-select'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/app/redux/store'
import { fetchShopInfo, updateShopInfo, temporaryCloseShop, setVacationMode, deleteUserAccount } from '@/app/redux/vendor/vendorSlice'
import { SingleValue } from 'react-select'
import TemporaryCloseModal from './modals/TemporaryCloseModal'
import VacationModeModal from './modals/VacationModeModal'
import DeleteStoreModal from './modals/DeleteStoreModal'
import { toast } from 'sonner'

// Define option type for react-select
interface SelectOption {
  value: string;
  label: string;
}

// ---------------------------------------------------
// 2) STORE SETTINGS WIDGET
// ---------------------------------------------------
export function StoreSettingsWidget() {
  const dispatch = useDispatch<AppDispatch>()
  const { shopInfo, isLoading, error } = useSelector((state: RootState) => state.vendorReducer)

  // Initial load of shop info
  useEffect(() => {
    //console.log('Dispatching fetchShopInfo')
    dispatch(fetchShopInfo())
  }, [dispatch])

  // Store data - populated from API when loaded
  const [storeID, setStoreID] = useState<number>(0)
  const [sellerID, setSellerID] = useState<number>(0)
  const [storeName, setStoreName] = useState<string>('')
  const [storeSlug, setStoreSlug] = useState<string>('')
  const [storeAddress, setStoreAddress] = useState<string>('')
  const [storePhone, setStorePhone] = useState<string>('')
  const [storeImage, setStoreImage] = useState<string>('')
  const [storeBanner, setStoreBanner] = useState<string>('')
  const [storeRating, setStoreRating] = useState<number>(0)
  const [storeRatingCount, setStoreRatingCount] = useState<number>(0)
  const [vacationStatus, setVacationStatus] = useState<boolean>(false)
  const [vacationStartDate, setVacationStartDate] = useState<string>('')
  const [vacationEndDate, setVacationEndDate] = useState<string>('')
  const [vacationNote, setVacationNote] = useState<string>('')
  const [temporaryClose, setTemporaryClose] = useState<boolean>(false)
  const [formError, setFormError] = useState<string | null>(null)

  // File upload states
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [bannerFile, setBannerFile] = useState<File | null>(null) 
  const [bottomBannerFile, setBottomBannerFile] = useState<File | null>(null)
  const [offerBannerFile, setOfferBannerFile] = useState<File | null>(null)

  // Update form data when shopInfo is loaded
  useEffect(() => {
    ////console.log('shopInfo received in component:', shopInfo);
    
    setFormError(null);
    
    if (shopInfo) {
      ////console.log('Setting form data with shop info fields:', Object.keys(shopInfo));
      
      setStoreID(shopInfo.id || 0)
      setSellerID(shopInfo.seller_id || 0)
      setStoreName(shopInfo.name || '')
      setStoreSlug(shopInfo.slug || '')
      setStoreAddress(shopInfo.address || '')
      setStorePhone(shopInfo.contact || '')
      setStoreImage(shopInfo.image_full_url?.path || '')
      setStoreBanner(shopInfo.banner_full_url?.path || '')
      setStoreRating(shopInfo.rating || 0)
      setStoreRatingCount(shopInfo.rating_count || 0)
      setVacationStatus(shopInfo.vacation_status || false)
      setVacationStartDate(shopInfo.vacation_start_date || '')
      setVacationEndDate(shopInfo.vacation_end_date || '')
      setVacationNote(shopInfo.vacation_note || '')
      setTemporaryClose(shopInfo.temporary_close || false)
    } else if (!isLoading) {
      setFormError('No shop information available. Please refresh the page or contact support.');
    }
  }, [shopInfo, isLoading])

  // Handle file changes
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setLogoFile(file);
      
      // Create a preview of the file
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setStoreImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setBannerFile(file);
      
      // Create a preview of the file
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setStoreBanner(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle vacation mode toggle via modal
  const handleVacationModeUpdate = (data: {
    status: boolean;
    startDate: string;
    endDate: string;
    note: string;
  }) => {
    dispatch(setVacationMode({
      status: data.status,
      startDate: data.startDate,
      endDate: data.endDate,
      note: data.note
    }));
  };

  // Handle temporary close toggle via modal
  const handleTemporaryCloseUpdate = (status: boolean) => {
    dispatch(temporaryCloseShop(status));
  };

  // Handle delete store
  const handleDeleteStore = () => {
    dispatch(deleteUserAccount())
      .unwrap()
      .then(() => {
        // Redirect to login page or display a message
        window.location.href = '/auth/login';
      })
      .catch((err) => {
        console.error('Error deleting store:', err);
      });
  };

  // Save action
  const handleStoreSubmit = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault()
    
    // Create the shop data object with required fields and all current state
    const shopDataObj = {
      id: storeID,
      seller_id: sellerID,
      name: storeName.trim(),
      slug: storeSlug,
      address: storeAddress.trim(),
      contact: storePhone.trim(),
      // Include existing image paths if files aren't being changed
      image: !logoFile && storeImage ? storeImage : undefined,
      banner: !bannerFile && storeBanner ? storeBanner : undefined,
      // Include other state data
      vacation_status: vacationStatus,
      vacation_start_date: vacationStartDate,
      vacation_end_date: vacationEndDate,
      vacation_note: vacationNote,
      temporary_close: temporaryClose,
      rating: storeRating,
      rating_count: storeRatingCount
    };
    
    // Log data before validation to help debug
    //console.log('Shop data before validation:', shopDataObj);
    
    // Validate required fields
    const errors = [];
    if (!shopDataObj.name) errors.push("The name field is required");
    if (!shopDataObj.address) errors.push("The address field is required");
    if (!shopDataObj.contact) errors.push("The contact field is required");
    
    // Display error messages if validation fails
    if (errors.length > 0) {
      errors.forEach(error => toast.error(error));
      return;
    }
    
    const shopData = {
      shopInfo: shopDataObj,
      logoFile,
      bannerFile,
      bottomBannerFile,
      offerBannerFile
    };
    
    // Log final data before submission
    //console.log('Submitting shop data:', shopData);
    
    dispatch(updateShopInfo(shopData))
      .unwrap()
      .then(() => {
        // Refetch shop info to update the state
        dispatch(fetchShopInfo());
        toast.success("Store settings updated successfully");
      })
      .catch((error) => {
        console.error('Error updating shop info:', error);
      });
  }

  // Cancel action
  const handleCancel = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault()
    // Reset fields to shop info if available
    if (shopInfo) {
      setStoreID(shopInfo.id || 0)
      setSellerID(shopInfo.seller_id || 0)
      setStoreName(shopInfo.name || '')
      setStoreSlug(shopInfo.slug || '')
      setStoreAddress(shopInfo.address || '')
      setStorePhone(shopInfo.contact || '')
      setStoreImage(shopInfo.image_full_url?.path || '')
      setStoreBanner(shopInfo.banner_full_url?.path || '')
      setStoreRating(shopInfo.rating || 0)
      setStoreRatingCount(shopInfo.rating_count || 0)
      setVacationStatus(shopInfo.vacation_status || false)
      setVacationStartDate(shopInfo.vacation_start_date || '')
      setVacationEndDate(shopInfo.vacation_end_date || '')
      setVacationNote(shopInfo.vacation_note || '')
      setTemporaryClose(shopInfo.temporary_close || false)
      
      // Reset file states
      setLogoFile(null);
      setBannerFile(null);
      setBottomBannerFile(null);
      setOfferBannerFile(null);
    }
  }

  return (
    <div className="tab-pane fade" id="kt_ecommerce_settings_store" role="tabpanel">
      <form id="kt_ecommerce_settings_general_store" className="form">
        <div className="row mb-7">
          <div className="col-md-9 offset-md-2">
            <h2>Store Settings</h2>
            {isLoading && (
              <div className="d-flex align-items-center mb-5">
                <div className="spinner-border text-primary me-3" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <div>Loading store information...</div>
              </div>
            )}
            
            {formError && (
              <div className="alert alert-danger" role="alert">
                {formError}
              </div>
            )}
            
            {error && (
              <div className="alert alert-danger" role="alert">
                {typeof error === 'string' ? error : 'Failed to load store information'}
              </div>
            )}
          </div>
        </div>

        {/* Store Logo */}
        <div className="row mb-7">
          <div className="col-md-9 offset-md-2">
            <label className="fs-6 fw-semibold mb-2">Store Logo</label>
            <div className="mt-1">
              <div
                className="image-input image-input-outline image-input-placeholder"
                data-kt-image-input="true"
              >
                <div
                  className="image-input-wrapper w-150px h-150px"
                  style={{
                    backgroundImage: `url(${storeImage || 'assets/media/svg/files/blank-image.svg'})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
                <label
                  className="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
                  data-kt-image-input-action="change"
                  data-bs-toggle="tooltip"
                  title="Change logo"
                >
                  <i className="ki-outline ki-pencil fs-7" />
                  <input
                    type="file"
                    name="logo"
                    accept=".png, .jpg, .jpeg"
                    onChange={handleLogoChange}
                  />
                  <input type="hidden" name="logo_remove" />
                </label>
                <span
                  className="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
                  data-kt-image-input-action="cancel"
                  data-bs-toggle="tooltip"
                  title="Cancel logo"
                >
                  <i className="ki-outline ki-cross fs-2" />
                </span>
                <span
                  className="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
                  data-kt-image-input-action="remove"
                  data-bs-toggle="tooltip"
                  title="Remove logo"
                  onClick={() => {
                    setLogoFile(null);
                    setStoreImage('');
                  }}
                >
                  <i className="ki-outline ki-cross fs-2" />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Store Banner */}
        <div className="row mb-7">
          <div className="col-md-9 offset-md-2">
            <label className="fs-6 fw-semibold mb-2">Store Banner</label>
            <div className="mt-1">
              <style>
                {`.image-input-placeholder {
                  background-image: url('assets/media/svg/files/blank-image.svg');
                }
                [data-bs-theme="dark"] .image-input-placeholder {
                  background-image: url('assets/media/svg/files/blank-image-dark.svg');
                }`}
              </style>
              <div
                className="image-input image-input-outline image-input-placeholder w-100"
                data-kt-image-input="true"
              >
                <div
                  className="image-input-wrapper w-100 h-200px"
                  style={{
                    backgroundImage: `url(${storeBanner || 'assets/media/svg/files/blank-image.svg'})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
                <label
                  className="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
                  data-kt-image-input-action="change"
                  data-bs-toggle="tooltip"
                  title="Change banner"
                >
                  <i className="ki-outline ki-pencil fs-7" />
                  <input
                    type="file"
                    name="banner"
                    accept=".png, .jpg, .jpeg"
                    onChange={handleBannerChange}
                  />
                  <input type="hidden" name="banner_remove" />
                </label>
                <span
                  className="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
                  data-kt-image-input-action="cancel"
                  data-bs-toggle="tooltip"
                  title="Cancel banner"
                >
                  <i className="ki-outline ki-cross fs-2" />
                </span>
                <span
                  className="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
                  data-kt-image-input-action="remove"
                  data-bs-toggle="tooltip"
                  title="Remove banner"
                  onClick={() => {
                    setBannerFile(null);
                    setStoreBanner('');
                  }}
                >
                  <i className="ki-outline ki-cross fs-2" />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Store ID & Seller ID */}
        <div className="row mb-7">
          <div className="col-md-9 offset-md-2">
            <div className="row row-cols-1 row-cols-md-2">
              {/* Store ID */}
              <div className="col">
                <div className="fv-row mb-7">
                  <label className="fs-6 fw-semibold mb-2">Store ID</label>
                  <input
                    type="text"
                    className="form-control form-control-solid"
                    value={storeID}
                    readOnly
                    disabled
                  />
                </div>
              </div>
              
              {/* Seller ID */}
              <div className="col">
                <div className="fv-row mb-7">
                  <label className="fs-6 fw-semibold mb-2">Seller ID</label>
                  <input
                    type="text"
                    className="form-control form-control-solid"
                    value={sellerID}
                    readOnly
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Store Name & Store Slug */}
        <div className="row mb-7">
          <div className="col-md-9 offset-md-2">
            <div className="row row-cols-1 row-cols-md-2">
              {/* Store Name */}
              <div className="col">
                <div className="fv-row mb-7">
                  <label className="fs-6 fw-semibold mb-2">
                    <span className="required">Store Name</span>
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-solid"
                    name="store_name"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                  />
                </div>
              </div>
              
              {/* Store Slug */}
              <div className="col">
                <div className="fv-row mb-7">
                  <label className="fs-6 fw-semibold mb-2">Store Slug</label>
                  <input
                    type="text"
                    className="form-control form-control-solid"
                    name="store_slug"
                    value={storeSlug}
                    onChange={(e) => setStoreSlug(e.target.value)}
                  />
                  <div className="form-text">The unique URL-friendly version of the store name.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="row mb-7">
          <div className="col-md-9 offset-md-2">
            <div className="fv-row mb-7">
              <label className="fs-6 fw-semibold mb-2">
                <span className="required">Address</span>
              </label>
              <textarea
                className="form-control form-control-solid"
                name="store_address"
                value={storeAddress}
                onChange={(e) => setStoreAddress(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Phone Number */}
        <div className="row mb-7">
          <div className="col-md-9 offset-md-2">
            <div className="fv-row mb-7">
              <label className="fs-6 fw-semibold mb-2">
                <span className="required">Phone</span>
              </label>
              <input
                type="text"
                className="form-control form-control-solid"
                name="store_phone"
                value={storePhone}
                onChange={(e) => setStorePhone(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Rating */}
        <div className="row mb-7">
          <div className="col-md-9 offset-md-2">
            <div className="fv-row mb-7">
              <label className="fs-6 fw-semibold mb-2">Store Rating</label>
              <div className="d-flex align-items-center">
                <div className="rating me-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <div key={star} className={`rating-label ${star <= storeRating ? 'checked' : ''}`}>
                      <i className="ki-duotone ki-star fs-5"></i>
                    </div>
                  ))}
                </div>
                <span className="text-muted ms-2">({storeRatingCount} reviews)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Vacation Status & Temporary Close */}
        <div className="row mb-7">
          <div className="col-md-9 offset-md-2">
            <div className="row row-cols-1 row-cols-md-2">
              {/* Vacation Status */}
              <div className="col">
                <div className="fv-row mb-7">
                  <label className="fs-6 fw-semibold mb-2">Vacation Status</label>
                  <div className="d-flex align-items-center mt-3">
                    <div className="form-check form-switch form-check-custom form-check-solid me-3">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        checked={vacationStatus}
                        readOnly
                      />
                    </div>
                    <a
                      href="#"
                      className="btn btn-sm btn-light-primary"
                      data-bs-toggle="modal"
                      data-bs-target="#kt_modal_vacation_mode"
                    >
                      Configure
                    </a>
                  </div>
                  {vacationStatus && (
                    <div className="mt-3">
                      <div className="notice d-flex bg-light-warning rounded border-warning border border-dashed p-6">
                        <i className="ki-duotone ki-information fs-2tx text-warning me-4">
                          <span className="path1"></span>
                          <span className="path2"></span>
                          <span className="path3"></span>
                        </i>
                        <div className="d-flex flex-stack flex-grow-1">
                          <div className="fw-semibold">
                            <h4 className="text-gray-900 fw-bold">Vacation Mode Active</h4>
                            <div className="fs-6 text-gray-700">
                              <p className="mb-2"><strong>Dates:</strong> {vacationStartDate} to {vacationEndDate}</p>
                              <p className="mb-0"><strong>Note:</strong> {vacationNote}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Temporary Close */}
              <div className="col">
                <div className="fv-row mb-7">
                  <label className="fs-6 fw-semibold mb-2">Temporary Close</label>
                  <div className="d-flex align-items-center mt-3">
                    <div className="form-check form-switch form-check-custom form-check-solid me-3">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        checked={temporaryClose}
                        readOnly
                      />
                    </div>
                    <a
                      href="#"
                      className="btn btn-sm btn-light-primary"
                      data-bs-toggle="modal"
                      data-bs-target="#kt_modal_temporary_close"
                    >
                      {temporaryClose ? 'Reopen Store' : 'Close Store'}
                    </a>
                  </div>
                  {temporaryClose && (
                    <div className="mt-3">
                      <div className="notice d-flex bg-light-danger rounded border-danger border border-dashed p-6">
                        <i className="ki-duotone ki-information fs-2tx text-danger me-4">
                          <span className="path1"></span>
                          <span className="path2"></span>
                          <span className="path3"></span>
                        </i>
                        <div className="d-flex flex-stack flex-grow-1">
                          <div className="fw-semibold">
                            <h4 className="text-gray-900 fw-bold">Store Temporarily Closed</h4>
                            <div className="fs-6 text-gray-700">
                              Your store is temporarily closed. Customers cannot place orders until you reopen.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Store */}
        <div className="row mb-7">
          <div className="col-md-9 offset-md-2">
            <div className="separator separator-dashed my-10"></div>
            
            <div className="pb-5">
              <h2 className="fw-bold text-danger">Delete Store</h2>
              <div className="text-muted fw-semibold fs-6 mb-5">
                Permanently delete your store and all associated data.
              </div>
              
              <button 
                type="button" 
                className="btn btn-danger" 
                data-bs-toggle="modal" 
                data-bs-target="#kt_modal_delete_store"
              >
                Delete Store
              </button>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="row py-5">
          <div className="col-md-9 offset-md-2">
            <div className="d-flex">
              <a
                href="#"
                className="btn btn-light me-3"
                onClick={handleCancel}
              >
                Cancel
              </a>
              <a
                href="#"
                className="btn btn-primary"
                onClick={handleStoreSubmit}
                {...(isLoading && { disabled: true })}
              >
                {isLoading ? (
                  <span className="indicator-progress">
                    Please wait...
                    <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                  </span>
                ) : (
                  <span className="indicator-label">Save</span>
                )}
              </a>
            </div>
          </div>
        </div>
      </form>

      {/* Modals */}
      <TemporaryCloseModal 
        isTemporaryClosed={temporaryClose}
        onConfirm={handleTemporaryCloseUpdate}
      />
      
      <VacationModeModal 
        isVacationMode={vacationStatus}
        startDate={vacationStartDate}
        endDate={vacationEndDate}
        note={vacationNote}
        onConfirm={handleVacationModeUpdate}
      />

      <DeleteStoreModal 
        onConfirm={handleDeleteStore}
      />
    </div>
  )
}

// ---------------------------------------------------
// 3) LOCALIZATION SETTINGS WIDGET
// ---------------------------------------------------
export function LocalizationSettingsWidget() {
  // Dummy data
  const countryOptions = [
    { value: '', label: 'Select Country' },
    { value: 'AF', label: 'Afghanistan' },
    { value: 'AL', label: 'Albania' },
    { value: 'US', label: 'United States' },
    { value: 'GB', label: 'United Kingdom' },
  ]

  const languageOptions = [
    { value: '', label: 'Select Language' },
    { value: 'id', label: 'Bahasa Indonesia' },
    { value: 'msa', label: 'Bahasa Melayu' },
    { value: 'en', label: 'English' },
  ]

  const currencyOptions = [
    { value: '', label: 'Select Currency' },
    { value: 'USD', label: 'US Dollar' },
    { value: 'EUR', label: 'Euro' },
    { value: 'GBP', label: 'Pound' },
    { value: 'AUD', label: 'Australian Dollar' },
    { value: 'JPY', label: 'Japanese Yen' },
  ]

  const lengthOptions = [
    { value: '', label: 'Select Length Unit' },
    { value: 'cm', label: 'Centimeter' },
    { value: 'mm', label: 'Milimeter' },
    { value: 'in', label: 'Inch' },
  ]

  const weightOptions = [
    { value: '', label: 'Select Weight Unit' },
    { value: 'kg', label: 'Kilogram' },
    { value: 'g', label: 'Gram' },
    { value: 'lb', label: 'Pound' },
    { value: 'oz', label: 'Ounce' },
  ]

  // State with dummy defaults
  const [country, setCountry] = useState(countryOptions[3]) // default: United States
  const [language, setLanguage] = useState(languageOptions[3]) // default: English
  const [currency, setCurrency] = useState(currencyOptions[1]) // default: US Dollar
  const [lengthClass, setLengthClass] = useState(lengthOptions[1]) // default: cm
  const [weightClass, setWeightClass] = useState(weightOptions[1]) // default: kg

  const handleLocalizationSave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
   
  }

  const handleLocalizationCancel = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()//console.log('Localization Settings (Cancel)')
    setCountry(countryOptions[3]) // back to United States
    setLanguage(languageOptions[3]) // English
    setCurrency(currencyOptions[1]) // US Dollar
    setLengthClass(lengthOptions[1]) // Centimeter
    setWeightClass(weightOptions[1]) // Kilogram
  }

  return (
    <div className="tab-pane fade" id="kt_ecommerce_settings_localization" role="tabpanel">
      {/* Removed `onSubmit` from form, relying on anchor buttons. */}
      <form id="kt_ecommerce_settings_general_localization" className="form">
        <div className="row mb-7">
          <div className="col-md-9 offset-md-2">
            <h2>Localization Settings</h2>
          </div>
        </div>

        {/* Country */}
        <div className="row fv-row mb-7">
          <div className="col-md-2 text-md-end">
            <label className="fs-6 fw-semibold form-label mt-3">
              <span className="required">Country</span>
            </label>
          </div>
          <div className="col-md-9">
            <Select
              className="react-select-styled react-select-solid"
              classNamePrefix="react-select"
              name="localization_country"
              options={countryOptions}
              value={country}
              onChange={(opt: SingleValue<SelectOption>) => opt && setCountry(opt)}
            />
          </div>
        </div>

        {/* Language */}
        <div className="row fv-row mb-7">
          <div className="col-md-2 text-md-end">
            <label className="fs-6 fw-semibold form-label mt-3">
              <span className="required">Language</span>
            </label>
          </div>
          <div className="col-md-9">
            <Select
              className="react-select-styled react-select-solid"
              classNamePrefix="react-select"
              name="localization_language"
              options={languageOptions}
              value={language}
              onChange={(opt: SingleValue<SelectOption>) => opt && setLanguage(opt)}
            />
          </div>
        </div>

        {/* Currency */}
        <div className="row fv-row mb-7">
          <div className="col-md-2 text-md-end">
            <label className="fs-6 fw-semibold form-label mt-3">
              <span className="required">Currency</span>
            </label>
          </div>
          <div className="col-md-9">
            <Select
              className="react-select-styled react-select-solid"
              classNamePrefix="react-select"
              name="localization_currency"
              options={currencyOptions}
              value={currency}
              onChange={(opt: SingleValue<SelectOption>) => opt && setCurrency(opt)}
            />
          </div>
        </div>

        {/* Length Class */}
        <div className="row fv-row mb-7">
          <div className="col-md-2 text-md-end">
            <label className="fs-6 fw-semibold form-label mt-3">
              <span>Length Class</span>
            </label>
          </div>
          <div className="col-md-9">
            <Select
              className="react-select-styled react-select-solid"
              classNamePrefix="react-select"
              options={lengthOptions}
              value={lengthClass}
              onChange={(opt: SingleValue<SelectOption>) => opt && setLengthClass(opt)}
            />
          </div>
        </div>

        {/* Weight Class */}
        <div className="row fv-row mb-7">
          <div className="col-md-2 text-md-end">
            <label className="fs-6 fw-semibold form-label mt-3">
              <span>Weight Class</span>
            </label>
          </div>
          <div className="col-md-9">
            <Select
              className="react-select-styled react-select-solid"
              classNamePrefix="react-select"
              options={weightOptions}
              value={weightClass}
              onChange={(opt: SingleValue<SelectOption>) => opt && setWeightClass(opt)}
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="row py-5">
          <div className="col-md-9 offset-md-2">
            <div className="d-flex">
              <a
                href="#"
                className="btn btn-light me-3"
                onClick={handleLocalizationCancel}
              >
                Cancel
              </a>
              <a
                href="#"
                className="btn btn-primary"
                onClick={handleLocalizationSave}
              >
                <span className="indicator-label">Save</span>
              </a>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
