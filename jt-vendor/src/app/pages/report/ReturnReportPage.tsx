import React, { useState, useEffect } from "react";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.css";
import { PaginationWidget } from "../../components/common/PaginationWidget";
import { useDispatch, useSelector } from 'react-redux';
import { fetchReturnOrders } from '@/app/redux/statistic/statistic.slice';
import { ReturnOrdersParams } from '@/app/redux/statistic/statistic.models';
import { RootState } from '@/app/redux/store';

const ReturnReportPage = () => {
  const dispatch = useDispatch();
  const { returnOrders, isLoading, error } = useSelector((state: RootState) => state.statistic);
  
  // ----------------------------------------------------------------------------
  // State Management
  // ----------------------------------------------------------------------------
  const [dateRange, setDateRange] = useState<Date[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 10;

  // Use API data total size
  const totalEntries = returnOrders?.total_size || 0;

  // ----------------------------------------------------------------------------
  // API Integration
  // ----------------------------------------------------------------------------
  useEffect(() => {
    // Only fetch if we have a date range selected
    if (dateRange.length === 2) {
      const params: ReturnOrdersParams = {
        from_date: dateRange[0].toISOString().split('T')[0],
        to_date: dateRange[1].toISOString().split('T')[0],
        limit: entriesPerPage,
        offset: currentPage
      };
      dispatch(fetchReturnOrders(params) as any);
    }
  }, [dispatch, dateRange, currentPage, entriesPerPage]);

  // ----------------------------------------------------------------------------
  // Handlers
  // ----------------------------------------------------------------------------
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleExportReport = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Only fetch if we have a date range selected
    if (dateRange.length === 2) {
      setCurrentPage(1); // Reset to first page
      
      const params: ReturnOrdersParams = {
        from_date: dateRange[0].toISOString().split('T')[0],
        to_date: dateRange[1].toISOString().split('T')[0],
        limit: entriesPerPage,
        offset: 1 // First page
      };
      dispatch(fetchReturnOrders(params) as any);
    } else {
      // Show error if date range is not selected
      alert('Please select a date range');
    }
  };

  // ----------------------------------------------------------------------------
  // Only use API data - no fallback to static data
  // ----------------------------------------------------------------------------
  const currentData = returnOrders?.returns || [];

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
          <div id="kt_ecommerce_report_returns_export" className="d-none"></div>
          {/* end::Export buttons */}
        </div>
        {/* end::Card title */}

        {/* begin::Card toolbar */}
        <div className="card-toolbar flex-row-fluid justify-content-end gap-5">
          {/* begin::Daterangepicker (replaced with Flatpickr) */}
          <Flatpickr
            className="form-control form-control-solid w-100 mw-250px"
            placeholder="Pick date range"
            options={{ mode: "range", dateFormat: "Y-m-d" }}
            value={dateRange}
            onChange={(selectedDates: Date[]) => setDateRange(selectedDates)}
          />
          {/* end::Daterangepicker */}

          {/* begin::Export dropdown (button replaced with <a>) */}
          <a
            href="#"
            className="btn btn-light-primary"
            data-kt-menu-trigger="click"
            data-kt-menu-placement="bottom-end"
            onClick={handleExportReport}
          >
            <i className="ki-duotone ki-exit-up fs-2">
              <span className="path1"></span>
              <span className="path2"></span>
            </i>
            {dateRange.length === 2 ? 'Get Report' : 'Select Dates'}
          </a>
          {/* begin::Menu */}
          <div
            id="kt_ecommerce_report_returns_export_menu"
            className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-semibold fs-7 w-200px py-4"
            data-kt-menu="true"
          >
            {/* begin::Menu item */}
            <div className="menu-item px-3">
              <a href="#" className="menu-link px-3" data-kt-ecommerce-export="copy">
                Copy to clipboard
              </a>
            </div>
            {/* end::Menu item */}
            {/* begin::Menu item */}
            <div className="menu-item px-3">
              <a href="#" className="menu-link px-3" data-kt-ecommerce-export="excel">
                Export as Excel
              </a>
            </div>
            {/* end::Menu item */}
            {/* begin::Menu item */}
            <div className="menu-item px-3">
              <a href="#" className="menu-link px-3" data-kt-ecommerce-export="csv">
                Export as CSV
              </a>
            </div>
            {/* end::Menu item */}
            {/* begin::Menu item */}
            <div className="menu-item px-3">
              <a href="#" className="menu-link px-3" data-kt-ecommerce-export="pdf">
                Export as PDF
              </a>
            </div>
            {/* end::Menu item */}
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
            {typeof error === 'string' ? error : 'Failed to load return orders data'}
          </div>
        )}
        
        {/* Date selection prompt */}
        {!dateRange.length && !isLoading && !error && (
          <div className="alert alert-primary">
            Please select a date range to view the returns report.
          </div>
        )}
        
        {/* No data message */}
        {dateRange.length === 2 && !isLoading && !error && currentData.length === 0 && (
          <div className="alert alert-info">
            No returns data found for the selected date range.
          </div>
        )}
        
        {/* begin::Table */}
        {!isLoading && !error && currentData.length > 0 && (
          <>
            <table
              className="table align-middle table-row-dashed fs-6 gy-5"
              id="kt_ecommerce_report_returns_table"
            >
              <thead>
                <tr className="text-start text-gray-500 fw-bold fs-7 text-uppercase gs-0">
                  <th className="min-w-100px">Date</th>
                  <th className="text-end min-w-75px">No. Orders Returned</th>
                  <th className="text-end min-w-75px">No. Orders Refunded</th>
                  <th className="text-end min-w-75px">No. Orders Replaced</th>
                  <th className="text-end min-w-100px">Total Refunded</th>
                  <th className="text-end min-w-100px">Total Replaced</th>
                </tr>
              </thead>
              <tbody className="fw-semibold text-gray-600">
                {currentData.map((row, index) => (
                  <tr key={index}>
                    <td>{row.date}</td>
                    <td className="text-end pe-0">{row.orders_returned}</td>
                    <td className="text-end pe-0">{row.orders_refunded}</td>
                    <td className="text-end pe-0">{row.orders_replaced}</td>
                    <td className="text-end pe-0">${row.total_refunded.toFixed(2)}</td>
                    <td className="text-end">${row.total_replaced.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* end::Table */}

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

export default ReturnReportPage;
