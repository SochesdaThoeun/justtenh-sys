import React, { useState, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../redux/store'
import { fetchCustomers, addCustomer, resetAddCustomerState } from '../../redux/customer/customer.slice'
import { CustomerModel, AddCustomerParams, AddCustomerFormData } from '../../redux/customer/customer.models'
import { KTIcon } from '@/_metronic/helpers'

// Import widgets
import { CustomerFilterWidget } from './widgets/CustomerFilterWidget'
import { CustomerTableWidget, DisplayCustomer } from './widgets/CustomerTableWidget'
import { AddCustomerModal } from './widgets/AddCustomerModal'
import { exportCustomersToCSV } from './widgets/utils/exportUtils'

interface AlertMessage {
  show: boolean;
  type: 'success' | 'error';
  text: string;
}

const AllCustomerPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { customers, total, loading, limit, offset, addCustomerStatus, addCustomerError } = useSelector(
    (state: RootState) => state.customer
  )

  // -----------------------------------------
  // ALERT STATE
  // -----------------------------------------
  const [alertMessage, setAlertMessage] = useState<AlertMessage>({
    show: false,
    type: 'success',
    text: '',
  })

  // -----------------------------------------
  // SEARCH & FILTER STATE
  // -----------------------------------------
  const [searchValue, setSearchValue] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  // -----------------------------------------
  // PAGINATION STATE
  // -----------------------------------------
  const [currentPage, setCurrentPage] = useState(0)
  const entriesPerPage = 10

  // -----------------------------------------
  // DATA FETCHING
  // -----------------------------------------
  useEffect(() => {
  
    // Use the enhanced fetchCustomers with search capability
    dispatch(fetchCustomers({ 
      offset: currentPage, 
      limit: entriesPerPage,
      searchValue: searchValue.trim() !== '' ? searchValue : undefined
    }))
  }, [dispatch, currentPage, entriesPerPage, searchValue])

  // Log customer data from redux
  useEffect(() => {
  
  }, [customers, total, loading, currentPage, entriesPerPage, searchValue, statusFilter]);

  // -----------------------------------------
  // HANDLE ADD CUSTOMER STATUS CHANGES
  // -----------------------------------------
  useEffect(() => {
    if (addCustomerStatus === 'succeeded') {
      // Show success alert
      setAlertMessage({
        show: true,
        type: 'success',
        text: 'Customer was added successfully',
      })
      
      // Reset form and close modal
      handleAddCustomerDiscard()
      
      // Hide Bootstrap modal using jQuery
      if (typeof window !== 'undefined') {
        const modal = document.getElementById('kt_modal_add_customer')
        if (modal) {
          // Close the modal
          const modalInstance = window.bootstrap?.Modal.getInstance(modal)
          modalInstance?.hide()
        }
      }
      
      // Reset add customer state after a delay
      setTimeout(() => {
        dispatch(resetAddCustomerState())
      }, 1000)
      
      // Hide alert after 5 seconds
      setTimeout(() => {
        setAlertMessage(prev => ({ ...prev, show: false }))
      }, 5000)
    } else if (addCustomerStatus === 'failed') {
      // Show error alert
      setAlertMessage({
        show: true,
        type: 'error',
        text: addCustomerError || 'An error occurred while adding the customer',
      })
      
      // Hide alert after 5 seconds
      setTimeout(() => {
        setAlertMessage(prev => ({ ...prev, show: false }))
      }, 5000)
    }
  }, [addCustomerStatus, addCustomerError, dispatch])

  // -----------------------------------------
  // TRANSFORM CUSTOMER DATA FOR DISPLAY
  // -----------------------------------------
  const transformedCustomers: DisplayCustomer[] = useMemo(() => {
    const transformed = customers.map((customer: CustomerModel) => {
      return {
        name: customer.name || `${customer.f_name} ${customer.l_name}`,
        profileUrl: `./details/${customer.id}`,
        email: customer.email,
        location: `${customer.city || ''} ${customer.country || ''}`.trim() || 'Not specified',
        date: new Date(customer.created_at).toLocaleDateString('en-GB', { 
          day: '2-digit', 
          month: '2-digit', 
          year: '2-digit', 
          hour: '2-digit', 
          minute: '2-digit', 
          second: '2-digit' 
        }),
      }
    });
    return transformed;
  }, [customers])

  // -----------------------------------------
  // FILTERED DATA (useMemo)
  // -----------------------------------------
  const filteredCustomers = useMemo(() => {
    // Only apply status filtering client-side, as search is now handled server-side
    const filtered = transformedCustomers.filter((customer) => {
      // Apply status filter (would ideally be done on the API side)
      if (statusFilter && statusFilter !== 'all') {
        // This is a placeholder for status filtering
        // In a real app, you would have a status property to filter on
        return true // For now, ignore status filtering since we don't have this data
      }
      
      return true
    });
    return filtered;
  }, [transformedCustomers, statusFilter])

  // -----------------------------------------
  // PAGINATION LOGIC
  // -----------------------------------------
  const handlePageChange = (page: number) => {
    
    setCurrentPage(page)
  }

  // -----------------------------------------
  // FILTER HANDLERS
  // -----------------------------------------
  const handleReset = () => {
    setSearchValue('')
    setStatusFilter('')
    setCurrentPage(1) // Reset to first page when clearing filters
  }

  const handleApply = () => {
    // Apply filters and reset to first page
    setCurrentPage(1)
  }

  // -----------------------------------------
  // CSV EXPORT
  // -----------------------------------------
  const handleExportCSV = () => {
    exportCustomersToCSV(filteredCustomers)
  }

  // -----------------------------------------
  // ADD CUSTOMER FORM STATE
  // -----------------------------------------
  const [addCustomerForm, setAddCustomerForm] = useState<AddCustomerFormData>({
    f_name: '',
    l_name: '',
    email: '',
    phone: '',
    country: '',
    city: '',
    zip_code: '',
    address: '',
  })

  const handleAddCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setAddCustomerForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleAddCustomerSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Create customer data that matches our API requirements
    const customerData: AddCustomerParams = {
      f_name: addCustomerForm.f_name,
      l_name: addCustomerForm.l_name,
      email: addCustomerForm.email,
      phone: addCustomerForm.phone,
      country: addCustomerForm.country,
      city: addCustomerForm.city,
      zip_code: addCustomerForm.zip_code,
      address: addCustomerForm.address
    }
    
    // Dispatch the addCustomer action
    dispatch(addCustomer(customerData))
  }

  const handleAddCustomerDiscard = () => {
    // Reset the form
    setAddCustomerForm({
      f_name: '',
      l_name: '',
      email: '',
      phone: '',
      country: '',
      city: '',
      zip_code: '',
      address: '',
    })
  }

  // -----------------------------------------
  // RENDER
  // -----------------------------------------
  return (
    <>
      <div className='card'>
        {/* Alert Message */}
        {alertMessage.show && (
          <div className={`alert alert-${alertMessage.type === 'success' ? 'success' : 'danger'} d-flex align-items-center p-5 mb-10`}>
            <span className="svg-icon svg-icon-2hx me-4">
              <KTIcon className={`fs-1 text-${alertMessage.type === 'success' ? 'success' : 'danger'}`} iconName={alertMessage.type === 'success' ? 'check-circle' : 'cross-circle'} />
            </span>
            <div className="d-flex flex-column">
              <h5 className="mb-1">{alertMessage.type === 'success' ? 'Success' : 'Failed'}</h5>
              <span>{alertMessage.text}</span>
            </div>
          </div>
        )}

        {/* Filter Widget */}
        <CustomerFilterWidget
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          handleReset={handleReset}
          handleApply={handleApply}
          handleExportCSV={handleExportCSV}
        />

        {/* Table Widget */}
        <CustomerTableWidget
          loading={loading}
          customers={filteredCustomers}
          entriesPerPage={entriesPerPage}
          total={total}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Add Customer Modal */}
      <AddCustomerModal
        formData={addCustomerForm}
        handleChange={handleAddCustomerChange}
        handleSubmit={handleAddCustomerSubmit}
        handleDiscard={handleAddCustomerDiscard}
        isLoading={addCustomerStatus === 'loading'}
      />
    </>
  )
}

export default AllCustomerPage
