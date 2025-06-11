import {useState, useEffect, ChangeEvent} from 'react'
import {useFormik} from 'formik'
import * as Yup from 'yup'
import clsx from 'clsx'
import {Link, Navigate} from 'react-router-dom'
import {toAbsoluteUrl} from '../../../../_metronic/helpers'
import {PasswordMeterComponent} from '../../../../_metronic/assets/ts/components'
import {useDispatch, useSelector} from 'react-redux'
import {registerUser, clearError} from '@/app/redux/auth/auth.slice'
import {RootState, AppDispatch} from '@/app/redux/store'

const initialValues = {
  firstname: '',
  lastname: '',
  email: '',
  phone: '',
  password: '',
  changepassword: '',
  shopName: '',
  shopAddress: '',
  acceptTerms: false,
  profileImage: null,
  shopLogo: null,
  shopBanner: null,
  secondaryBanner: null,
}

const registrationSchema = Yup.object().shape({
  firstname: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('First name is required'),
  lastname: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Last name is required'),
  email: Yup.string()
    .email('Wrong email format')
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Email is required'),
  phone: Yup.string()
    .min(10, 'Minimum 10 digits')
    .required('Phone number is required'),
  password: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Password is required'),
  changepassword: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Password confirmation is required')
    .oneOf([Yup.ref('password')], "Password and Confirm Password didn't match"),
  shopName: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(100, 'Maximum 100 symbols')
    .required('Shop name is required'),
  shopAddress: Yup.string()
    .min(5, 'Minimum 5 symbols')
    .max(200, 'Maximum 200 symbols')
    .required('Shop address is required'),
  shopLogo: Yup.mixed()
    .required('Shop logo is required'),
  secondaryBanner: Yup.mixed()
    .required('Secondary banner is required'),
  acceptTerms: Yup.bool().required('You must accept the terms and conditions'),
})

