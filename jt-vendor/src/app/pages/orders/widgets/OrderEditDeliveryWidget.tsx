import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/app/redux/store';
import { 
  setBillingAddress, 
  setShippingAddress, 
  setSameAsBilling as setSameAsShipping
} from '@/app/redux/order/orderCreation.slice';
import { BillingAddressData as Address } from '@/app/redux/models';

// Country options
const countries = [
  { value: 'AU', label: 'Australia' },
  { value: 'US', label: 'United States' },
  { value: 'KH', label: 'Cambodia' },
];

// Define fields that are required
const requiredFields = [
  'contact_person_name',
  'address',
  'city',
  'zip',
  'phone',
  'email',
  'country'
];

// Local state for form values
interface LocalAddress {
  contact_person_name: string;
  address: string;
  city: string;
  zip: string;
  phone: string;
  email: string;
  country: string;
  latitude: string;
  longitude: string;
}

// Helper function to convert from Address (BillingAddressData) to LocalAddress
const convertToLocalAddress = (address: Address | null): LocalAddress => {
  if (!address) {
    return {
      contact_person_name: '',
      address: '',
      city: '',
      zip: '',
      phone: '',
      email: '',
      country: 'AU',
      latitude: '',
      longitude: ''
    };
  }
  
  return {
    contact_person_name: address.contact_person_name || '',
    address: address.address || '',
    city: address.city || '',
    zip: address.zip || '',
    phone: address.phone || '',
    email: address.email || '',
    country: address.country || 'AU',
    latitude: address.latitude || '',
    longitude: address.longitude || ''
  };
};

