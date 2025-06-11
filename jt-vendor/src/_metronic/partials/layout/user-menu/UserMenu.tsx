import {Link} from 'react-router-dom'
import {toAbsoluteUrl} from '../../../helpers'
import {Languages} from '../header-menus/Languages'
import { logoutUser } from '../../../../app/redux/auth/auth.slice'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/app/redux/store'


const UserMenu = () => {
  const { profile } = useSelector((state: RootState) => state.vendorReducer);
  const dispatch = useDispatch()
  
  return (
    <div
      className='menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-800 menu-state-bg menu-state-primary fw-bold py-4 fs-6 w-275px'
      data-kt-menu='true'
    >
      {/* begin::Menu item */}
      <div className='menu-item px-3'>
        <div className='menu-content d-flex align-items-center px-3'>
          {/* begin::Avatar */}
          <div className='symbol symbol-50px me-5'>
            <img alt='Logo' src={toAbsoluteUrl('media/avatars/300-1.jpg')} />
          </div>
          {/* end::Avatar */}

          {/* begin::Username */}
          <div className='d-flex flex-column'>
            <div className='fw-bolder d-flex align-items-center fs-5'>
              {profile?.f_name} {profile?.l_name}
              <span className='badge badge-light-success fw-bolder fs-8 px-2 py-1 ms-2'>Pro</span>
            </div>
            <a href='#' className='fw-bold text-muted text-hover-primary fs-7'>
              {profile?.email}
            </a>
          </div>
          {/* end::Username */}
        </div>
      </div>
      {/* end::Menu item */}


      {/* begin::Menu separator */}
      <div className='separator my-2'> </div>
      {/* end::Menu separator */}

      <Languages languageMenuPlacement='right-end' />

      {/* begin::Menu item */}
      <div className='menu-item px-5 my-1'>
        <a href='./store_settings' className='menu-link px-5'>
          Account Settings
        </a>
      </div>
      {/* end::Menu item */}

      {/* begin::Menu item */}
      <div className='menu-item px-5'>
        <a 
          onClick={(e) => {
            e.preventDefault();
            dispatch(logoutUser() as any);
            //console.log('logout');
          }} 
          className='menu-link px-5'
          style={{ cursor: 'pointer' }}
          role="button"
        >
          Sign Out
        </a>
      </div>
    </div>
  )
}

export {UserMenu}
