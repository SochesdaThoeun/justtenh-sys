
import {FC} from 'react'
import {KTIcon, toAbsoluteUrl} from '../../../helpers'
import {UserMenu} from '../user-menu/UserMenu'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/app/redux/store'


const AsideUserMenu: FC = () => {
  const { profile } = useSelector((state: RootState) => state.vendorReducer);
  const dispatch = useDispatch()


  return (
    <>
      <div className='d-flex flex-stack'>
        {/* begin::Wrapper */}
        <div className='d-flex align-items-center'>
          {/* begin::Avatar */}
          <div className='symbol symbol-circle symbol-40px'>
            <img src={profile?.image_full_url?.path} alt='avatar' />
          </div>
          {/* end::Avatar */}
          {/* begin::User info */}
          <div className='ms-2'>
            <a href='#' className='text-gray-800 text-hover-primary fs-6 fw-bolder lh-1'>
              {profile?.l_name} {profile?.f_name}
            </a>
            <span className='text-muted fw-bold d-block fs-7 lh-1'>Not Subscribe</span>
          </div>
          {/* end::User info */}
        </div>
        {/* end::Wrapper */}

        {/* begin::User menu */}
        <div className='ms-1'>
          <div
            className='btn btn-sm btn-icon btn-active-color-primary position-relative me-n2'
            data-kt-menu-trigger='click'
            data-kt-menu-overflow='false'
            data-kt-menu-placement='top-end'
          >
            <KTIcon iconName='setting-2' className='fs-1' />
          </div>
          <UserMenu />
        </div>
        {/* end::User menu */}
      </div>
    </>
  )
}

export {AsideUserMenu}
