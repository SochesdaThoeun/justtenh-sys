import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { KTIcon } from '../../../../_metronic/helpers';
import Select, { SingleValue } from 'react-select';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { setSearchTerm, setCategoryId, setStatus, resetFilters } from '../../../redux/product/productslice';

// Option type for react-select
export type OptionType = {
  value: string;
  label: string;
};

interface AllProductsHeaderProps {
  // Options for React-Select
  categoryOptions: OptionType[];
  statusOptions: OptionType[];
}

export const AllProductsHeader: React.FC<AllProductsHeaderProps> = ({
  categoryOptions,
  statusOptions,
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const filterMenuRef = useRef<HTMLDivElement>(null);
  
  // Get values from Redux state
  const { currentSearch, currentCategoryId, currentStatus } = useAppSelector((state) => state.product);
  
  // Handle clicking outside to close the filter menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target as Node) && 
          !(event.target as Element).closest('[data-kt-menu-trigger="click"]')) {
        setIsFilterMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Toggle filter menu
  const toggleFilterMenu = () => {
    setIsFilterMenuOpen(!isFilterMenuOpen);
  };

  // Prevent event propagation to keep menu open when interacting with select components
  const handleSelectClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Action handlers
  const handleSearchChange = (search: string) => {
    dispatch(setSearchTerm(search));
  };

  const handleCategoryChange = (categoryId: string | null) => {
    dispatch(setCategoryId(categoryId));
  };

  const handleStatusChange = (statusValue: string | null) => {
    if (statusValue === null) {
      dispatch(setStatus(null));
    } else {
      dispatch(setStatus(parseInt(statusValue)));
    }
  };

  const handleReset = () => {
    dispatch(resetFilters());
  };

  // Apply filter action
  const handleApply = () => {
    // Filters are already applied via Redux state changes
    setIsFilterMenuOpen(false);
  };
  
  return (
    <div className='card-header border-0 pt-5'>
      <div className='card-title'>
        {/* begin::Search */}
        <div className='d-flex align-items-center position-relative my-1'>
          <KTIcon iconName='magnifier' className='fs-1 position-absolute ms-6' />
          <input
            type='text'
            data-kt-user-table-filter='search'
            className='form-control form-control-solid w-250px ps-14'
            placeholder='Search product'
            value={currentSearch}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
        {/* end::Search */}
      </div>

      <div className='card-toolbar'>
        {/* begin::Menu */}
        <div
          className='d-flex justify-content-end'
          data-kt-user-table-toolbar='base'
        >
          {/* begin::Filter Button */}
          <button
            type='button'
            className='btn btn-light-primary me-3'
            data-kt-menu-trigger='click'
            data-kt-menu-placement='bottom-end'
            onClick={toggleFilterMenu}
          >
            <KTIcon iconName='filter' className='fs-2' />
            Filter
          </button>
          {/* end::Filter Button */}

          {/* begin::SubMenu */}
          <div
            ref={filterMenuRef}
            className={`menu menu-sub menu-sub-dropdown w-300px w-md-325px ${isFilterMenuOpen ? 'show' : ''}`}
            data-kt-menu='true'
            style={{ 
              position: 'absolute',
              inset: '0px 0px auto auto',
              margin: '0px',
              transform: 'translate(-10px, 35px)',
            }}
          >
            {/* begin::Header */}
            <div className='px-7 py-5'>
              <div className='fs-5 text-gray-900 fw-bolder'>
                Filter Options
              </div>
            </div>
            {/* end::Header */}

            {/* begin::Separator */}
            <div className='separator border-gray-200'></div>
            {/* end::Separator */}

            {/* begin::Content */}
            <div className='px-7 py-5' data-kt-user-table-filter='form'>
              {/* begin::Input group - Category */}
              <div className='mb-10' onClick={handleSelectClick}>
                <Select
                  className='react-select-styled react-select-solid'
                  classNamePrefix='react-select'
                  options={categoryOptions}
                  placeholder='Category'
                  value={currentCategoryId ? categoryOptions.find((opt) => opt.value === currentCategoryId) ?? null : null}
                  onChange={(selectedOption: SingleValue<OptionType>) => {
                    handleCategoryChange(selectedOption?.value || null);
                  }}
                  isClearable
                />
              </div>
              {/* end::Input group */}

              {/* begin::Input group - Status */}
              <div className='mb-10' onClick={handleSelectClick}>
                <Select
                  className='react-select-styled react-select-solid'
                  classNamePrefix='react-select'
                  options={statusOptions}
                  placeholder='Status'
                  value={currentStatus !== null ? statusOptions.find((opt) => opt.value === currentStatus.toString()) ?? null : null}
                  onChange={(selectedOption: SingleValue<OptionType>) => {
                    handleStatusChange(selectedOption?.value || null);
                  }}
                  isClearable
                />
              </div>
              {/* end::Input group */}

              {/* begin::Actions */}
              <div className='d-flex justify-content-end'>
                <button
                  type='button'
                  disabled={false}
                  onClick={handleReset}
                  className='btn btn-light btn-active-light-primary fw-bold me-2 px-6'
                  data-kt-menu-dismiss='true'
                  data-kt-user-table-filter='reset'
                >
                  Reset
                </button>
                <button
                  disabled={false}
                  type='button'
                  onClick={handleApply}
                  className='btn btn-primary fw-bold px-6'
                  data-kt-menu-dismiss='true'
                  data-kt-user-table-filter='filter'
                >
                  Apply
                </button>
              </div>
              {/* end::Actions */}
            </div>
            {/* end::Content */}
          </div>
          {/* end::SubMenu */}

          {/* begin::Categories button */}
          <a
            href='./categories'
            className='btn btn-light-primary me-3'
          >
            <KTIcon iconName='folder' className='fs-2' />
            Categories
          </a>
          {/* end::Categories button */}

          {/* begin::Add product */}
          <button
            onClick={() => navigate('/products/list/add')}
            type='button'
            className='btn btn-primary'
          >
            <KTIcon iconName='plus' className='fs-2' />
            Add Product
          </button>
          {/* end::Add product */}
        </div>
      </div>
    </div>
  );
}; 