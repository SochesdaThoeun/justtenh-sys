import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/light.css';
import { PaginationWidget } from '../../components/common/PaginationWidget';
import { useDispatch, useSelector } from 'react-redux';
import { fetchShippingCost } from '@/app/redux/statistic/statistic.slice';
import { ShippingCostParams, ShippingCostStats } from '@/app/redux/statistic/statistic.models';
import { RootState } from '@/app/redux/store';

// Define type for static table data
interface TableDataItem {
  date: string;
  shippingType: string;
  shippingId: string;
  link: string;
  status: string;
  orders: number;
  total: string;
}

const ShippingReportPage = () => {
  const dispatch = useDispatch();
  const { shippingCost, isLoading, error } = useSelector((state: RootState) => state.statistic);
  
  // Example data array, extracted from your table rows.
  // Each object here represents one row.
  // You can fetch this data from an API, or pass it in as props, etc.
  const [shippingData] = useState<TableDataItem[]>([
    {
      date: 'Oct 25, 2024',
      shippingType: 'Flat Shipping Rate',
      shippingId: '#SHP-0034892',
      link: 'apps/ecommerce/sales/details.html',
      status: 'Completed',
      orders: 19,
      total: '$243.00',
    },
    {
      date: 'Oct 25, 2024',
      shippingType: 'Flat Shipping Rate',
      shippingId: '#SHP-0039182',
      link: 'apps/ecommerce/sales/details.html',
      status: 'Completed',
      orders: 6,
      total: '$189.00',
    },
    {
      date: 'Nov 10, 2024',
      shippingType: 'Flat Shipping Rate',
      shippingId: '#SHP-0031104',
      link: 'apps/ecommerce/sales/details.html',
      status: 'Completed',
      orders: 16,
      total: '$572.00',
    },
    {
      date: 'Dec 20, 2024',
      shippingType: 'Flat Shipping Rate',
      shippingId: '#SHP-0069041',
      link: 'apps/ecommerce/sales/details.html',
      status: 'Cancelled',
      orders: 17,
      total: '$524.00',
    },
    {
      date: 'Jul 25, 2024',
      shippingType: 'Flat Shipping Rate',
      shippingId: '#SHP-0030880',
      link: 'apps/ecommerce/sales/details.html',
      status: 'Completed',
      orders: 14,
      total: '$236.00',
    },
    // ... Continue adding the rest of your rows here ...
    {
      date: 'Jul 25, 2024',
      shippingType: 'Flat Shipping Rate',
      shippingId: '#SHP-0053275',
      link: 'apps/ecommerce/sales/details.html',
      status: 'Completed',
      orders: 3,
      total: '$168.00',
    },
  ]);

  // Example status options for react-select
  const statusOptions = [
    { value: 'all', label: 'All' },
    { value: 'Completed', label: 'Completed' },
    { value: 'In Transit', label: 'In Transit' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Cancelled', label: 'Cancelled' },
  ];

  // State for selected shipping method
  const [selectedStatus, setSelectedStatus] = useState<{ value: string, label: string } | null>(null);
  const [dateRange, setDateRange] = useState<Date[]>([]);

  // For pagination
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 10;                      // Just an example
  
  // Use API data or fallback to static data
  const totalEntries = shippingCost?.total_size || shippingData.length;

  // Load shipping cost data on component mount and when parameters change
  useEffect(() => {
    const params: ShippingCostParams = {
      limit: entriesPerPage,
      offset: currentPage
    };
    
    // Add shipping method if selected (except 'all')
    if (selectedStatus && selectedStatus.value !== 'all') {
      params.shipping_method_id = selectedStatus.value;
    }
    
    dispatch(fetchShippingCost(params) as any);
  }, [dispatch, currentPage, entriesPerPage, selectedStatus]);
  
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset to first page
    setCurrentPage(1);
    
    // Prepare parameters
    const params: ShippingCostParams = {
      limit: entriesPerPage,
      offset: 1
    };
    
    // Add shipping method if selected (except 'all')
    if (selectedStatus && selectedStatus.value !== 'all') {
      params.shipping_method_id = selectedStatus.value;
    }
    
    dispatch(fetchShippingCost(params) as any);
  };

  // Helper function to pick the correct badge class based on status
  const getBadgeClass = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'badge badge-light-success';
      case 'Cancelled':
        return 'badge badge-light-danger';
      case 'In Transit':
        return 'badge badge-light-primary';
      case 'Pending':
        return 'badge badge-light-warning';
      default:
        return 'badge badge-light-success';
    }
  };
  
  // Use API data if available, otherwise use static data
  const currentPageData = shippingCost?.shipping || 
    shippingData.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);
  
  // Helper functions to handle different data structures
  const renderDate = (item: ShippingCostStats | TableDataItem) => {
    return item.date;
  };
  
  const renderShippingType = (item: ShippingCostStats | TableDataItem) => {
    return 'shipping_type' in item ? item.shipping_type : item.shippingType;
  };
  
  const renderShippingId = (item: ShippingCostStats | TableDataItem) => {
    return 'shipping_id' in item ? item.shipping_id : item.shippingId;
  };
  
  const renderStatus = (item: ShippingCostStats | TableDataItem) => {
    return item.status;
  };
  
  const renderOrders = (item: ShippingCostStats | TableDataItem) => {
    return 'no_orders' in item ? item.no_orders : item.orders;
  };
  
  const renderTotal = (item: ShippingCostStats | TableDataItem) => {
    if ('total' in item) {
      return typeof item.total === 'number' ? `$${item.total.toFixed(2)}` : item.total;
    }
    return '';
  };

  return (
    <div className="card card-flush">
      {/* begin::Card header */}
      <div className="card-header align-items-center py-5 gap-2 gap-md-5">
        {/* begin::Card title */}
        <div className="card-title">
          {/* begin::Search */}
          <div className="d-flex align-items-center position-relative my-1">
            <i className="ki-duotone ki-magnifier fs-3 position-absolute ms-4">
              <span className="path1"></span>
              <span className="path2"></span>
            </i>
            <input
              type="text"
              data-kt-ecommerce-order-filter="search"
              className="form-control form-control-solid w-250px ps-12"
              placeholder="Search Report"
            />
          </div>
          {/* end::Search */}
          {/* begin::Export buttons */}
          <div id="kt_ecommerce_report_shipping_export" className="d-none"></div>
          {/* end::Export buttons */}
        </div>
        {/* end::Card title */}
        {/* begin::Card toolbar */}
        <div className="card-toolbar flex-row-fluid justify-content-end gap-5">
          {/* begin::Daterangepicker -> replaced with Flatpickr */}
          <Flatpickr
            options={{ mode: 'range' }}
            className="form-control form-control-solid w-100 mw-250px"
            placeholder="Pick date range"
            id="kt_ecommerce_report_shipping_daterangepicker"
            value={dateRange}
            onChange={(selectedDates: Date[]) => setDateRange(selectedDates)}
          />
          {/* end::Daterangepicker */}

          {/* begin::Filter -> replaced with react-select but preserve container and data attributes */}
          <div
            className="w-150px"
            data-control="select2"
            data-hide-search="true"
            data-placeholder="Status"
            data-kt-ecommerce-order-filter="status"
          >
            <Select
              className="react-select-styled react-select-solid"
              classNamePrefix="react-select"
              placeholder="Status"
              isSearchable={false}
              options={statusOptions}
              value={selectedStatus}
              onChange={(option) => setSelectedStatus(option)}
            />
          </div>
          {/* end::Filter */}

          {/* begin::Export dropdown -> replaced button with <a> */}
          <a
            href="#"
            className="btn btn-light-primary"
            data-kt-menu-trigger="click"
            data-kt-menu-placement="bottom-end"
            onClick={handleSubmit}
          >
            <i className="ki-duotone ki-exit-up fs-2">
              <span className="path1"></span>
              <span className="path2"></span>
            </i>
            Export Report
          </a>
          {/* begin::Menu */}
          <div
            id="kt_ecommerce_report_shipping_export_menu"
            className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-semibold fs-7 w-200px py-4"
            data-kt-menu="true"
          >
            <div className="menu-item px-3">
              <a href="#" className="menu-link px-3" data-kt-ecommerce-export="copy">
                Copy to clipboard
              </a>
            </div>
            <div className="menu-item px-3">
              <a href="#" className="menu-link px-3" data-kt-ecommerce-export="excel">
                Export as Excel
              </a>
            </div>
            <div className="menu-item px-3">
              <a href="#" className="menu-link px-3" data-kt-ecommerce-export="csv">
                Export as CSV
              </a>
            </div>
            <div className="menu-item px-3">
              <a href="#" className="menu-link px-3" data-kt-ecommerce-export="pdf">
                Export as PDF
              </a>
            </div>
          </div>
          {/* end::Menu */}
          {/* end::Export dropdown */}
        </div>
        {/* end::Card toolbar */}
      </div>
      {/* end::Card header */}

      {/* begin::Card body */}
      <div className="card-body pt-0">
        {/* Loading indicator */}
        {isLoading && (
          <div className="d-flex justify-content-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
        
        {/* Error message */}
        {error && (
          <div className="alert alert-danger">
            {typeof error === 'string' ? error : 'Failed to load shipping cost data'}
          </div>
        )}
        
        {/* begin::Table */}
        {!isLoading && !error && (
          <>
            <table
              className="table align-middle table-row-dashed fs-6 gy-5"
              id="kt_ecommerce_report_shipping_table"
            >
              <thead>
                <tr className="text-start text-gray-500 fw-bold fs-7 text-uppercase gs-0">
                  <th className="min-w-100px">Date</th>
                  <th className="min-w-100px">Shipping Type</th>
                  <th className="min-w-100px">Shipping ID</th>
                  <th className="min-w-100px">Status</th>
                  <th className="text-end min-w-75px">No. Orders</th>
                  <th className="text-end min-w-100px">Total</th>
                </tr>
              </thead>
              <tbody className="fw-semibold text-gray-600">
                {currentPageData.map((row, index) => (
                  <tr key={index}>
                    <td>{renderDate(row)}</td>
                    <td>{renderShippingType(row)}</td>
                    <td>
                      <a href="#" className="text-gray-900 text-hover-primary">
                        {renderShippingId(row)}
                      </a>
                    </td>
                    <td>
                      {/* begin::Badges */}
                      <div className={getBadgeClass(renderStatus(row))}>
                        {renderStatus(row)}
                      </div>
                      {/* end::Badges */}
                    </td>
                    <td className="text-end pe-0">{renderOrders(row)}</td>
                    <td className="text-end">{renderTotal(row)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
        
            {/* begin::Pagination */}
            <PaginationWidget
              totalEntries={totalEntries}
              entriesPerPage={entriesPerPage}
              onPageChange={handlePageChange}
            />
            {/* end::Pagination */}
          </>
        )}
      </div>
      {/* end::Card body */}
    </div>
  );
};

export default ShippingReportPage;
