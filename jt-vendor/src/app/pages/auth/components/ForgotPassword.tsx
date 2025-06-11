import {useState, useEffect} from 'react'
import * as Yup from 'yup'
import clsx from 'clsx'
import {Link} from 'react-router-dom'
import {useFormik} from 'formik'
import {useDispatch, useSelector} from 'react-redux'
import {forgotPassword, clearError} from '@/app/redux/auth/auth.slice'
import {RootState, AppDispatch} from '@/app/redux/store'

const initialValues = {
  identity: '',
}

const forgotPasswordSchema = Yup.object().shape({
  identity: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Email or phone number is required'),
})

export function ForgotPassword() {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);
  const [resetSent, setResetSent] = useState(false);
  
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const formik = useFormik({
    initialValues,
    validationSchema: forgotPasswordSchema,
    onSubmit: async (values, {setSubmitting}) => {
      try {
        dispatch(forgotPassword(values.identity));
        setResetSent(true);
      } catch (error) {
        setSubmitting(false);
      }
    },
  })

  return (
    <form
      className='form w-100 fv-plugins-bootstrap5 fv-plugins-framework'
      noValidate
      id='kt_login_password_reset_form'
      onSubmit={formik.handleSubmit}
    >
      <div className='text-center mb-10'>
        {/* begin::Title */}
        <h1 className='text-gray-900 fw-bolder mb-3'>Forgot Password ?</h1>
        {/* end::Title */}

        {/* begin::Link */}
        <div className='text-gray-500 fw-semibold fs-6'>
          Enter your email or phone number to reset your password.
        </div>
        {/* end::Link */}
      </div>

      {/* begin::Title */}
      {error && (
        <div className='mb-lg-15 alert alert-danger'>
          <div className='alert-text font-weight-bold'>
            {typeof error === 'string' ? error : 'Failed to send reset code'}
          </div>
        </div>
      )}

      {resetSent && (
        <div className='mb-10 bg-light-info p-8 rounded'>
          <div className='text-info'>Reset code sent to your email or phone. Please check your inbox or messages.</div>
        </div>
      )}
      {/* end::Title */}

      {/* begin::Form group */}
      <div className='fv-row mb-8'>
        <label className='form-label fw-bolder text-gray-900 fs-6'>Email or Phone</label>
        <input
          type='text'
          placeholder='Enter your email or phone number'
          autoComplete='off'
          {...formik.getFieldProps('identity')}
          className={clsx(
            'form-control bg-transparent',
            {'is-invalid': formik.touched.identity && formik.errors.identity},
            {
              'is-valid': formik.touched.identity && !formik.errors.identity,
            }
          )}
        />
        {formik.touched.identity && formik.errors.identity && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.identity}</span>
            </div>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {/* begin::Form group */}
      <div className='d-flex flex-wrap justify-content-center pb-lg-0'>
        <button 
          type='submit' 
          id='kt_password_reset_submit' 
          className='btn btn-primary me-4'
          disabled={formik.isSubmitting || !formik.isValid || resetSent}
        >
          <span className='indicator-label'>Submit</span>
          {isLoading && (
            <span className='indicator-progress'>
              Please wait...
              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            </span>
          )}
        </button>
        <Link to='/auth/login'>
          <button
            type='button'
            id='kt_login_password_reset_form_cancel_button'
            className='btn btn-light'
          >
            Cancel
          </button>
        </Link>{' '}
      </div>
      {/* end::Form group */}
    </form>
  )
}
