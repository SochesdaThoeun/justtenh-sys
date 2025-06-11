import React, { useState, useRef, FormEvent } from 'react';
import Select from 'react-select';
import UpdateConfirmationModal from './modals/UpdateConfirmationModal'; // Reusable modal for confirmation

// Example JSON data for countries
const countryOptions = [
  { value: 'AU', label: 'Australia' },
  { value: 'US', label: 'United States' },
  { value: 'GB', label: 'United Kingdom' },
  // ...
];

interface ProfileData {
  avatar: string | null;
  name: string;
  generalEmail: string;
  billingEmail: string;
}

interface AddressData {
  id: number;
  name?: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  isDefault?: boolean;
  fullName?: string;
}

/* ----------------------------------------------------------------
   ProfileForm
----------------------------------------------------------------- */
const ProfileForm: React.FC<{
  profile: ProfileData;
  onUpdateProfile: (data: Partial<ProfileData>) => void;
}> = ({ profile, onUpdateProfile }) => {
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const fileURL = URL.createObjectURL(e.target.files[0]);
      onUpdateProfile({ avatar: fileURL });
    }
  };

  const handleRemoveAvatar = () => {
    onUpdateProfile({ avatar: null });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //console.log('Profile data:', profile);
    // Do something, e.g. API call
  };

  return (
    <div className="card pt-4 mb-6 mb-xl-9">
      <div className="card-header border-0">
        <div className="card-title">
          <h2>Profile</h2>
        </div>
      </div>
      <div className="card-body pt-0 pb-5">
        <form className="form" onSubmit={handleSubmit} id="kt_ecommerce_customer_profile">
          <div className="mb-7">
            <label className="fs-6 fw-semibold mb-2">
              <span>Update Avatar</span>
              <span
                className="ms-1"
                data-bs-toggle="tooltip"
                title="Allowed file types: png, jpg, jpeg."
              >
                <i className="ki-outline ki-information fs-7" />
              </span>
            </label>
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
                className="image-input image-input-outline image-input-placeholder"
                data-kt-image-input="true"
              >
                <div
                  className="image-input-wrapper w-125px h-125px"
                  style={{
                    backgroundImage: profile.avatar
                      ? `url(${profile.avatar})`
                      : `url(assets/media/avatars/300-1.jpg)`,
                  }}
                />
                <label
                  className="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
                  data-kt-image-input-action="change"
                  data-bs-toggle="tooltip"
                  title="Change avatar"
                >
                  <i className="ki-outline ki-pencil fs-7" />
                  <input
                    type="file"
                    name="avatar"
                    accept=".png, .jpg, .jpeg"
                    onChange={handleAvatarChange}
                  />
                  <input type="hidden" name="avatar_remove" />
                </label>
                <span
                  className="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
                  data-kt-image-input-action="cancel"
                  data-bs-toggle="tooltip"
                  title="Cancel avatar"
                >
                  <i className="ki-outline ki-cross fs-2" />
                </span>
                <span
                  className="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
                  data-kt-image-input-action="remove"
                  data-bs-toggle="tooltip"
                  title="Remove avatar"
                  onClick={handleRemoveAvatar}
                  style={{ cursor: 'pointer' }}
                >
                  <i className="ki-outline ki-cross fs-2" />
                </span>
              </div>
            </div>
          </div>

          {/* Name */}
          <div className="fv-row mb-7">
            <label className="fs-6 fw-semibold mb-2 required">Name</label>
            <input
              type="text"
              className="form-control form-control-solid"
              name="name"
              value={profile.name}
              onChange={(e) => onUpdateProfile({ name: e.target.value })}
            />
          </div>

          {/* Emails */}
          <div className="row row-cols-1 row-cols-md-2">
            <div className="col">
              <div className="fv-row mb-7">
                <label className="fs-6 fw-semibold mb-2">
                  <span className="required">General Email</span>
                  <span className="ms-1" data-bs-toggle="tooltip" title="Email address must be active">
                    <i className="ki-outline ki-information fs-7" />
                  </span>
                </label>
                <input
                  type="email"
                  className="form-control form-control-solid"
                  name="gen_email"
                  value={profile.generalEmail}
                  onChange={(e) => onUpdateProfile({ generalEmail: e.target.value })}
                />
              </div>
            </div>
            <div className="col">
              <div className="fv-row mb-7">
                <label className="fs-6 fw-semibold mb-2">
                  <span>Billing Email</span>
                  <span
                    className="ms-1"
                    data-bs-toggle="tooltip"
                    title="Email address must be active"
                  >
                    <i className="ki-outline ki-information fs-7" />
                  </span>
                </label>
                <input
                  type="email"
                  className="form-control form-control-solid"
                  name="bill_email"
                  value={profile.billingEmail}
                  onChange={(e) => onUpdateProfile({ billingEmail: e.target.value })}
                />
              </div>
            </div>
          </div>

          

          {/* Submit */}
          <div className="d-flex justify-content-end">
            <button
              type="submit"
              id="kt_ecommerce_customer_profile_submit"
              className="btn btn-light-primary"
            >
              <span className="indicator-label">Save</span>
              <span className="indicator-progress">
                Please wait... <span className="spinner-border spinner-border-sm align-middle ms-2" />
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ----------------------------------------------------------------
   UpdateAddressModal
----------------------------------------------------------------- */
const UpdateAddressModal: React.FC<{
  address: AddressData | null;
  setAddress: (addr: AddressData | null) => void;
  onSubmit: (data: AddressData) => void;
}> = ({ address, setAddress, onSubmit }) => {
  if (!address) return null; // If no address, don't render the modal

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(address);
  };

  const handleChange = (field: keyof AddressData, value: string) => {
    if (!address) return;
    setAddress({ ...address, [field]: value });
  };

  return (
    <div className="modal fade" id="kt_modal_update_address" tabIndex={-1} aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered mw-650px">
        <div className="modal-content">
          <form className="form" onSubmit={handleFormSubmit}>
            <div className="modal-header" id="kt_modal_update_address_header">
              <h2 className="fw-bold">Update Address</h2>
              <button
                type="button"
                className="btn btn-icon btn-sm btn-active-icon-primary"
                data-bs-dismiss="modal"
              >
                <i className="ki-outline ki-cross fs-1" />
              </button>
            </div>
            <div className="modal-body py-10 px-lg-17">
              <div
                className="d-flex flex-column scroll-y me-n7 pe-7"
                data-kt-scroll="true"
                data-kt-scroll-activate="{default: false, lg: true}"
                data-kt-scroll-max-height="auto"
                data-kt-scroll-offset="300px"
              >
                <a
                  className="fw-bold fs-3 rotate collapsible collapsed mb-7"
                  data-bs-toggle="collapse"
                  href="#kt_modal_update_address_billing_info"
                  role="button"
                  aria-expanded="false"
                  aria-controls="kt_modal_update_address_billing_info"
                >
                  Shipping Information 
                  <span className="ms-2 rotate-180">
                    <i className="ki-outline ki-down fs-3" />
                  </span>
                </a>
                <div id="kt_modal_update_address_billing_info" className="collapse show">
                  {/* Address1 */}
                  <div className="d-flex flex-column mb-7 fv-row">
                    <label className="fs-6 fw-semibold mb-2 required">Address Line 1</label>
                    <input
                      className="form-control form-control-solid"
                      placeholder=""
                      value={address.address1}
                      onChange={(e) => handleChange('address1', e.target.value)}
                    />
                  </div>
                  {/* Address2 */}
                  <div className="d-flex flex-column mb-7 fv-row">
                    <label className="fs-6 fw-semibold mb-2">Address Line 2</label>
                    <input
                      className="form-control form-control-solid"
                      placeholder=""
                      value={address.address2}
                      onChange={(e) => handleChange('address2', e.target.value)}
                    />
                  </div>
                  {/* City */}
                  <div className="d-flex flex-column mb-7 fv-row">
                    <label className="fs-6 fw-semibold mb-2 required">City / Town</label>
                    <input
                      className="form-control form-control-solid"
                      placeholder=""
                      value={address.city}
                      onChange={(e) => handleChange('city', e.target.value)}
                    />
                  </div>
                  {/* State and Postcode */}
                  <div className="row g-9 mb-7">
                    <div className="col-md-6 fv-row">
                      <label className="fs-6 fw-semibold mb-2 required">State / Province</label>
                      <input
                        className="form-control form-control-solid"
                        placeholder=""
                        value={address.state}
                        onChange={(e) => handleChange('state', e.target.value)}
                      />
                    </div>
                    <div className="col-md-6 fv-row">
                      <label className="fs-6 fw-semibold mb-2 required">Post Code</label>
                      <input
                        className="form-control form-control-solid"
                        placeholder=""
                        value={address.postcode}
                        onChange={(e) => handleChange('postcode', e.target.value)}
                      />
                    </div>
                  </div>
                  {/* Country */}
                  <div className="d-flex flex-column mb-7 fv-row">
                    <label className="fs-6 fw-semibold mb-2">
                      <span className="required">Country</span>
                    </label>
                    <Select
                      className="react-select-styled react-select-solid"
                      options={countryOptions}
                      value={countryOptions.find((c) => c.value === address.country) || null}
                      onChange={(val) => handleChange('country', val?.value || '')}
                      placeholder="Select a Country..."
                    />
                  </div>
                  <div className="fv-row mb-7">
                    <div className="d-flex flex-stack">
                      <div className="me-5">
                        <label className="fs-6 fw-semibold">Use as a billing address?</label>
                        <div className="fs-7 fw-semibold text-muted">If you need more info...</div>
                      </div>
                      <label className="form-check form-switch form-check-custom form-check-solid">
                        <input className="form-check-input" type="checkbox" defaultChecked />
                        <span className="form-check-label fw-semibold text-muted">Yes</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer flex-center">
              <button
                type="reset"
                id="kt_modal_update_address_cancel"
                className="btn btn-light me-3"
                data-bs-dismiss="modal"
              >
                Discard
              </button>
              <button
                type="submit"
                id="kt_modal_update_address_submit"
                className="btn btn-primary"
              >
                <span className="indicator-label">Submit</span>
                <span className="indicator-progress">
                  Please wait...{' '}
                  <span className="spinner-border spinner-border-sm align-middle ms-2" />
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

/* ----------------------------------------------------------------
   AddAddressModal
----------------------------------------------------------------- */
const AddAddressModal: React.FC<{
  onSubmit: (data: AddressData) => void;
}> = ({ onSubmit }) => {
  const [newAddress, setNewAddress] = useState<AddressData>({
    id: Date.now(),
    name: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    postcode: '',
    country: '',
    isDefault: false,
    fullName: 'Max Smith',
  });

  const handleChange = (field: keyof AddressData, value: string) => {
    setNewAddress({ ...newAddress, [field]: value });
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(newAddress);
    // Optionally, reset
    setNewAddress({
      id: Date.now(),
      name: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      postcode: '',
      country: '',
      isDefault: false,
      fullName: 'Max Smith',
    });
  };

  return (
    <div className="modal fade" id="kt_modal_add_address" tabIndex={-1} aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered mw-650px">
        <div className="modal-content">
          <form className="form" onSubmit={handleFormSubmit}>
            <div className="modal-header" id="kt_modal_add_address_header">
              <h2 className="fw-bold">Add New Address</h2>
              <button
                type="button"
                className="btn btn-icon btn-sm btn-active-icon-primary"
                data-bs-dismiss="modal"
              >
                <i className="ki-outline ki-cross fs-1" />
              </button>
            </div>
            <div className="modal-body py-10 px-lg-17">
              <div
                className="d-flex flex-column scroll-y me-n7 pe-7"
                data-kt-scroll="true"
                data-kt-scroll-activate="{default: false, lg: true}"
                data-kt-scroll-max-height="auto"
                data-kt-scroll-offset="300px"
              >
                <a
                  className="fw-bold fs-3 rotate collapsible collapsed mb-7"
                  data-bs-toggle="collapse"
                  href="#kt_modal_add_address_billing_info"
                  role="button"
                  aria-expanded="false"
                  aria-controls="kt_modal_add_address_billing_info"
                >
                  Shipping Information 
                  <span className="ms-2 rotate-180">
                    <i className="ki-outline ki-down fs-3" />
                  </span>
                </a>
                <div id="kt_modal_add_address_billing_info" className="collapse show">
                  {/* Address Name */}
                  <div className="d-flex flex-column mb-7 fv-row">
                    <label className="fs-6 fw-semibold mb-2 required">Address Name</label>
                    <input
                      className="form-control form-control-solid"
                      placeholder=""
                      value={newAddress.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                    />
                  </div>
                  {/* Address1 */}
                  <div className="d-flex flex-column mb-7 fv-row">
                    <label className="fs-6 fw-semibold mb-2 required">Address Line 1</label>
                    <input
                      className="form-control form-control-solid"
                      placeholder=""
                      value={newAddress.address1}
                      onChange={(e) => handleChange('address1', e.target.value)}
                    />
                  </div>
                  {/* Address2 */}
                  <div className="d-flex flex-column mb-7 fv-row">
                    <label className="fs-6 fw-semibold mb-2">Address Line 2</label>
                    <input
                      className="form-control form-control-solid"
                      placeholder=""
                      value={newAddress.address2}
                      onChange={(e) => handleChange('address2', e.target.value)}
                    />
                  </div>
                  {/* City */}
                  <div className="d-flex flex-column mb-7 fv-row">
                    <label className="fs-6 fw-semibold mb-2 required">City / Town</label>
                    <input
                      className="form-control form-control-solid"
                      placeholder=""
                      value={newAddress.city}
                      onChange={(e) => handleChange('city', e.target.value)}
                    />
                  </div>
                  {/* State/Postcode */}
                  <div className="row g-9 mb-7">
                    <div className="col-md-6 fv-row">
                      <label className="fs-6 fw-semibold mb-2 required">State / Province</label>
                      <input
                        className="form-control form-control-solid"
                        placeholder=""
                        value={newAddress.state}
                        onChange={(e) => handleChange('state', e.target.value)}
                      />
                    </div>
                    <div className="col-md-6 fv-row">
                      <label className="fs-6 fw-semibold mb-2 required">Post Code</label>
                      <input
                        className="form-control form-control-solid"
                        placeholder=""
                        value={newAddress.postcode}
                        onChange={(e) => handleChange('postcode', e.target.value)}
                      />
                    </div>
                  </div>
                  {/* Country */}
                  <div className="d-flex flex-column mb-7 fv-row">
                    <label className="fs-6 fw-semibold mb-2">
                      <span className="required">Country</span>
                    </label>
                    <Select
                      className="react-select-styled react-select-solid"
                      options={countryOptions}
                      value={countryOptions.find((c) => c.value === newAddress.country) || null}
                      onChange={(val) => handleChange('country', val?.value || '')}
                      placeholder="Select a Country..."
                    />
                  </div>
                  <div className="fv-row mb-7">
                    <div className="d-flex flex-stack">
                      <div className="me-5">
                        <label className="fs-6 fw-semibold">Use as a billing address?</label>
                        <div className="fs-7 fw-semibold text-muted">If you need more info...</div>
                      </div>
                      <label className="form-check form-switch form-check-custom form-check-solid">
                        <input className="form-check-input" type="checkbox" defaultChecked />
                        <span className="form-check-label fw-semibold text-muted">Yes</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer flex-center">
              <button
                type="reset"
                id="kt_modal_add_address_cancel"
                className="btn btn-light me-3"
                data-bs-dismiss="modal"
              >
                Discard
              </button>
              <button
                type="submit"
                id="kt_modal_add_address_submit"
                className="btn btn-primary"
              >
                <span className="indicator-label">Submit</span>
                <span className="indicator-progress">
                  Please wait...
                  <span className="spinner-border spinner-border-sm align-middle ms-2" />
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

/* ----------------------------------------------------------------
   AddressBook
----------------------------------------------------------------- */
const AddressBook: React.FC<{
  addresses: AddressData[];
  setAddresses: React.Dispatch<React.SetStateAction<AddressData[]>>;
  onEditAddress: (addr: AddressData) => void;
  onDeleteAddress: (id: number) => void; // <-- NEW
}> = ({ addresses, setAddresses, onEditAddress, onDeleteAddress }) => {
  const handleSetDefault = (id: number) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
  };

  return (
    <div className="card pt-4 mb-6 mb-xl-9">
      <div className="card-header border-0">
        <div className="card-title">
          <h2>Address Book</h2>
        </div>
        <div className="card-toolbar">
          <button
            type="button"
            className="btn btn-sm btn-flex btn-light-primary"
            data-bs-toggle="modal"
            data-bs-target="#kt_modal_add_address"
          >
            <i className="ki-outline ki-plus-square fs-3" />
            Add new address
          </button>
        </div>
      </div>
      <div className="card-body pt-0 pb-5">
        <div className="accordion accordion-icon-toggle" id="kt_ecommerce_customer_addresses_accordion">
          {addresses.map((addr) => (
            <div className="py-0" key={addr.id}>
              <div className="py-3 d-flex flex-stack flex-wrap">
                <a
                  className="accordion-header d-flex align-items-center collapsible collapsed rotate"
                  data-bs-toggle="collapse"
                  href={`#kt_ecommerce_customer_addresses_${addr.id}`}
                  role="button"
                  aria-expanded="false"
                  aria-controls={`kt_ecommerce_customer_addresses_${addr.id}`}
                >
                  <div className="accordion-icon me-3">
                    <i className="ki-outline ki-right fs-4" />
                  </div>
                  <div className="me-3">
                    <div className="d-flex align-items-center">
                      <div className="fs-4 fw-bold">{addr.name || 'Unnamed'}</div>
                      {addr.isDefault && (
                        <div className="badge badge-light-primary ms-5">Default Address</div>
                      )}
                    </div>
                    <div className="text-muted">{addr.address1}</div>
                  </div>
                </a>

                <div className="d-flex my-3 ms-9">
                  {/* Edit */}
                  <a
                    type="button"
                    className="btn btn-icon btn-active-light-primary w-30px h-30px me-3"
                    data-bs-toggle="modal"
                    data-bs-target="#kt_modal_update_address"
                    onClick={() => onEditAddress(addr)}
                  >
                    <span data-bs-toggle="tooltip" data-bs-trigger="hover" title="Edit">
                      <i className="ki-solid ki-pencil fs-3" />
                    </span>
                  </a>

                  {/* Delete */}
                  <a
                    type="button"
                    className="btn btn-icon btn-active-light-primary w-30px h-30px me-3"
                    data-bs-toggle="tooltip"
                    title="Delete"
                    onClick={() => onDeleteAddress(addr.id)} // <-- CALLS PARENT
                  >
                    <i className="ki-solid ki-trash fs-3" />
                  </a>

                  {/* More (Set as default) */}
                  <a
                    className="btn btn-icon btn-active-light-primary w-30px h-30px"
                    data-bs-toggle="tooltip"
                    data-kt-menu-trigger='click'
                    data-kt-menu-placement='bottom-end'
                  >
                    <i className="ki-solid ki-setting-3 fs-3" />
                  </a>
                  <div
                    className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-semibold w-200px py-3"
                    data-kt-menu="true"
                    
                  >
                    <div className="menu-item px-3">
                      <a
                        className="menu-link px-3"
                        onClick={() => handleSetDefault(addr.id)}
                      >
                        Set as default address
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Collapsible Body */}
              <div
                id={`kt_ecommerce_customer_addresses_${addr.id}`}
                className="collapse fs-6 ps-9"
                data-bs-parent="#kt_ecommerce_customer_addresses_accordion"
              >
                <div className="d-flex flex-column pb-5">
                  <div className="fw-bold text-gray-600">{addr.fullName || 'Full Name'}</div>
                  <div className="text-muted">
                    {addr.address1}
                    {addr.address2 ? <><br />{addr.address2}</> : null}
                    <br />
                    {addr.city}, {addr.state} {addr.postcode}
                    <br />
                    {addr.country}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ----------------------------------------------------------------
   Main Widget
----------------------------------------------------------------- */
export const GeneralSettingsWidget: React.FC = () => {
  // Profile
  const [profile, setProfile] = useState<ProfileData>({
    avatar: null,
    name: 'Max Smith',
    generalEmail: 'max@kt.com',
    billingEmail: 'info@keenthemes.com',
  });

  // Addresses
  const [addresses, setAddresses] = useState<AddressData[]>([
    {
      id: 1,
      name: 'Home',
      address1: '101 Collin Street',
      address2: '',
      city: 'Melbourne',
      state: 'VIC',
      postcode: '3000',
      country: 'AU',
      isDefault: true,
      fullName: 'Max Smith',
    },
    {
      id: 2,
      name: 'Work',
      address1: '54 Spring Street',
      address2: '',
      city: 'Melbourne',
      state: 'VIC',
      postcode: '3000',
      country: 'AU',
      isDefault: false,
      fullName: 'Max Smith',
    },
  ]);

  // For editing
  const [editAddress, setEditAddress] = useState<AddressData | null>(null);

  // Confirmation state for deleting an address
  const [deleteAddressId, setDeleteAddressId] = useState<number | null>(null);

  // Ref to open confirmation modal programmatically
  const deleteModalRef = useRef<HTMLButtonElement>(null);

  const handleProfileUpdate = (data: Partial<ProfileData>) => {
    setProfile({ ...profile, ...data });
  };

  // Called by the "Edit" button
  const handleEditAddress = (addr: AddressData) => {
    setEditAddress(addr);
  };

  // Called by the "Delete" button in AddressBook
  const handleDeleteAddressClick = (id: number) => {
    setDeleteAddressId(id);
    // Programmatically open the confirmation modal
    deleteModalRef.current?.click();
  };

  // Once the user confirms deletion
  const confirmDeleteAddress = () => {
    if (deleteAddressId != null) {
      setAddresses((prev) => prev.filter((addr) => addr.id !== deleteAddressId));
    }
    setDeleteAddressId(null);
  };

  const handleUpdateAddressSubmit = (data: AddressData) => {
    setAddresses((prev) => prev.map((addr) => (addr.id === data.id ? data : addr)));
    // optional: close modal (Bootstrap data-bs-dismiss on the button)
  };

  const handleAddAddressSubmit = (data: AddressData) => {
    setAddresses((prev) => [...prev, data]);
    // optional: close modal (Bootstrap data-bs-dismiss on the button)
  };

  return (
    <div className="tab-pane fade show" id="kt_ecommerce_customer_general" role="tabpanel">
      {/* Profile */}
      <ProfileForm profile={profile} onUpdateProfile={handleProfileUpdate} />

      {/* Address Book */}
      <AddressBook
        addresses={addresses}
        setAddresses={setAddresses}
        onEditAddress={handleEditAddress}
        onDeleteAddress={handleDeleteAddressClick}
      />

      {/* Add Address Modal */}
      <AddAddressModal onSubmit={handleAddAddressSubmit} />

      {/* Update Address Modal */}
      <UpdateAddressModal
        address={editAddress}
        setAddress={setEditAddress}
        onSubmit={handleUpdateAddressSubmit}
      />

      {/* Delete Confirmation Modal (using your UpdateConfirmationModal) */}
      <UpdateConfirmationModal
        onSaveChanges={confirmDeleteAddress}
        modalId="deleteAddressConfirmation"
        title="Are you sure you want to delete this address?"
        bodyText="You will not be able to revert this action."
        confirmText="Yes, delete"
        ref={deleteModalRef}
      />
    </div>
  );
};

export default GeneralSettingsWidget;
