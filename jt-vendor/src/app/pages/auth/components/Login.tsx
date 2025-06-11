import {useState, useEffect} from 'react'
import * as Yup from 'yup'
import clsx from 'clsx'
import {Link} from 'react-router-dom'
import {useFormik} from 'formik'
import {toAbsoluteUrl} from '../../../../_metronic/helpers'
import {useDispatch, useSelector} from 'react-redux'
import {loginUser, clearError} from '@/app/redux/auth/auth.slice'
import {RootState, AppDispatch} from '@/app/redux'
import {Navigate} from 'react-router-dom'

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Wrong email format')
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Email is required'),
  password: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Password is required'),
})

const initialValues = {
  email: '',
  password: '',
  rememberMe: true,
}

export function Login() {
  const dispatch = useDispatch();
  const { isLoading, error, isLoggedIn } = useSelector((state: RootState) => state.auth);
  
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, {setStatus, setSubmitting}) => {
      try {
        await dispatch(loginUser({
          email: values.email,
          password: values.password,
          rememberMe: values.rememberMe
        }) as any); // Cast to any to handle AsyncThunkAction type
      } catch (error) {
        setStatus('The login details are incorrect')
        setSubmitting(false)
      }
    },
  })

  // Redirect to home if already logged in
  if (isLoggedIn) {
    return <Navigate to='/dashboard' />
  }

  return (
    <form
      className='form w-100'
      onSubmit={formik.handleSubmit}
      noValidate
      id='kt_login_signin_form'
    >
      {/* begin::Heading */}
      <div className='text-center mb-11'>
        <h1 className='text-gray-900 fw-bolder mb-3'>Sign In</h1>
      </div>
      {/* begin::Heading */}

      
      {error && (
        <div className='mb-lg-15 alert alert-danger'>
          <div className='alert-text font-weight-bold'>{typeof error === 'string' ? error : 'Login failed'}</div>
        </div>
      )}

      {/* begin::Form group */}
      <div className='fv-row mb-8'>
        <label className='form-label fs-6 fw-bolder text-gray-900'>Email</label>
        <input
          placeholder='Email'
          {...formik.getFieldProps('email')}
          className={clsx(
            'form-control bg-transparent',
            {'is-invalid': formik.touched.email && formik.errors.email},
            {
              'is-valid': formik.touched.email && !formik.errors.email,
            }
          )}
          type='email'
          name='email'
          autoComplete='off'
        />
        {formik.touched.email && formik.errors.email && (
          <div className='fv-plugins-message-container'>
            <span role='alert'>{formik.errors.email}</span>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {/* begin::Form group */}
      <div className='fv-row mb-3'>
        <label className='form-label fw-bolder text-gray-900 fs-6 mb-0'>Password</label>
        <input
          type='password'
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
      {/* end::Form group */}

      {/* begin::Wrapper */}
      <div className='d-flex flex-stack flex-wrap gap-3 fs-base fw-semibold mb-8'>
        <div className='form-check'>
          <input
            className='form-check-input'
            type='checkbox'
            id='rememberMe'
            {...formik.getFieldProps('rememberMe')}
            checked={formik.values.rememberMe}
          />
          <label className='form-check-label' htmlFor='rememberMe'>
            Remember me
          </label>
        </div>

        {/* begin::Link */}
        <Link to='/auth/forgot-password' className='link-primary'>
          Forgot Password ?
        </Link>
        {/* end::Link */}
      </div>
      {/* end::Wrapper */}

      {/* begin::Action */}
      <div className='d-grid mb-10'>
        <button
          type='submit'
          id='kt_sign_in_submit'
          className='btn btn-primary'
          disabled={formik.isSubmitting || !formik.isValid}
        >
          {!isLoading && <span className='indicator-label'>Continue</span>}
          {isLoading && (
            <span className='indicator-progress' style={{display: 'block'}}>
              Please wait...
              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            </span>
          )}
        </button>
      </div>
      {/* end::Action */}

      <div className='text-gray-500 text-center fw-semibold fs-6'>
        Not a Member yet?{' '}
        <Link to='/auth/registration' className='link-primary'>
          Sign up
        </Link>
      </div>
    </form>
  )
}
