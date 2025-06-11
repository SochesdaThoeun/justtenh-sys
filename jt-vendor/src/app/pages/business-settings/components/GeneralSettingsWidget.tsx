import React, { useState, useEffect } from 'react'
import UpdatePhoneModal from './modals/UpdatePhoneModal'
import UpdatePasswordModal from './modals/UpdatePasswordModal'
import UpdateLanguageModal from './modals/UpdateLanguageModal'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/app/redux/store'
import { fetchSellerInfo, updateProfile, changeLanguage } from '@/app/redux/vendor/vendorSlice'
import { VendorBody } from '@/app/redux/models'

interface LanguageMap {
  [key: string]: string;
}

export function GeneralSettingsWidget() {
  const dispatch = useDispatch<AppDispatch>()
  const { profile, isLoading } = useSelector((state: RootState) => state.vendorReducer)

  // Form state
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [email, setEmail] = useState('')
  const [language, setLanguage] = useState('')
  const [languageLabel, setLanguageLabel] = useState('')

  // Avatar upload: store both the File and a preview URL
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string>(
    // Default avatar image or blank placeholder
    'assets/media/svg/files/blank-image.svg'
  )

  // Language mapping for display
  const languageMap: LanguageMap = {
    'en': 'English',
    'es': 'Spanish',
    'fr': 'French',
    'id': 'Bahasa Indonesia',
    'msa': 'Bahasa Melayu'
  }

  // Fetch vendor profile data
  useEffect(() => {
    dispatch(fetchSellerInfo())
  }, [dispatch])

  // Update local state with profile data when it loads
  useEffect(() => {
    if (profile) {
      setFirstName(profile.f_name || '')
      setLastName(profile.l_name || '')
      setPhoneNumber(profile.phone || '')
      setEmail(profile.email || '')
      
      // Set app language if available
      if (profile.app_language) {
        setLanguage(profile.app_language || 'en')
        setLanguageLabel(languageMap[profile.app_language] || 'English')
      }
      
      // Set avatar preview if available
      if (profile.image_full_url && profile.image_full_url.path) {
        setAvatarPreview(profile.image_full_url.path)
      }
    }
  }, [profile])

  // Handle avatar (image/file) changes
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      setAvatarFile(file)

      // Convert file to base64 string for preview
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setAvatarPreview(event.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  // Modal update handlers
  const handlePhoneUpdate = (updatedPhone: string) => {
    setPhoneNumber(updatedPhone)
    if (profile) {
      const profileBody: VendorBody = {
        _method: 'put',
        f_name: profile.f_name,
        l_name: profile.l_name,
        // Add the phone to any additional data
        phone: updatedPhone
      }
      dispatch(updateProfile({ profileInfo: profile, profileBody }))
        .unwrap()
        .then(() => {
          // Fetch the updated data
          dispatch(fetchSellerInfo());
        });
    }
  }

  const handleEmailUpdate = (updatedEmail: string) => {
    setEmail(updatedEmail)
    if (profile) {
      const profileBody: VendorBody = {
        _method: 'put',
        f_name: profile.f_name,
        l_name: profile.l_name,
        // Add the email to any additional data
        email: updatedEmail
      }
      dispatch(updateProfile({ profileInfo: profile, profileBody }))
        .unwrap()
        .then(() => {
          // Fetch the updated data
          dispatch(fetchSellerInfo());
        });
    }
  }

  const handleLanguageUpdate = (updatedLanguage: string) => {
    setLanguage(updatedLanguage)
    setLanguageLabel(languageMap[updatedLanguage] || updatedLanguage)
    
    // Use the dedicated language change API
    dispatch(changeLanguage(updatedLanguage))
      .unwrap()
      .then(() => {
        // Fetch the updated data
        dispatch(fetchSellerInfo());
      });
  }

  const handlePasswordUpdate = (data: { currentPassword: string; newPassword: string }) => {
    if (profile) {
      const profileBody: VendorBody = {
        _method: 'put'
      }
      dispatch(updateProfile({ 
        profileInfo: profile, 
        profileBody, 
        password: data.newPassword 
      }))
    }
  }

  // Save changes (submit the entire form)
  const handleGeneralSubmit = (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault()
    
    if (profile) {
      const profileBody: VendorBody = {
        _method: 'put',
        f_name: firstName,
        l_name: lastName,
        // Add the remaining fields as additional data
        phone: phoneNumber,
        email: email
      }
      
      dispatch(updateProfile({ 
        profileInfo: profile, 
        profileBody, 
        file: avatarFile 
      }))
      .unwrap()
      .then(() => {
        // Fetch the updated data
        dispatch(fetchSellerInfo());
      })
      .catch((error) => {
        console.error('Error updating profile:', error);
      });
    }
  }

  // Reset all fields to current profile values
  const handleCancel = (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault()
    if (profile) {
      setFirstName(profile.f_name || '')
      setLastName(profile.l_name || '')
      setPhoneNumber(profile.phone || '')
      setEmail(profile.email || '')
      setLanguage(profile.app_language || 'en')
      setLanguageLabel(languageMap[profile.app_language || 'en'])
      
      // Reset avatar preview
      if (profile.image_full_url && profile.image_full_url.path) {
        setAvatarPreview(profile.image_full_url.path)
      } else {
        setAvatarPreview('assets/media/svg/files/blank-image.svg')
      }
      
      setAvatarFile(null)
    }
  }

  return (
    <div
      className="tab-pane fade show active"
      id="kt_ecommerce_settings_general"
      role="tabpanel"
    >
      <form
        id="kt_ecommerce_settings_general_form"
        className="form"
        action="#"
        onSubmit={handleGeneralSubmit}
      >
        {/* Heading */}
        <div className="row mb-7">
          <div className="col-md-9 offset-md-2">
            <h2>General Settings</h2>

            {/* Avatar Upload */}
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
                  {/* Avatar preview */}
                  <div
                    className="image-input-wrapper w-125px h-125px"
                    style={{
                      backgroundImage: `url(${avatarPreview})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
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
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      setAvatarFile(null)
                      setAvatarPreview('assets/media/svg/files/blank-image.svg')
                    }}
                  >
                    <i className="ki-outline ki-cross fs-2" />
                  </span>
                </div>
              </div>
            </div>

            {/* First Name & Last Name */}
            <div className="row row-cols-1 row-cols-md-2">
              <div className="col">
                <div className="fv-row mb-7">
                  <label className="fs-6 fw-semibold mb-2">
                    <span className="required">First Name</span>
                    <span
                      className="ms-1"
                      data-bs-toggle="tooltip"
                      title="First Name is required"
                    >
                      <i className="ki-outline ki-information fs-7" />
                    </span>
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-solid"
                    name="first_name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
              </div>

              <div className="col">
                <div className="fv-row mb-7">
                  <label className="fs-6 fw-semibold mb-2">
                    <span className="required">Last Name</span>
                    <span
                      className="ms-1"
                      data-bs-toggle="tooltip"
                      title="Last Name is required"
                    >
                      <i className="ki-outline ki-information fs-7" />
                    </span>
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-solid"
                    name="last_name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Phone Number & Email */}
            <div className="row row-cols-1 row-cols-md-2">
              <div className="col">
                <div className="fv-row mb-7">
                  <label className="fs-6 fw-semibold mb-2">
                    <span className="required">Phone Number</span>
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-solid"
                    name="phone_number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
              </div>
              <div className="col">
                <div className="fv-row mb-7">
                  <label className="fs-6 fw-semibold mb-2">
                    <span className="required">Email</span>
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
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Display table (phone, email, password, language) */}
            <div className="table-responsive">
              <table
                className="table align-middle table-row-dashed gy-5"
                id="kt_table_users_login_session"
              >
                <tbody className="fs-6 fw-semibold text-gray-600">
                  <tr>
                    <td>Phone</td>
                    <td>{phoneNumber}</td>
                    <td className="text-end">
                      <a
                        href="#"
                        className="btn btn-icon btn-active-light-primary w-30px h-30px ms-auto"
                        data-bs-toggle="modal"
                        data-bs-target="#kt_modal_update_phone"
                      >
                        <i className="ki-outline ki-pencil fs-3"></i>
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td>Email</td>
                    <td>{email}</td>
                    <td className="text-end">
                      <a
                        href="#"
                        className="btn btn-icon btn-active-light-primary w-30px h-30px ms-auto"
                        onClick={(e) => {
                          e.preventDefault();
                          // Open a prompt or use a simple implementation
                          const newEmail = prompt("Enter new email address:", email);
                          if (newEmail && newEmail !== email) {
                            handleEmailUpdate(newEmail);
                          }
                        }}
                      >
                        <i className="ki-outline ki-pencil fs-3"></i>
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td>Password</td>
                    <td>******</td>
                    <td className="text-end">
                      <a
                        href="#"
                        className="btn btn-icon btn-active-light-primary w-30px h-30px ms-auto"
                        data-bs-toggle="modal"
                        data-bs-target="#kt_modal_update_password"
                      >
                        <i className="ki-outline ki-pencil fs-3"></i>
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td>Language</td>
                    <td>{languageLabel}</td>
                    <td className="text-end">
                      <a
                        href="#"
                        className="btn btn-icon btn-active-light-primary w-30px h-30px ms-auto"
                        data-bs-toggle="modal"
                        data-bs-target="#kt_modal_update_language"
                      >
                        <i className="ki-outline ki-pencil fs-3"></i>
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="row py-5">
          <div className="col-md-9 offset-md-2">
            <div className="d-flex">
              {/* Cancel */}
              <a
                href="#"
                data-kt-ecommerce-settings-type="cancel"
                className="btn btn-light me-3"
                onClick={handleCancel}
              >
                Cancel
              </a>
              {/* Save */}
              <button 
                type="submit"
                data-kt-ecommerce-settings-type="submit"
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="indicator-progress">
                    Please wait...
                    <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                  </span>
                ) : (
                  <span className="indicator-label">Save</span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Modals */}
        <UpdatePhoneModal phoneValue={phoneNumber} onSubmit={handlePhoneUpdate} />
        <UpdatePasswordModal onSubmit={handlePasswordUpdate} />
        <UpdateLanguageModal languageValue={language} onSubmit={handleLanguageUpdate} />
      </form>
    </div>
  )
}
