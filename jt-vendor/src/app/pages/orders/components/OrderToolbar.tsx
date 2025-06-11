import React, { FC, useState, useRef, useEffect } from 'react'
import Flatpickr from 'react-flatpickr'
import { useNavigate } from 'react-router-dom'
import { KTIcon } from '../../../../_metronic/helpers'
import Select from 'react-select'
import { useDispatch, useSelector } from 'react-redux'
import { 
  RootState, 
  AppDispatch 
} from '../../../redux/store'
import {
  setCustomerFilter,
  setDateTypeFilter,
  setStartDate,
  setEndDate,
  applyFiltersAndFetch,
  resetFilters
} from '../../../redux/order/orderSlice'

export const OrderToolbar: FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate();
  const {
    customers = [],
    customerFilter,
    dateTypeFilter,
    dateRange
  } = useSelector((state: RootState) => state.orderReducer)
  
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const filterMenuRef = useRef<HTMLDivElement>(null);
  
  // Handle clicking outside to close the filter menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target as Node) && 
          !(event.target as Element).closest('[data-kt-menu-trigger="click"]')) {
        // Check if the click is not on flatpickr calendar or a flatpickr-related element
        const isDatePickerClick = (event.target as Element).closest('.flatpickr-calendar') !== null;
        if (!isDatePickerClick) {
          setIsFilterMenuOpen(false);
        }
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
  
  // Handle customer selection change
  const handleCustomerSelectChange = (option: any) => {
    const value = String(option?.value ?? '');
    dispatch(setCustomerFilter(value));
  };
  
  // Handle date type change
  const handleDateTypeSelectChange = (option: any) => {
    const value = option?.value ?? '';
    dispatch(setDateTypeFilter(value));
  };
  
  // Stop propagation on datepicker interaction
  const handleDatePickerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
  // Add event listeners to capture flatpickr events
  useEffect(() => {
    // Add global event listener for flatpickr-related events
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as Element;
    };
    
    document.addEventListener('click', handleDocumentClick, true);
    
    return () => {
      document.removeEventListener('click', handleDocumentClick, true);
    };
  }, []);

  const dateOptions = [
    { value: '', label: 'All Dates' },
    { value: 'ThisYear', label: 'This Year' },
    { value: 'ThisMonth', label: 'This Month' },
    { value: 'ThisWeek', label: 'This Week' },
    { value: 'CustomDate', label: 'Custom Date' },
  ];

  // Map customers array to select options
  const customerOptions = [
    { value: '', label: 'All Customers' },
    ...(customers || []).map((cust) => ({
      value: cust.id,
      label: `${cust.f_name || ''} ${cust.l_name || ''}`,
    })),
  ];

  // Find the selected options for the Select components
  const selectedCustomerOption = customerOptions.find((c) => String(c.value) === customerFilter) || null;
  const selectedDateOption = dateOptions.find((d) => d.value === dateTypeFilter) || null;

  // Handle date changes
  const handleStartDateChange = (dates: Date[]) => {
    dispatch(setStartDate(dates[0] || null));
  };

  const handleEndDateChange = (dates: Date[]) => {
    dispatch(setEndDate(dates[0] || null));
  };

  // Handle applying filters
  const handleApplyFilters = () => {
    dispatch(applyFiltersAndFetch());
  };

  // Handle resetting filters
  const handleResetFilters = () => {
    dispatch(resetFilters());
    setIsFilterMenuOpen(false);
  };

  // Handle export
  const handleExport = () => {
    const { orders = [] } = useSelector((state: RootState) => state.orderReducer);
    
    let csv = 'Order ID,Date,Payment,Customer,Phone,Total,Status\n';
    orders.forEach((item: any) => {
      const formattedDate = new Date(item.created_at).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      });
      const payment = item.payment_status;
      const customerName = !item.billing_address_data?.contact_person_name ? 'Guest' : item.billing_address_data.contact_person_name;
      const phone = item.billing_address_data?.phone || '';
      const total = item.total_product_price.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      const status = item.order_status === 'confirmed' ? 'Paid' : item.order_status;
      csv += `${item.id},${formattedDate},${payment},${customerName},${phone},$ ${total},${status}\n`;
    });
  
    const blob = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'orders.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className='card-toolbar'>
      {/* begin::Menu */}
      <div className='d-flex justify-content-end' data-kt-order-table-toolbar='base'>
        <button
          disabled={false}
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
          }}>
          {/* begin::Header */}
          <div className='px-7 py-5'>
            <div className='fs-5 text-gray-900 fw-bolder'>Filter Options</div>
          </div>
          {/* end::Header */}

          {/* begin::Separator */}
          <div className='separator border-gray-200'></div>
          {/* end::Separator */}

          {/* begin::Content */}
          <div className='px-7 py-5' data-kt-order-table-filter='form'>
            {/* begin::Input group */}
            <div className='mb-10' onClick={handleSelectClick}>
              <Select 
                className='react-select-styled react-select-solid' 
                classNamePrefix='react-select' 
                options={customerOptions} 
                placeholder='Customer' 
                onChange={handleCustomerSelectChange}
                value={selectedCustomerOption}
                getOptionLabel={(option: any) => option.label}
                getOptionValue={(option: any) => String(option.value)}
              />
            </div>
            {/* end::Input group */}

            {/* begin::Input group */}
            <div className='mb-10' onClick={handleSelectClick}>
              <Select 
                className='react-select-styled react-select-solid' 
                classNamePrefix='react-select' 
                options={dateOptions} 
                placeholder='Date Type' 
                onChange={handleDateTypeSelectChange}
                value={selectedDateOption}
              />
            </div>

            {/* Show date pickers only when Custom Date option is selected */}
            {dateTypeFilter === 'CustomDate' && (
              <>
                <div className='mb-10' onClick={handleDatePickerClick}>
                  <label className="form-label fw-bold">Start Date:</label>
                  
                  <Flatpickr
                    value={dateRange.startDate || undefined}
                    onChange={handleStartDateChange}
                    className='form-control form-control-solid'
                    placeholder='Start Date'
                    options={{
                      dateFormat: 'Y-m-d',
                      allowInput: true,
                      enableTime: false,
                      onOpen: () => {
                        // Ensure the dropdown stays open when calendar is shown
                        setTimeout(() => setIsFilterMenuOpen(true), 0);
                      }
                    }}
                  />
                </div>

                <div className='mb-10' onClick={handleDatePickerClick}>
                  <label className="form-label fw-bold">End Date:</label>
                  <Flatpickr
                    value={dateRange.endDate || undefined}
                    onChange={handleEndDateChange}
                    className='form-control form-control-solid'
                    placeholder='End Date'
                    options={{
                      dateFormat: 'Y-m-d',
                      allowInput: true,
                      enableTime: false,
                      onOpen: () => {
                        // Ensure the dropdown stays open when calendar is shown
                        setTimeout(() => setIsFilterMenuOpen(true), 0);
                      }
                    }}
                  />
                </div>
              </>
            )}
            
            {/* begin::Actions */}
            <div className='d-flex justify-content-end'>
              <button
                type='button'
                disabled={false}
                onClick={handleResetFilters}
                className='btn btn-light btn-active-light-primary fw-bold me-2 px-6'
                data-kt-menu-dismiss='true'
                data-kt-user-table-filter='reset'
              >
                Reset
              </button>
              <button
                disabled={false}
                type='button'
                onClick={handleApplyFilters}
                className='btn btn-primary fw-bold px-6'
                data-kt-menu-dismiss='false'
                data-kt-user-table-filter='filter'
              >
                Apply
              </button>
            </div>
            {/* end::Actions */}
          </div>
          {/* end::Content */}
        </div>

        {/* begin::Export */}
        <button type='button' className='btn btn-light-primary me-3' onClick={handleExport}>
          <KTIcon iconName='exit-up' className='fs-2' />
          Export
        </button>
        {/* end::Export */}

        {/* begin::Add user */}
        <a onClick={() => navigate(`/orders/list/all/order_add`)} type='button' className='btn btn-primary'>
          <KTIcon iconName='plus' className='fs-2' />
          Add Order
        </a>
        {/* end::Add user */}
      </div>
    </div>
  );
}; 