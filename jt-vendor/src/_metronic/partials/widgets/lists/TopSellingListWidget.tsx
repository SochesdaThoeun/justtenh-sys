import { FC } from 'react'
import {KTIcon, toAbsoluteUrl} from '../../../helpers'
import {Dropdown1} from '../../content/dropdown/Dropdown1'

type Props = {
  className: string
}

const TopSellingListWidget: FC<Props> = () => {
  return (
    <div className='card card-xl-stretch mb-5 mb-xl-8'>
      {/* begin::Header */}
      <div className='card-header align-items-center border-0 mt-4'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='fw-bold text-gray-900'>Top Selling Products</span>
          <span className='text-muted mt-1 fw-semibold fs-7'>Most profitable products</span>
        </h3>
        <div className='card-toolbar'>
          {/* begin::Menu */}
          <button
            type='button'
            className='btn btn-sm btn-icon btn-color-primary btn-active-light-primary'
            data-kt-menu-trigger='click'
            data-kt-menu-placement='bottom-end'
            data-kt-menu-flip='top-end'
          >
            <KTIcon iconName='category' className='fs-2' />
          </button>
          <Dropdown1 />
          {/* end::Menu */}
        </div>
      </div>
      {/* end::Header */}
      {/* begin::Body */}
      <div className='card-body pt-3'>
        {/* begin::Item */}
        <div className='d-flex align-items-sm-center mb-7'>
          {/* begin::Symbol */}
          <div className='symbol symbol-60px symbol-2by3 me-4'>
            <div
              className='symbol-label'
              style={{backgroundImage: `url(${toAbsoluteUrl('media/stock/600x400/img-17.jpg')})`}}
            ></div>
          </div>
          {/* end::Symbol */}
          {/* begin::Content */}
          <div className='d-flex flex-row-fluid align-items-center flex-wrap my-lg-0 me-2'>
            {/* begin::Title */}
            <div className='flex-grow-1 my-lg-0 my-2 me-2'>
              <a href='#' className='text-gray-800 fw-bold text-hover-primary fs-6'>
               RE Shirt
              </a>
              <span className='text-muted fw-semibold d-block pt-1'>$10.0</span>
            </div>
            {/* end::Title */}
            {/* begin::Section */}
            <div className='d-flex align-items-center'>
              <div className='me-6'>
            
                <span className='text-gray-800 fw-bold'>20 Items</span>
              </div>
              <a href='#' className='btn btn-icon btn-light btn-sm border-0'>
                <KTIcon iconName='arrow-right' className='fs-2 text-primary' />
              </a>
            </div>
            {/* end::Section */}
          </div>
          {/* end::Content */}
        </div>
        {/* end::Item */}
        {/* begin::Item */}
        <div className='d-flex align-items-sm-center mb-7'>
          {/* begin::Symbol */}
          <div className='symbol symbol-60px symbol-2by3 me-4'>
            <div
              className='symbol-label'
              style={{backgroundImage: `url(${toAbsoluteUrl('media/stock/600x400/img-10.jpg')})`}}
            ></div>
          </div>
          {/* end::Symbol */}
          {/* begin::Content */}
          <div className='d-flex flex-row-fluid align-items-center flex-wrap my-lg-0 me-2'>
            {/* begin::Title */}
            <div className='flex-grow-1 my-lg-0 my-2 me-2'>
              <a href='#' className='text-gray-800 fw-bold text-hover-primary fs-6'>
                Pink Patterns
              </a>
              <span className='text-muted fw-semibold d-block pt-1'>$20.0</span>
            </div>
            {/* end::Title */}
            {/* begin::Section */}
            <div className='d-flex align-items-center'>
              <div className='me-6'>
                <span className='text-gray-800 fw-bold'>12 Items</span>
              </div>
              <a href='#' className='btn btn-icon btn-light btn-sm border-0'>
                <KTIcon iconName='arrow-right' className='fs-2 text-primary' />
              </a>
            </div>
            {/* end::Section */}
          </div>
          {/* end::Content */}
        </div>
        {/* end::Item */}
        {/* begin::Item */}
        <div className='d-flex align-items-sm-center mb-7'>
          {/* begin::Symbol */}
          <div className='symbol symbol-60px symbol-2by3 me-4'>
            <div
              className='symbol-label'
              style={{backgroundImage: `url(${toAbsoluteUrl('media/stock/600x400/img-1.jpg')})`}}
            ></div>
          </div>
          {/* end::Symbol */}
          {/* begin::Content */}
          <div className='d-flex flex-row-fluid align-items-center flex-wrap my-lg-0 me-2'>
            {/* begin::Title */}
            <div className='flex-grow-1 my-lg-0 my-2 me-2'>
              <a href='#' className='text-gray-800 fw-bold text-hover-primary fs-6'>
                Abstract Art
              </a>
              <span className='text-muted fw-semibold d-block pt-1'>
                $100.0
              </span>
            </div>
            {/* end::Title */}
            {/* begin::Section */}
            <div className='d-flex align-items-center'>
              <div className='me-6'>
                <span className='text-gray-800 fw-bold'>200 Items</span>
              </div>
              <a href='#' className='btn btn-icon btn-light btn-sm border-0'>
                <KTIcon iconName='arrow-right' className='fs-2 text-primary' />
              </a>
            </div>
            {/* end::Section */}
          </div>
          {/* end::Content */}
        </div>
        {/* end::Item */}
        {/* begin::Item */}
        <div className='d-flex align-items-sm-center'>
          {/* begin::Symbol */}
          <div className='symbol symbol-60px symbol-2by3 me-4'>
            <div
              className='symbol-label'
              style={{backgroundImage: `url(${toAbsoluteUrl('media/stock/600x400/img-9.jpg')})`}}
            ></div>
          </div>
          {/* end::Symbol */}
          {/* begin::Content */}
          <div className='d-flex flex-row-fluid align-items-center flex-wrap my-lg-0 me-2'>
            {/* begin::Title */}
            <div className='flex-grow-1 my-lg-0 my-2 me-2'>
              <a href='#' className='text-gray-800 fw-bold text-hover-primary fs-6'>
                Desserts platter
              </a>
              <span className='text-muted fw-semibold d-block pt-1'>
                $199.0
              </span>
            </div>
            {/* end::Title */}
            {/* begin::Section */}
            <div className='d-flex align-items-center'>
              <div className='me-6'>
                
                <span className='text-gray-800 fw-bold'>100 Items</span>
              </div>
              <a href='#' className='btn btn-icon btn-light btn-sm border-0'>
                <KTIcon iconName='arrow-right' className='fs-2 text-primary' />
              </a>
            </div>
            {/* end::Section */}
          </div>
          {/* end::Content */}
        </div>
        {/* end::Item */}
      </div>
      {/* end::Body */}
    </div>
  )
}

export {TopSellingListWidget}
