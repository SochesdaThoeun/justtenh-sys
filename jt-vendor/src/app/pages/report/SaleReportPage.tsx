import React, { useState, useEffect } from 'react';
// If you have selects in your original code, you can import and replace them with react-select:
// import Select from 'react-select';

// For the date picker, install and import Flatpickr
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/light.css'; // Choose the appropriate theme
import { PaginationWidget } from '../../components/common/PaginationWidget';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrdersPerDay } from '@/app/redux/statistic/statistic.slice';
import { OrdersPerDayParams, OrdersPerDayStats } from '@/app/redux/statistic/statistic.models';
import { RootState } from '@/app/redux/store';

// Define type for static table data
interface TableDataItem {
  date: string;
  orders: number;
  products: number;
  tax: string;
  total: string;
}

const SalesReportPage = () => {
  const dispatch = useDispatch();
  const { ordersPerDay, isLoading, error } = useSelector((state: RootState) => state.statistic);
  
  // ----------------------------------------------------------------
  // 1) State management
  // ----------------------------------------------------------------
  // Search input
  const [searchTerm, setSearchTerm] = useState('');

  // Date range with proper typing
  const [dateRange, setDateRange] = useState<Date[]>([]);

  // For pagination
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 10;
  
  // Use API data total size
  const totalEntries = ordersPerDay?.total_size || 0;

  // ----------------------------------------------------------------
  // 2) API integration
  // ----------------------------------------------------------------
  useEffect(() => {
    // Only fetch if we have a date range selected
    if (dateRange.length === 2) {
      const params: OrdersPerDayParams = {
        from_date: dateRange[0].toISOString().split('T')[0],
        to_date: dateRange[1].toISOString().split('T')[0],
        limit: entriesPerPage,
        offset: currentPage
      };
      dispatch(fetchOrdersPerDay(params) as any);
    }
  }, [dispatch, dateRange, currentPage, entriesPerPage]);

  // ----------------------------------------------------------------
  // 3) Handlers
  // ----------------------------------------------------------------
  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle form submission or a 'submit' action
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Fetch data if date range is provided
    if (dateRange.length === 2) {
      setCurrentPage(1); // Reset to first page
      
      const params: OrdersPerDayParams = {
        from_date: dateRange[0].toISOString().split('T')[0],
        to_date: dateRange[1].toISOString().split('T')[0],
        limit: entriesPerPage,
        offset: 1 // First page
      };
      dispatch(fetchOrdersPerDay(params) as any);
    } else {
      // Show error if date range is not selected
      alert('Please select a date range');
    }
  };

  // Handle page changes from PaginationWidget
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // Only use API data - no fallback to static data
  const currentPageData = ordersPerDay?.orders || [];

  // ----------------------------------------------------------------
  // 4) Render
  // ----------------------------------------------------------------
  return (
    <div className="card card-flush">
      {/* Card Header */}
      <div className="card-header align-items-center py-5 gap-2 gap-md-5">
        {/* Card Title */}
        <div className="card-title">
          {/* Search */}
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
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          {/* Export buttons placeholder (d-none) */}
          <div id="kt_ecommerce_report_sales_export" className="d-none"></div>
        </div>
        {/* End Card Title */}

        {/* Card Toolbar */}
        <div className="card-toolbar flex-row-fluid justify-content-end gap-5">
          {/* Daterangepicker -> replaced with Flatpickr for date range */}
          <Flatpickr
            className="form-control form-control-solid w-100 mw-250px"
            placeholder="Pick date range"
            options={{ mode: 'range' }}
            value={dateRange}
            onChange={(selectedDates: Date[]) => {
              setDateRange(selectedDates);
            }}
          />

          {/* Export dropdown button replaced with <a> */}
          <a
            href="#"
            className="btn btn-light-primary"
            data-kt-menu-trigger="click"
            data-kt-menu-placement="bottom-end"
            onClick={handleFormSubmit}
          >
            <i className="ki-duotone ki-exit-up fs-2">
              <span className="path1"></span>
              <span className="path2"></span>
            </i>
            {dateRange.length === 2 ? 'Get Report' : 'Select Dates'}
          </a>

          {/* Export menu */}
          <div
            id="kt_ecommerce_report_sales_export_menu"
            className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-semibold fs-7 w-200px py-4"
            data-kt-menu="true"
          >
            <div className="menu-item px-3">
              <a
                href="#"
                className="menu-link px-3"
                data-kt-ecommerce-export="copy"
                onClick={() => {}}
              >
                Copy to clipboard
              </a>
            </div>
            <div className="menu-item px-3">
              <a
                href="#"
                className="menu-link px-3"
                data-kt-ecommerce-export="excel"
                onClick={() => {}}
              >
                Export as Excel
              </a>
            </div>
            <div className="menu-item px-3">
              <a
                href="#"
                className="menu-link px-3"
                data-kt-ecommerce-export="csv"
                onClick={() => {}}
              >
                Export as CSV
              </a>
            </div>
            <div className="menu-item px-3">
              <a
                href="#"
                className="menu-link px-3"
                data-kt-ecommerce-export="pdf"
                onClick={() => {}}
              >
                Export as PDF
              </a>
            </div>
          </div>
          {/* End Export Menu */}
        </div>
        {/* End Card Toolbar */}
      </div>
      {/* End Card Header */}

      {/* Card Body */}
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
            {typeof error === 'string' ? error : 'Failed to load orders per day data'}
          </div>
        )}
        
        {/* Date selection prompt */}
        {!dateRange.length && !isLoading && !error && (
          <div className="alert alert-primary">
            Please select a date range to view the sales report.
          </div>
        )}
        
        {/* No data message */}
        {dateRange.length === 2 && !isLoading && !error && currentPageData.length === 0 && (
          <div className="alert alert-info">
            No sales data found for the selected date range.
          </div>
        )}
        
        {/* Table view */}
        {!isLoading && !error && currentPageData.length > 0 && (
          <>
            <table
              className="table align-middle table-row-dashed fs-6 gy-5"
              id="kt_ecommerce_report_sales_table"
            >
              <thead>
                <tr className="text-start text-gray-500 fw-bold fs-7 text-uppercase gs-0">
                  <th className="min-w-100px">Date</th>
                  <th className="text-end min-w-75px">No. Orders</th>
                  <th className="text-end min-w-75px">Products Sold</th>
                  <th className="text-end min-w-75px">Tax</th>
                  <th className="text-end min-w-100px">Total</th>
                </tr>
              </thead>
              <tbody className="fw-semibold text-gray-600">
                {currentPageData.map((row, index) => (
                  <tr key={index}>
                    <td>{row.date}</td>
                    <td className="text-end pe-0">{row.no_orders}</td>
                    <td className="text-end pe-0">{row.products_sold}</td>
                    <td className="text-end pe-0">${row.tax.toFixed(2)}</td>
                    <td className="text-end">${row.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Widget */}
            <PaginationWidget
              totalEntries={totalEntries}
              entriesPerPage={entriesPerPage}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
      {/* End Card Body */}
    </div>
  );
};

export default SalesReportPage;
