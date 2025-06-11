import React, { useRef, useEffect } from 'react'
import Flatpickr from 'react-flatpickr'
import {KTIcon} from '../../../../_metronic/helpers'
import Select from 'react-select'
import { OrderToolbar } from './OrderToolbar'
import { useDispatch, useSelector } from 'react-redux'
import { 
  RootState,
  AppDispatch 
} from '../../../redux/store'
import { 
  setSearchTerm, 
  fetchOrderList, 
  formatDateForAPI 
} from '../../../redux/order/orderSlice'
import { getCategories } from '../../../redux/category/category.slice'

// -------------------------------------------------------
// Header Widget Props
// -------------------------------------------------------
export interface AllOrdersHeaderProps {
  // Search
  searchTerm: string
  onSearchChange: (value: string) => void

  // Date Filters
  dateTypeFilter: string
  onDateTypeChange: (value: string) => void

  dateRange: {
    startDate: Date | null
    endDate: Date | null
  }
  onStartDateChange: (dates: Date[]) => void
  onEndDateChange: (dates: Date[]) => void

  // Customer Filter
  customerFilter: string
  onCustomerChange: (value: string) => void

  // Filter Reset
  onFilterReset: () => void

  // Apply Filters
  onApplyFilters: () => void

  // Export
  onExport: () => void

  // New customers prop from redux
  customers: any[]
}

export const AllOrdersHeader: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { 
    searchTerm, 
    dateRange, 
    customerFilter 
  } = useSelector((state: RootState) => state.orderReducer)
  
  // Fetch categories on component mount
  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  // Handler for search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    dispatch(setSearchTerm(value));
    
    // Immediately fetch orders when search term changes
    dispatch(fetchOrderList({
      offset: 1, // Reset to first page when search changes
      searchvalue: value, // Use the new search value directly
      from_date: formatDateForAPI(dateRange.startDate),
      to_date: formatDateForAPI(dateRange.endDate),
      customer_id: customerFilter
    }));
  }

  return (
    <div className='card-header border-0 pt-5'>
      {/* SEARCH */}
      <div className='card-title'>
        <div className='d-flex align-items-center position-relative my-1'>
          <KTIcon iconName='magnifier' className='fs-1 position-absolute ms-6' />
          <input
            type='text'
            data-kt-user-table-filter='search'
            className='form-control form-control-solid w-250px ps-14'
            placeholder='Search Orders'
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {/* FILTER & EXPORT TOOLBAR */}
      <OrderToolbar />
    </div>
  )
} 