const OrderEditDeliveryWidget: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  // Get state from Redux
  const {
    billingAddress,
    shippingAddress,
    sameAsBilling: sameAsShipping,
    selectedCustomer,
    isGuestCheckout
  } = useSelector((state: RootState) => state.orderCreation);
  
  // Local state for validation
  const [billingErrors, setBillingErrors] = useState<Record<string, string>>({});
  const [shippingErrors, setShippingErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState({
    billing: false,
    shipping: false
  });
  
  // Local state for form values
  const [localBillingAddress, setLocalBillingAddress] = useState<LocalAddress>({
    contact_person_name: '',
    address: '',
    city: '',
    zip: '',
    phone: '',
    email: '',
    country: 'AU',
    latitude: '',
    longitude: ''
  });
  
  const [localShippingAddress, setLocalShippingAddress] = useState<LocalAddress>({
    contact_person_name: '',
    address: '',
    city: '',
    zip: '',
    phone: '',
    email: '',
    country: 'AU',
    latitude: '',
    longitude: ''
  });
  
  // Initialize local state from Redux
  useEffect(() => {
    if (billingAddress) {
      setLocalBillingAddress(convertToLocalAddress(billingAddress));
    } else if (selectedCustomer) {
      // Pre-fill with customer data if available
      setLocalBillingAddress(prev => ({
        ...prev,
        contact_person_name: selectedCustomer.f_name ? 
          `${selectedCustomer.f_name || ''} ${selectedCustomer.l_name || ''}`.trim() : '',
        phone: selectedCustomer.phone || '',
        email: selectedCustomer.email || ''
      }));
    }
  }, [billingAddress, selectedCustomer]);
  
  useEffect(() => {
    if (shippingAddress) {
      setLocalShippingAddress(convertToLocalAddress(shippingAddress));
    } else if (selectedCustomer) {
      // Pre-fill with customer data if available
      setLocalShippingAddress(prev => ({
        ...prev,
        contact_person_name: selectedCustomer.f_name ? 
          `${selectedCustomer.f_name || ''} ${selectedCustomer.l_name || ''}`.trim() : '',
        phone: selectedCustomer.phone || '',
        email: selectedCustomer.email || ''
      }));
    }
  }, [shippingAddress, selectedCustomer]);
  
  // Validate fields
  const validateAddress = (address: any, type: 'billing' | 'shipping') => {
    const errors: Record<string, string> = {};
    
    requiredFields.forEach(field => {
      if (!address[field]) {
        errors[field] = `${field.replace(/_/g, ' ')} is required`;
      }
    });
    
    // Email validation
    if (address.email && !/\S+@\S+\.\S+/.test(address.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    // Phone validation
    if (address.phone && !/^[+]?[\d\s()-]{7,}$/.test(address.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }
    
    if (type === 'billing') {
      setBillingErrors(errors);
    } else {
      setShippingErrors(errors);
    }
    
    return Object.keys(errors).length === 0;
  };
  
  // Handle billing field change
  const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setLocalBillingAddress(prev => {
      const updated = { ...prev, [name]: value };
      
      // Live validation if form has been touched
      if (touched.billing) {
        validateAddress(updated, 'billing');
      }
      
      return updated;
    });
  };
  
  // Handle shipping field change
  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setLocalShippingAddress(prev => {
      const updated = { ...prev, [name]: value };
      
      // Live validation if form has been touched
      if (touched.shipping) {
        validateAddress(updated, 'shipping');
      }
      
      // If billing is same as shipping, update billing too
      if (sameAsShipping) {
        setLocalBillingAddress(prevBilling => ({
          ...prevBilling,
          [name]: value
        }));
      }
      
      return updated;
    });
  };
  
  // Handle same as shipping toggle
  const handleSameAsShipping = () => {
    dispatch(setSameAsShipping(!sameAsShipping));
    
    if (!sameAsShipping) {
      setLocalBillingAddress(localShippingAddress);
    }
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark forms as touched for validation
    setTouched({
      shipping: true,
      billing: !sameAsShipping
    });
    
    // Validate both forms
    const shippingValid = validateAddress(localShippingAddress, 'shipping');
    const billingValid = sameAsShipping || validateAddress(localBillingAddress, 'billing');
    
    // If valid, update Redux state
    if (shippingValid) {
      // Convert localShippingAddress to Address type
      const shippingAddressData: Address = {
        contact_person_name: localShippingAddress.contact_person_name,
        address: localShippingAddress.address,
        city: localShippingAddress.city,
        zip: localShippingAddress.zip,
        phone: localShippingAddress.phone,
        email: localShippingAddress.email,
        country: localShippingAddress.country,
        latitude: localShippingAddress.latitude,
        longitude: localShippingAddress.longitude
      };
      
      dispatch(setShippingAddress(shippingAddressData));
    }
    
    if (sameAsShipping) {
      // Use shipping address for billing too
      dispatch(setBillingAddress({
        contact_person_name: localShippingAddress.contact_person_name,
        address: localShippingAddress.address,
        city: localShippingAddress.city,
        zip: localShippingAddress.zip,
        phone: localShippingAddress.phone,
        email: localShippingAddress.email,
        country: localShippingAddress.country,
        latitude: localShippingAddress.latitude,
        longitude: localShippingAddress.longitude
      }));
    } else if (billingValid) {
      // Convert localBillingAddress to Address type
      const billingAddressData: Address = {
        contact_person_name: localBillingAddress.contact_person_name,
        address: localBillingAddress.address,
        city: localBillingAddress.city,
        zip: localBillingAddress.zip,
        phone: localBillingAddress.phone,
        email: localBillingAddress.email,
        country: localBillingAddress.country,
        latitude: localBillingAddress.latitude,
        longitude: localBillingAddress.longitude
      };
      
      dispatch(setBillingAddress(billingAddressData));
    }
  };
  
  // Show errors for a field
  const getFieldError = (field: string, type: 'billing' | 'shipping') => {
    const errors = type === 'billing' ? billingErrors : shippingErrors;
    
    if (errors[field]) {
      return (
        <div className="fv-plugins-message-container invalid-feedback">
          <div>{errors[field]}</div>
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <div className="card card-flush py-4">
      <div className="card-header">
        <div className="card-title">
          <h2>Delivery Details</h2>
        </div>
      </div>
      <div className="card-body pt-0">
        <form onSubmit={handleSubmit}>
          <div className="d-flex flex-column gap-5 gap-md-7">
            {/* Shipping Address */}
            <div className="fs-3 fw-bold mb-n2">Shipping Address</div>
            <div className="d-flex flex-column flex-md-row gap-5">
              <div className="flex-row-fluid">
                <label className="required form-label">Contact Person</label>
                <input
                  className={`form-control ${shippingErrors.contact_person_name ? 'is-invalid' : ''}`}
                  name="contact_person_name"
                  placeholder="Contact Person Name"
                  value={localShippingAddress.contact_person_name}
                  onChange={handleShippingChange}
                  onBlur={() => {
                    setTouched(prev => ({ ...prev, shipping: true }));
                    validateAddress(localShippingAddress, 'shipping');
                  }}
                />
                {getFieldError('contact_person_name', 'shipping')}
              </div>
              <div className="flex-row-fluid">
                <label className="required form-label">Phone</label>
                <input
                  className={`form-control ${shippingErrors.phone ? 'is-invalid' : ''}`}
                  name="phone"
                  placeholder="Phone Number"
                  value={localShippingAddress.phone}
                  onChange={handleShippingChange}
                  onBlur={() => {
                    setTouched(prev => ({ ...prev, shipping: true }));
                    validateAddress(localShippingAddress, 'shipping');
                  }}
                />
                {getFieldError('phone', 'shipping')}
              </div>
            </div>
            <div className="d-flex flex-column flex-md-row gap-5">
              <div className="flex-row-fluid">
                <label className="required form-label">Email</label>
                <input
                  className={`form-control ${shippingErrors.email ? 'is-invalid' : ''}`}
                  name="email"
                  placeholder="Email"
                  type="email"
                  value={localShippingAddress.email}
                  onChange={handleShippingChange}
                  onBlur={() => {
                    setTouched(prev => ({ ...prev, shipping: true }));
                    validateAddress(localShippingAddress, 'shipping');
                  }}
                />
                {getFieldError('email', 'shipping')}
              </div>
            </div>
            <div className="d-flex flex-column flex-md-row gap-5">
              <div className="flex-row-fluid">
                <label className="required form-label">Address Line 1</label>
                <input
                  className={`form-control ${shippingErrors.address ? 'is-invalid' : ''}`}
                  name="address"
                  placeholder="Address Line 1"
                  value={localShippingAddress.address}
                  onChange={handleShippingChange}
                  onBlur={() => {
                    setTouched(prev => ({ ...prev, shipping: true }));
                    validateAddress(localShippingAddress, 'shipping');
                  }}
                />
                {getFieldError('address', 'shipping')}
              </div>
            </div>
            <div className="d-flex flex-column flex-md-row gap-5">
              <div className="flex-row-fluid">
                <label className="form-label">City</label>
                <input
                  className={`form-control ${shippingErrors.city ? 'is-invalid' : ''}`}
                  name="city"
                  placeholder="City"
                  value={localShippingAddress.city}
                  onChange={handleShippingChange}
                  onBlur={() => {
                    setTouched(prev => ({ ...prev, shipping: true }));
                    validateAddress(localShippingAddress, 'shipping');
                  }}
                />
                {getFieldError('city', 'shipping')}
              </div>
              <div className="flex-row-fluid">
                <label className="required form-label">Postcode</label>
                <input
                  className={`form-control ${shippingErrors.zip ? 'is-invalid' : ''}`}
                  name="zip"
                  placeholder="Postcode"
                  value={localShippingAddress.zip}
                  onChange={handleShippingChange}
                  onBlur={() => {
                    setTouched(prev => ({ ...prev, shipping: true }));
                    validateAddress(localShippingAddress, 'shipping');
                  }}
                />
                {getFieldError('zip', 'shipping')}
              </div>
            </div>
            <div className="fv-row">
              <label className="required form-label">Country</label>
              <select
                className={`form-select ${shippingErrors.country ? 'is-invalid' : ''}`}
                name="country"
                value={localShippingAddress.country}
                onChange={handleShippingChange}
                onBlur={() => {
                  setTouched(prev => ({ ...prev, shipping: true }));
                  validateAddress(localShippingAddress, 'shipping');
                }}
              >
                {countries.map((country) => (
                  <option key={country.value} value={country.value}>
                    {country.label}
                  </option>
                ))}
              </select>
              {getFieldError('country', 'shipping')}
            </div>
            <div className="form-check form-check-custom form-check-solid">
              <input
                className="form-check-input"
                type="checkbox"
                checked={sameAsShipping}
                onChange={handleSameAsShipping}
                id="same_as_shipping"
              />
              <label className="form-check-label" htmlFor="same_as_shipping">
                Billing address is the same as shipping address
              </label>
            </div>
          </div>

          {!sameAsShipping && (
            <div className="d-flex flex-column gap-5 gap-md-7 mt-10">
              <div className="fs-3 fw-bold mb-n2">Billing Address</div>
              <div className="d-flex flex-column flex-md-row gap-5">
                <div className="flex-row-fluid">
                  <label className="required form-label">Contact Person</label>
                  <input
                    className={`form-control ${billingErrors.contact_person_name ? 'is-invalid' : ''}`}
                    name="contact_person_name"
                    placeholder="Contact Person Name"
                    value={localBillingAddress.contact_person_name}
                    onChange={handleBillingChange}
                    onBlur={() => {
                      setTouched(prev => ({ ...prev, billing: true }));
                      validateAddress(localBillingAddress, 'billing');
                    }}
                  />
                  {getFieldError('contact_person_name', 'billing')}
                </div>
                <div className="flex-row-fluid">
                  <label className="required form-label">Phone</label>
                  <input
                    className={`form-control ${billingErrors.phone ? 'is-invalid' : ''}`}
                    name="phone"
                    placeholder="Phone Number"
                    value={localBillingAddress.phone}
                    onChange={handleBillingChange}
                    onBlur={() => {
                      setTouched(prev => ({ ...prev, billing: true }));
                      validateAddress(localBillingAddress, 'billing');
                    }}
                  />
                  {getFieldError('phone', 'billing')}
                </div>
              </div>
              <div className="d-flex flex-column flex-md-row gap-5">
                <div className="flex-row-fluid">
                  <label className="required form-label">Email</label>
                  <input
                    className={`form-control ${billingErrors.email ? 'is-invalid' : ''}`}
                    name="email"
                    placeholder="Email"
                    type="email"
                    value={localBillingAddress.email}
                    onChange={handleBillingChange}
                    onBlur={() => {
                      setTouched(prev => ({ ...prev, billing: true }));
                      validateAddress(localBillingAddress, 'billing');
                    }}
                  />
                  {getFieldError('email', 'billing')}
                </div>
              </div>
              <div className="d-flex flex-column flex-md-row gap-5">
                <div className="flex-row-fluid">
                  <label className="required form-label">Address Line 1</label>
                  <input
                    className={`form-control ${billingErrors.address ? 'is-invalid' : ''}`}
                    name="address"
                    placeholder="Address Line 1"
                    value={localBillingAddress.address}
                    onChange={handleBillingChange}
                    onBlur={() => {
                      setTouched(prev => ({ ...prev, billing: true }));
                      validateAddress(localBillingAddress, 'billing');
                    }}
                  />
                  {getFieldError('address', 'billing')}
                </div>
              </div>
              <div className="d-flex flex-column flex-md-row gap-5">
                <div className="flex-row-fluid">
                  <label className="form-label">City</label>
                  <input
                    className={`form-control ${billingErrors.city ? 'is-invalid' : ''}`}
                    name="city"
                    placeholder="City"
                    value={localBillingAddress.city}
                    onChange={handleBillingChange}
                    onBlur={() => {
                      setTouched(prev => ({ ...prev, billing: true }));
                      validateAddress(localBillingAddress, 'billing');
                    }}
                  />
                  {getFieldError('city', 'billing')}
                </div>
                <div className="flex-row-fluid">
                  <label className="required form-label">Postcode</label>
                  <input
                    className={`form-control ${billingErrors.zip ? 'is-invalid' : ''}`}
                    name="zip"
                    placeholder="Postcode"
                    value={localBillingAddress.zip}
                    onChange={handleBillingChange}
                    onBlur={() => {
                      setTouched(prev => ({ ...prev, billing: true }));
                      validateAddress(localBillingAddress, 'billing');
                    }}
                  />
                  {getFieldError('zip', 'billing')}
                </div>
              </div>
              <div className="fv-row">
                <label className="required form-label">Country</label>
                <select
                  className={`form-select ${billingErrors.country ? 'is-invalid' : ''}`}
                  name="country"
                  value={localBillingAddress.country}
                  onChange={handleBillingChange}
                  onBlur={() => {
                    setTouched(prev => ({ ...prev, billing: true }));
                    validateAddress(localBillingAddress, 'billing');
                  }}
                >
                  {countries.map((country) => (
                    <option key={country.value} value={country.value}>
                      {country.label}
                    </option>
                  ))}
                </select>
                {getFieldError('country', 'billing')}
              </div>
            </div>
          )}

        </form>
      </div>
    </div>
  );
};

export default OrderEditDeliveryWidget;
  