export function Registration() {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error, isLoggedIn } = useSelector((state: RootState) => state.auth);
  const [currentStep, setCurrentStep] = useState(1);
  
  useEffect(() => {
    dispatch(clearError());
    PasswordMeterComponent.bootstrap();
  }, [dispatch]);

  const handleFileChange = (fieldName: string) => (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0] || null;
    formik.setFieldValue(fieldName, file);
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const checkStepValidation = (step: number) => {
    if (step === 1) {
      const personalFields = ['firstname', 'lastname', 'email', 'phone'];
      let isValid = true;
      
      personalFields.forEach(field => {
        if (!formik.values[field as keyof typeof formik.values]) {
          formik.setFieldTouched(field, true, true);
          isValid = false;
        }
      });
      
      return isValid && !personalFields.some(field => formik.errors[field as keyof typeof formik.errors]);
    }
    
    if (step === 2) {
      const shopFields = ['shopName', 'shopAddress', 'shopLogo', 'secondaryBanner'];
      let isValid = true;
      
      shopFields.forEach(field => {
        if (!formik.values[field as keyof typeof formik.values]) {
          formik.setFieldTouched(field, true, true);
          isValid = false;
        }
      });
      
      return isValid && !shopFields.some(field => formik.errors[field as keyof typeof formik.errors]);
    }
    
    return true;
  };

  const handleNext = () => {
    if (checkStepValidation(currentStep)) {
      nextStep();
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema: registrationSchema,
    onSubmit: async (values, {setStatus, setSubmitting}) => {
      try {
        dispatch(registerUser({
          fName: values.firstname,
          lName: values.lastname,
          email: values.email,
          phone: values.phone,
          password: values.password,
          confirmPassword: values.changepassword,
          shopName: values.shopName,
          shopAddress: values.shopAddress,
          profileImage: values.profileImage,
          shopLogo: values.shopLogo,
          shopBanner: values.shopBanner,
          secondaryBanner: values.secondaryBanner,
        }));
      } catch (error) {
        setStatus('Registration failed. Please try again.');
        setSubmitting(false);
      }
    },
  })

  // Redirect to home if already logged in
  if (isLoggedIn) {
    return <Navigate to='/dashboard' />
  }

  return (
    <form
      className='form w-100 fv-plugins-bootstrap5 fv-plugins-framework'
      noValidate
      id='kt_login_signup_form'
      onSubmit={formik.handleSubmit}
    >
      {/* begin::Heading */}
      <div className='text-center mb-11'>
        {/* begin::Title */}
        <h1 className='text-gray-900 fw-bolder mb-3'>Sign Up</h1>
        {/* end::Title */}

        <div className='text-gray-500 fw-semibold fs-6'>Create your shop account</div>
      </div>
      {/* end::Heading */}

      {/* Step indicators */}
      <div className='mb-10'>
        <div className='d-flex flex-stack'>
          <div className={`step-item ${currentStep >= 1 ? 'current' : ''}`} style={{flex: '1', textAlign: 'center'}}>
            <div className={`step-icon ${currentStep >= 1 ? 'bg-primary text-white' : 'bg-light'}`} style={{width: '35px', height: '35px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto'}}>
              1
            </div>
            <div className='step-label mt-2 fs-7 fw-semibold'>Personal Info</div>
          </div>
          <div className='step-line' style={{flex: '0.5', height: '2px', background: '#E4E6EF', margin: 'auto 5px'}}></div>
          <div className={`step-item ${currentStep >= 2 ? 'current' : ''}`} style={{flex: '1', textAlign: 'center'}}>
            <div className={`step-icon ${currentStep >= 2 ? 'bg-primary text-white' : 'bg-light'}`} style={{width: '35px', height: '35px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto'}}>
              2
            </div>
            <div className='step-label mt-2 fs-7 fw-semibold'>Shop Details</div>
          </div>
          <div className='step-line' style={{flex: '0.5', height: '2px', background: '#E4E6EF', margin: 'auto 5px'}}></div>
          <div className={`step-item ${currentStep >= 3 ? 'current' : ''}`} style={{flex: '1', textAlign: 'center'}}>
            <div className={`step-icon ${currentStep >= 3 ? 'bg-primary text-white' : 'bg-light'}`} style={{width: '35px', height: '35px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto'}}>
              3
            </div>
            <div className='step-label mt-2 fs-7 fw-semibold'>Password</div>
          </div>
        </div>
      </div>

      {error && (
        <div className='mb-lg-15 alert alert-danger'>
          <div className='alert-text font-weight-bold'>
            {typeof error === 'string' ? error : 'Registration failed'}
          </div>
        </div>
      )}

      {/* Step 1: Personal Information */}
      {currentStep === 1 && (
        <div className='step-content'>
          <div className='mb-8 text-center'>
            <h3 className='fs-4 fw-bolder'>Personal Information</h3>
            <div className='text-gray-500 fw-semibold fs-6'>Enter your personal details</div>
          </div>

          {/* begin::Form group Firstname */}
          <div className='fv-row mb-8'>
            <label className='form-label fw-bolder text-gray-900 fs-6'>First name*</label>
            <input
              placeholder='First name'
              type='text'
              autoComplete='off'
              {...formik.getFieldProps('firstname')}
              className={clsx(
                'form-control bg-transparent',
                {
                  'is-invalid': formik.touched.firstname && formik.errors.firstname,
                },
                {
                  'is-valid': formik.touched.firstname && !formik.errors.firstname,
                }
              )}
            />
            {formik.touched.firstname && formik.errors.firstname && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.firstname}</span>
                </div>
              </div>
            )}
          </div>
          {/* end::Form group */}
          
          <div className='fv-row mb-8'>
            {/* begin::Form group Lastname */}
            <label className='form-label fw-bolder text-gray-900 fs-6'>Last name*</label>
            <input
              placeholder='Last name'
              type='text'
              autoComplete='off'
              {...formik.getFieldProps('lastname')}
              className={clsx(
                'form-control bg-transparent',
                {
                  'is-invalid': formik.touched.lastname && formik.errors.lastname,
                },
                {
                  'is-valid': formik.touched.lastname && !formik.errors.lastname,
                }
              )}
            />
            {formik.touched.lastname && formik.errors.lastname && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.lastname}</span>
                </div>
              </div>
            )}
            {/* end::Form group */}
          </div>

          {/* begin::Form group Email */}
          <div className='fv-row mb-8'>
            <label className='form-label fw-bolder text-gray-900 fs-6'>Email*</label>
            <input
              placeholder='Email'
              type='email'
              autoComplete='off'
              {...formik.getFieldProps('email')}
              className={clsx(
                'form-control bg-transparent',
                {'is-invalid': formik.touched.email && formik.errors.email},
                {
                  'is-valid': formik.touched.email && !formik.errors.email,
                }
              )}
            />
            {formik.touched.email && formik.errors.email && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.email}</span>
                </div>
              </div>
            )}
          </div>
          {/* end::Form group */}

          {/* begin::Form group Phone */}
          <div className='fv-row mb-8'>
            <label className='form-label fw-bolder text-gray-900 fs-6'>Phone*</label>
            <input
              placeholder='Phone number'
              type='tel'
              autoComplete='off'
              {...formik.getFieldProps('phone')}
              className={clsx(
                'form-control bg-transparent',
                {'is-invalid': formik.touched.phone && formik.errors.phone},
                {
                  'is-valid': formik.touched.phone && !formik.errors.phone,
                }
              )}
            />
            {formik.touched.phone && formik.errors.phone && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.phone}</span>
                </div>
              </div>
            )}
          </div>
          {/* end::Form group */}

          {/* begin::Form group Profile Image */}
          <div className='fv-row mb-8'>
            <label className='form-label fw-bolder text-gray-900 fs-6'>Profile Image</label>
            <input
              type='file'
              onChange={handleFileChange('profileImage')}
              className='form-control bg-transparent'
              accept='image/*'
            />
          </div>
          {/* end::Form group */}

          {/* Navigation buttons */}
          <div className='d-flex justify-content-between'>
            <Link to='/auth/login'>
              <button
                type='button'
                className='btn btn-lg btn-light'
              >
                <i className='fas fa-arrow-left me-2'></i> Back to Login
              </button>
            </Link>
            <button
              type='button'
              onClick={handleNext}
              className='btn btn-lg btn-primary'
            >
              Next <i className='fas fa-arrow-right ms-2'></i>
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Shop Information */}
      {currentStep === 2 && (
        <div className='step-content'>
          <div className='mb-8 text-center'>
            <h3 className='fs-4 fw-bolder'>Shop Information</h3>
            <div className='text-gray-500 fw-semibold fs-6'>Tell us about your shop</div>
          </div>

          {/* begin::Form group Shop Name */}
          <div className='fv-row mb-8'>
            <label className='form-label fw-bolder text-gray-900 fs-6'>Shop Name*</label>
            <input
              placeholder='Shop name'
              type='text'
              autoComplete='off'
              {...formik.getFieldProps('shopName')}
              className={clsx(
                'form-control bg-transparent',
                {'is-invalid': formik.touched.shopName && formik.errors.shopName},
                {
                  'is-valid': formik.touched.shopName && !formik.errors.shopName,
                }
              )}
            />
            {formik.touched.shopName && formik.errors.shopName && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.shopName}</span>
                </div>
              </div>
            )}
          </div>
          {/* end::Form group */}

          {/* begin::Form group Shop Address */}
          <div className='fv-row mb-8'>
            <label className='form-label fw-bolder text-gray-900 fs-6'>Shop Address*</label>
            <input
              placeholder='Shop address'
              type='text'
              autoComplete='off'
              {...formik.getFieldProps('shopAddress')}
              className={clsx(
                'form-control bg-transparent',
                {'is-invalid': formik.touched.shopAddress && formik.errors.shopAddress},
                {
                  'is-valid': formik.touched.shopAddress && !formik.errors.shopAddress,
                }
              )}
            />
            {formik.touched.shopAddress && formik.errors.shopAddress && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.shopAddress}</span>
                </div>
              </div>
            )}
          </div>
          {/* end::Form group */}

          {/* begin::Form group Shop Logo */}
          <div className='fv-row mb-8'>
            <label className='form-label fw-bolder text-gray-900 fs-6'>Shop Logo*</label>
            <input
              type='file'
              onChange={handleFileChange('shopLogo')}
              className={clsx(
                'form-control bg-transparent',
                {'is-invalid': formik.touched.shopLogo && formik.errors.shopLogo}
              )}
              accept='image/*'
            />
            {formik.touched.shopLogo && formik.errors.shopLogo && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.shopLogo}</span>
                </div>
              </div>
            )}
            <div className='text-muted mt-2'>
              Logo must be a file of type: jpg, jpeg, png, gif.
            </div>
          </div>
          {/* end::Form group */}

          {/* begin::Form group Shop Banner */}
          <div className='fv-row mb-8'>
            <label className='form-label fw-bolder text-gray-900 fs-6'>Shop Banner</label>
            <input
              type='file'
              onChange={handleFileChange('shopBanner')}
              className='form-control bg-transparent'
              accept='image/*'
            />
            <div className='text-muted mt-2'>
              Banner must be a file of type: jpg, jpeg, png, gif.
            </div>
          </div>
          {/* end::Form group */}

          {/* begin::Form group Secondary Banner */}
          <div className='fv-row mb-8'>
            <label className='form-label fw-bolder text-gray-900 fs-6'>Secondary Banner*</label>
            <input
              type='file'
              onChange={handleFileChange('secondaryBanner')}
              className={clsx(
                'form-control bg-transparent',
                {'is-invalid': formik.touched.secondaryBanner && formik.errors.secondaryBanner}
              )}
              accept='image/*'
            />
            {formik.touched.secondaryBanner && formik.errors.secondaryBanner && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.secondaryBanner}</span>
                </div>
              </div>
            )}
            <div className='text-muted mt-2'>
              Secondary banner must be a file of type: jpg, jpeg, png, gif.
            </div>
          </div>
          {/* end::Form group */}

          {/* Navigation buttons */}
          <div className='d-flex justify-content-between'>
            <button
              type='button'
              onClick={prevStep}
              className='btn btn-lg btn-light'
            >
              <i className='fas fa-arrow-left me-2'></i> Back
            </button>
            <button
              type='button'
              onClick={handleNext}
              className='btn btn-lg btn-primary'
            >
              Next <i className='fas fa-arrow-right ms-2'></i>
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Password and Terms */}
      {currentStep === 3 && (
        <div className='step-content'>
          <div className='mb-8 text-center'>
            <h3 className='fs-4 fw-bolder'>Create Password</h3>
            <div className='text-gray-500 fw-semibold fs-6'>Secure your account with a strong password</div>
          </div>

          {/* begin::Form group Password */}
          <div className='fv-row mb-8' data-kt-password-meter='true'>
            <div className='mb-1'>
              <label className='form-label fw-bolder text-gray-900 fs-6'>Password*</label>
              <div className='position-relative mb-3'>
                <input
                  type='password'
                  placeholder='Password'
                  autoComplete='off'
                  {...formik.getFieldProps('password')}
                  className={clsx(
                    'form-control bg-transparent',
                    {
                      'is-invalid': formik.touched.password && formik.errors.password,
                    },
                    {
                      'is-valid': formik.touched.password && !formik.errors.password,
                    }
                  )}
                />
                {formik.touched.password && formik.errors.password && (
                  <div className='fv-plugins-message-container'>
                    <div className='fv-help-block'>
                      <span role='alert'>{formik.errors.password}</span>
                    </div>
                  </div>
                )}
              </div>
              {/* begin::Meter */}
              <div
                className='d-flex align-items-center mb-3'
                data-kt-password-meter-control='highlight'
              >
                <div className='flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2'></div>
                <div className='flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2'></div>
                <div className='flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2'></div>
                <div className='flex-grow-1 bg-secondary bg-active-success rounded h-5px'></div>
              </div>
              {/* end::Meter */}
            </div>
            <div className='text-muted'>
              Use 8 or more characters with a mix of letters, numbers & symbols.
            </div>
          </div>
          {/* end::Form group */}

          {/* begin::Form group Confirm password */}
          <div className='fv-row mb-8'>
            <label className='form-label fw-bolder text-gray-900 fs-6'>Confirm Password*</label>
            <input
              type='password'
              placeholder='Password confirmation'
              autoComplete='off'
              {...formik.getFieldProps('changepassword')}
              className={clsx(
                'form-control bg-transparent',
                {
                  'is-invalid': formik.touched.changepassword && formik.errors.changepassword,
                },
                {
                  'is-valid': formik.touched.changepassword && !formik.errors.changepassword,
                }
              )}
            />
            {formik.touched.changepassword && formik.errors.changepassword && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.changepassword}</span>
                </div>
              </div>
            )}
          </div>
          {/* end::Form group */}

          {/* begin::Form group Terms */}
          <div className='fv-row mb-8'>
            <label className='form-check form-check-inline' htmlFor='kt_login_toc_agree'>
              <input
                className='form-check-input'
                type='checkbox'
                id='kt_login_toc_agree'
                {...formik.getFieldProps('acceptTerms')}
              />
              <span>
                I Accept the{' '}
                <a
                  href='https://keenthemes.com/metronic/?page=faq'
                  target='_blank'
                  className='ms-1 link-primary'
                >
                  Terms
                </a>
                .
              </span>
            </label>
            {formik.touched.acceptTerms && formik.errors.acceptTerms && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.acceptTerms}</span>
                </div>
              </div>
            )}
          </div>
          {/* end::Form group */}

          {/* Navigation buttons */}
          <div className='d-flex justify-content-between'>
            <button
              type='button'
              onClick={prevStep}
              className='btn btn-lg btn-light'
            >
              <i className='fas fa-arrow-left me-2'></i> Back
            </button>
            <button
              type='submit'
              id='kt_sign_up_submit'
              className='btn btn-lg btn-primary'
              disabled={formik.isSubmitting || !formik.isValid || !formik.values.acceptTerms}
            >
              {!isLoading && <span className='indicator-label'>Submit</span>}
              {isLoading && (
                <span className='indicator-progress' style={{display: 'block'}}>
                  Please wait...{' '}
                  <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                </span>
              )}
            </button>
          </div>

          <div className='mt-5 text-center'>
            <Link to='/auth/login' className='link-primary fs-6 fw-bold'>
              Already have an account? Login
            </Link>
          </div>
        </div>
      )}
    </form>
  )
}
