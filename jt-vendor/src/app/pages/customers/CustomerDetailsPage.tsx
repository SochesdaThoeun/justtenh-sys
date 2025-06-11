import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/redux/store';
import { fetchCustomerDetails } from '@/app/redux/customer/customer.slice';
import SidebarWidget from './widgets/SidebarWidget';
import OverviewWidget from './widgets/OverviewWidget';
import GeneralSettingsWidget from './widgets/GeneralSettingsWidget';
import AdvancedSettingsWidget from './widgets/AdvancedSettingsWidget';

export default function CustomerDetailsPage() {
  // Get customer ID from URL params
  const { customerId } = useParams<{ customerId: string }>();
  const dispatch = useDispatch();
  const { currentCustomer, customerDetailsLoading } = useSelector((state: RootState) => state.customer);

  // Pagination states
  const entriesPerPage = 5;  // how many entries you want per page
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch customer details when the component mounts
  useEffect(() => {
    if (customerId) {
      dispatch(fetchCustomerDetails(customerId) as any);
    }
  }, [dispatch, customerId]);

  // Called whenever the page changes
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Transform customer data for the sidebar if available
  const customerInfo = currentCustomer
    ? {
        avatar: currentCustomer.image_full_url?.path || 'assets/media/avatars/blank.png',
        name: `${currentCustomer.f_name} ${currentCustomer.l_name}`,
        email: currentCustomer.email,
        accountId: `ID-${currentCustomer.id}`,
        billingEmail: currentCustomer.email,
        deliveryAddress: currentCustomer.street_address
          ? `${currentCustomer.street_address},
${currentCustomer.city || ''} ${currentCustomer.zip || ''}
${currentCustomer.country || ''}`
          : 'No address provided',
        language: currentCustomer.app_language || 'English',
        latestTransaction: '#N/A',
        statusTag: currentCustomer.is_active ? 'Active user' : 'Inactive user',
      }
    : {
        avatar: 'assets/media/avatars/300-1.jpg',
        name: 'Loading...',
        email: '',
        accountId: '',
        billingEmail: '',
        deliveryAddress: '',
        language: '',
        latestTransaction: '',
        statusTag: '',
      };

  // Example transaction data used in the Overview tab:
  const transactionData = [
    { orderNo: '#15124', status: 'Successful', amount: '$1,200.00', rewards: '0.00', date: '14 Dec 2020, 8:43 pm' },
    { orderNo: '#14956', status: 'Successful', amount: '$79.00', rewards: '0.00', date: '01 Dec 2020, 10:12 am' },
    { orderNo: '#14871', status: 'Successful', amount: '$5,500.00', rewards: '0.00', date: '12 Nov 2020, 2:01 pm' },
    { orderNo: '#14566', status: 'Pending', amount: '$880.00', rewards: '0.00', date: '21 Oct 2020, 5:54 pm' },
    { orderNo: '#15359', status: 'Successful', amount: '$7,650.00', rewards: '0.00', date: '19 Oct 2020, 7:32 am' },
    // ... add more rows as needed
  ];

  // Example callback from child widget
  const handleProfileSubmit = (data: any) => {
    //console.log('Profile Data from child:', data);
  };

  if (customerDetailsLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '500px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column flex-xl-row">
      {/* Sidebar, passing JSON data */}
      <SidebarWidget customerInfo={customerInfo} />

      {/* Right side content */}
      <div className="flex-lg-row-fluid ms-lg-15">
        {/* Tabs */}
        <ul className="nav nav-custom nav-tabs nav-line-tabs nav-line-tabs-2x border-0 fs-4 fw-semibold mb-8">
          <li className="nav-item">
            <a
              className="nav-link text-active-primary pb-4 active"
              data-bs-toggle="tab"
              href="#kt_ecommerce_customer_overview"
            >
              Overview
            </a>
          </li>
        
        </ul>

        {/* Tab panes */}
        <div className="tab-content" id="myTabContent">
          {/* Overview tab */}
          <OverviewWidget
            transactionData={transactionData}
            entriesPerPage={entriesPerPage}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            customerId={customerId}
          />
        </div>
      </div>

      {/* ---- Modals ---- */}
      {/* Example: Update Address Modal */}
      <div className="modal fade" id="kt_modal_update_address" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered mw-650px">
          <div className="modal-content">
            <form
              className="form"
              id="kt_modal_update_address_form"
              onSubmit={(e) => {
                e.preventDefault();
                //console.log('Update Address form submitted!');
              }}
            >
              <div className="modal-header" id="kt_modal_update_address_header">
                <h2 className="fw-bold">Update Address</h2>
                <div
                  id="kt_modal_update_address_close"
                  className="btn btn-icon btn-sm btn-active-icon-primary"
                  data-bs-dismiss="modal"
                  style={{ cursor: 'pointer' }}
                >
                  <i className="ki-duotone ki-cross fs-1">
                    <span className="path1"></span>
                    <span className="path2"></span>
                  </i>
                </div>
              </div>
              <div className="modal-body py-10 px-lg-17">
                <div className="fw-bold fs-3 rotate collapsible collapsed mb-7">
                  Shipping Information
                </div>
                <div className="d-flex flex-column mb-7 fv-row">
                  <label className="fs-6 fw-semibold mb-2 required">Address Line 1</label>
                  <input
                    className="form-control form-control-solid"
                    name="address1"
                    defaultValue="101, Collins Street"
                  />
                </div>

                <div className="d-flex flex-column mb-7 fv-row">
                  <label className="fs-6 fw-semibold mb-2 required">City / Town</label>
                  <input
                    className="form-control form-control-solid"
                    name="city"
                    defaultValue="Melbourne"
                  />
                </div>

                <div className="row g-9 mb-7">
                  <div className="col-md-6 fv-row">
                    <label className="fs-6 fw-semibold mb-2 required">State / Province</label>
                    <input
                      className="form-control form-control-solid"
                      name="state"
                      defaultValue="Victoria"
                    />
                  </div>
                  <div className="col-md-6 fv-row">
                    <label className="fs-6 fw-semibold mb-2 required">Post Code</label>
                    <input
                      className="form-control form-control-solid"
                      name="postcode"
                      defaultValue="3000"
                    />
                  </div>
                </div>

                <div className="d-flex flex-column mb-7 fv-row">
                  <label className="fs-6 fw-semibold mb-2">
                    <span className="required">Country</span>
                    <span className="ms-1" data-bs-toggle="tooltip" title="Country of origination">
                      <i className="ki-duotone ki-information-5 text-gray-500 fs-6">
                        <span className="path1"></span>
                        <span className="path2"></span>
                        <span className="path3"></span>
                      </i>
                    </span>
                  </label>
                  <select
                    name="country"
                    aria-label="Select a Country"
                    data-control="select2"
                    data-placeholder="Select a Country..."
                    data-dropdown-parent="#kt_modal_update_address"
                    className="form-select form-select-solid fw-bold"
                    defaultValue="AU"
                  >
                    <option value="">Select a Country...</option>
                    <option value="AF">Afghanistan</option>
                    <option value="AU">Australia</option>
                    <option value="US">United States</option>
                    {/* ...add more countries as needed... */}
                  </select>
                </div>
              </div>
              <div className="modal-footer flex-center">
                <a
                  href="#"
                  id="kt_modal_update_address_cancel"
                  className="btn btn-light me-3"
                  data-bs-dismiss="modal"
                  style={{ cursor: 'pointer' }}
                >
                  Discard
                </a>
                <a
                  href="#"
                  id="kt_modal_update_address_submit"
                  className="btn btn-primary"
                  onClick={(e) => {
                    e.preventDefault();
                    //console.log('Update Address: Submitting...');
                  }}
                  style={{ cursor: 'pointer' }}
                  data-bs-dismiss="modal"
                >
                  <span className="indicator-label">Submit</span>
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Add other modals if needed */}
    </div>
  );
}
