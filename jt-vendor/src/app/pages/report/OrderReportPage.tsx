import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import Flatpickr from 'react-flatpickr';
import { PaginationWidget } from '../../components/common/PaginationWidget';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomerOrders } from '@/app/redux/statistic/statistic.slice';
import { CustomerOrdersParams, CustomerOrderStats } from '@/app/redux/statistic/statistic.models';
import { RootState } from '@/app/redux/store';

// Define type for static table data
interface TableDataItem {
  customerName: string;
  detailsUrl: string;
  email: string;
  status: string;
  dateJoined: string;
  noOrders: number;
  noProducts: number;
  total: string;
}

// Example table data extracted from the original HTML.
// Each row in the table is represented by an object.
// This is kept as fallback data
const tableData: TableDataItem[] = [
  {
    customerName: 'Emma Smith',
    detailsUrl: 'apps/ecommerce/customers/details.html',
    email: 'smith@kpmg.com',
    status: 'Active',
    dateJoined: '20 Jun 2024, 10:10 pm',
    noOrders: 42,
    noProducts: 55,
    total: '$1347.00',
  },
  {
    customerName: 'Melody Macy',
    detailsUrl: 'apps/ecommerce/customers/details.html',
    email: 'melody@altbox.com',
    status: 'Active',
    dateJoined: '21 Feb 2024, 11:30 am',
    noOrders: 21,
    noProducts: 26,
    total: '$2245.00',
  },
  {
    customerName: 'Max Smith',
    detailsUrl: 'apps/ecommerce/customers/details.html',
    email: 'max@kt.com',
    status: 'Active',
    dateJoined: '10 Nov 2024, 6:43 am',
    noOrders: 52,
    noProducts: 57,
    total: '$1336.00',
  },
  {
    customerName: 'Sean Bean',
    detailsUrl: 'apps/ecommerce/customers/details.html',
    email: 'sean@dellito.com',
    status: 'Active',
    dateJoined: '25 Oct 2024, 10:10 pm',
    noOrders: 52,
    noProducts: 60,
    total: '$3294.00',
  },
  {
    customerName: 'Brian Cox',
    detailsUrl: 'apps/ecommerce/customers/details.html',
    email: 'brian@exchange.com',
    status: 'Active',
    dateJoined: '21 Feb 2024, 6:05 pm',
    noOrders: 86,
    noProducts: 101,
    total: '$1423.00',
  },
  {
    customerName: 'Mikaela Collins',
    detailsUrl: 'apps/ecommerce/customers/details.html',
    email: 'mik@pex.com',
    status: 'Active',
    dateJoined: '20 Dec 2024, 2:40 pm',
    noOrders: 21,
    noProducts: 35,
    total: '$4807.00',
  },
  {
    customerName: 'Francis Mitcham',
    detailsUrl: 'apps/ecommerce/customers/details.html',
    email: 'f.mit@kpmg.com',
    status: 'Active',
    dateJoined: '24 Jun 2024, 11:30 am',
    noOrders: 74,
    noProducts: 85,
    total: '$1917.00',
  },
  {
    customerName: 'Olivia Wild',
    detailsUrl: 'apps/ecommerce/customers/details.html',
    email: 'olivia@corpmail.com',
    status: 'Active',
    dateJoined: '20 Jun 2024, 5:30 pm',
    noOrders: 36,
    noProducts: 48,
    total: '$4773.00',
  },
  {
    customerName: 'Neil Owen',
    detailsUrl: 'apps/ecommerce/customers/details.html',
    email: 'owen.neil@gmail.com',
    status: 'Active',
    dateJoined: '25 Jul 2024, 6:05 pm',
    noOrders: 45,
    noProducts: 57,
    total: '$791.00',
  },
  {
    customerName: 'Dan Wilson',
    detailsUrl: 'apps/ecommerce/customers/details.html',
    email: 'dam@consilting.com',
    status: 'Active',
    dateJoined: '25 Jul 2024, 10:10 pm',
    noOrders: 18,
    noProducts: 27,
    total: '$3458.00',
  },
  {
    customerName: 'Emma Bold',
    detailsUrl: 'apps/ecommerce/customers/details.html',
    email: 'emma@intenso.com',
    status: 'Active',
    dateJoined: '10 Nov 2024, 9:23 pm',
    noOrders: 30,
    noProducts: 38,
    total: '$3412.00',
  },
  {
    customerName: 'Ana Crown',
    detailsUrl: 'apps/ecommerce/customers/details.html',
    email: 'ana.cf@limtel.com',
    status: 'Disabled',
    dateJoined: '20 Dec 2024, 10:30 am',
    noOrders: 57,
    noProducts: 63,
    total: '$4908.00',
  },
  {
    customerName: 'Robert Doe',
    detailsUrl: 'apps/ecommerce/customers/details.html',
    email: 'robert@benko.com',
    status: 'Active',
    dateJoined: '15 Apr 2024, 2:40 pm',
    noOrders: 37,
    noProducts: 46,
    total: '$4406.00',
  },
  {
    customerName: 'John Miller',
    detailsUrl: 'apps/ecommerce/customers/details.html',
    email: 'miller@mapple.com',
    status: 'Active',
    dateJoined: '21 Feb 2024, 5:30 pm',
    noOrders: 73,
    noProducts: 87,
    total: '$933.00',
  },
  {
    customerName: 'Lucy Kunic',
    detailsUrl: 'apps/ecommerce/customers/details.html',
    email: 'lucy.m@fentech.com',
    status: 'Active',
    dateJoined: '21 Feb 2024, 6:43 am',
    noOrders: 11,
    noProducts: 22,
    total: '$1727.00',
  },
  {
    customerName: 'Ethan Wilder',
    detailsUrl: 'apps/ecommerce/customers/details.html',
    email: 'ethan@loop.com.au',
    status: 'Active',
    dateJoined: '24 Jun 2024, 11:30 am',
    noOrders: 50,
    noProducts: 59,
    total: '$3191.00',
  },
  {
    customerName: 'Neil Owen',
    detailsUrl: 'apps/ecommerce/customers/details.html',
    email: 'owen.neil@gmail.com',
    status: 'Active',
    dateJoined: '21 Feb 2024, 11:05 am',
    noOrders: 3,
    noProducts: 15,
    total: '$985.00',
  },
  {
    customerName: 'Emma Smith',
    detailsUrl: 'apps/ecommerce/customers/details.html',
    email: 'smith@kpmg.com',
    status: 'Active',
    dateJoined: '25 Oct 2024, 10:10 pm',
    noOrders: 84,
    noProducts: 93,
    total: '$1142.00',
  },
  {
    customerName: 'Melody Macy',
    detailsUrl: 'apps/ecommerce/customers/details.html',
    email: 'melody@altbox.com',
    status: 'Locked',
    dateJoined: '24 Jun 2024, 2:40 pm',
    noOrders: 68,
    noProducts: 77,
    total: '$3580.00',
  },
  {
    customerName: 'Max Smith',
    detailsUrl: 'apps/ecommerce/customers/details.html',
    email: 'max@kt.com',
    status: 'Active',
    dateJoined: '25 Oct 2024, 6:43 am',
    noOrders: 25,
    noProducts: 39,
    total: '$1018.00',
  },
  {
    customerName: 'Sean Bean',
    detailsUrl: 'apps/ecommerce/customers/details.html',
    email: 'sean@dellito.com',
    status: 'Active',
    dateJoined: '25 Jul 2024, 11:05 am',
    noOrders: 59,
    noProducts: 72,
    total: '$4570.00',
  },
  {
    customerName: 'Brian Cox',
    detailsUrl: 'apps/ecommerce/customers/details.html',
    email: 'brian@exchange.com',
    status: 'Disabled',
    dateJoined: '22 Sep 2024, 5:30 pm',
    noOrders: 96,
    noProducts: 110,
    total: '$1751.00',
  },
  {
    customerName: 'Mikaela Collins',
    detailsUrl: 'apps/ecommerce/customers/details.html',
    email: 'mik@pex.com',
    status: 'Active',
    dateJoined: '05 May 2024, 11:30 am',
    noOrders: 88,
    noProducts: 93,
    total: '$238.00',
  },
  {
    customerName: 'Francis Mitcham',
    detailsUrl: 'apps/ecommerce/customers/details.html',
    email: 'f.mit@kpmg.com',
    status: 'Active',
    dateJoined: '22 Sep 2024, 5:30 pm',
    noOrders: 56,
    noProducts: 65,
    total: '$1824.00',
  },
  {
    customerName: 'Olivia Wild',
    detailsUrl: 'apps/ecommerce/customers/details.html',
    email: 'olivia@corpmail.com',
    status: 'Disabled',
    dateJoined: '24 Jun 2024, 11:30 am',
    noOrders: 21,
    noProducts: 27,
    total: '$4958.00',
  },
  {
    customerName: 'Neil Owen',
    detailsUrl: 'apps/ecommerce/customers/details.html',
    email: 'owen.neil@gmail.com',
    status: 'Banned',
    dateJoined: '20 Jun 2024, 2:40 pm',
    noOrders: 27,
    noProducts: 38,
    total: '$78.00',
  },
  {
    customerName: 'Dan Wilson',
    detailsUrl: 'apps/ecommerce/customers/details.html',
    email: 'dam@consilting.com',
    status: 'Active',
    dateJoined: '25 Oct 2024, 8:43 pm',
    noOrders: 65,
    noProducts: 70,
    total: '$4941.00',
  },
  {
    customerName: 'Emma Bold',
    detailsUrl: 'apps/ecommerce/customers/details.html',
    email: 'emma@intenso.com',
    status: 'Disabled',
    dateJoined: '19 Aug 2024, 10:10 pm',
    noOrders: 97,
    noProducts: 107,
    total: '$4078.00',
  },
  {
    customerName: 'Ana Crown',
    detailsUrl: 'apps/ecommerce/customers/details.html',
    email: 'ana.cf@limtel.com',
    status: 'Banned',
    dateJoined: '25 Oct 2024, 6:05 pm',
    noOrders: 93,
    noProducts: 98,
    total: '$2709.00',
  },
  {
    customerName: 'Robert Doe',
    detailsUrl: 'apps/ecommerce/customers/details.html',
    email: 'robert@benko.com',
    status: 'Active',
    dateJoined: '24 Jun 2024, 5:30 pm',
    noOrders: 68,
    noProducts: 77,
    total: '$604.00',
  },
  {
    customerName: 'John Miller',
    detailsUrl: 'apps/ecommerce/customers/details.html',
    email: 'miller@mapple.com',
    status: 'Active',
    dateJoined: '19 Aug 2024, 11:30 am',
    noOrders: 95,
    noProducts: 101,
    total: '$4811.00',
  },
  {
    customerName: 'Lucy Kunic',
    detailsUrl: 'apps/ecommerce/customers/details.html',
    email: 'lucy.m@fentech.com',
    status: 'Active',
    dateJoined: '25 Jul 2024, 5:20 pm',
    noOrders: 10,
    noProducts: 22,
    total: '$4979.00',
  },
  {
    customerName: 'Ethan Wilder',
    detailsUrl: 'apps/ecommerce/customers/details.html',
    email: 'ethan@loop.com.au',
    status: 'Locked',
    dateJoined: '10 Nov 2024, 11:05 am',
    noOrders: 97,
    noProducts: 107,
    total: '$3903.00',
  },
  {
    customerName: 'Dan Wilson',
    detailsUrl: 'apps/ecommerce/customers/details.html',
    email: 'dam@consilting.com',
    status: 'Banned',
    dateJoined: '25 Oct 2024, 11:30 am',
    noOrders: 1,
    noProducts: 6,
    total: '$1205.00',
  },
  {
    customerName: 'Emma Smith',
    detailsUrl: 'apps/ecommerce/customers/details.html',
    email: 'smith@kpmg.com',
    status: 'Banned',
    dateJoined: '05 May 2024, 10:30 am',
    noOrders: 66,
    noProducts: 71,
    total: '$4418.00',
  },
  {
    customerName: 'Melody Macy',
    detailsUrl: 'apps/ecommerce/customers/details.html',
    email: 'melody@altbox.com',
    status: 'Active',
    dateJoined: '19 Aug 2024, 8:43 pm',
    noOrders: 25,
    noProducts: 32,
    total: '$1388.00',
  },
  {
    customerName: 'Max Smith',
    detailsUrl: 'apps/ecommerce/customers/details.html',
    email: 'max@kt.com',
    status: 'Active',
    dateJoined: '20 Dec 2024, 6:43 am',
    noOrders: 9,
    noProducts: 18,
    total: '$749.00',
  },
  {
    customerName: 'Sean Bean',
    detailsUrl: 'apps/ecommerce/customers/details.html',
    email: 'sean@dellito.com',
    status: 'Active',
    dateJoined: '25 Oct 2024, 8:43 pm',
    noOrders: 55,
    noProducts: 62,
    total: '$2027.00',
  },
  {
    customerName: 'Brian Cox',
    detailsUrl: 'apps/ecommerce/customers/details.html',
    email: 'brian@exchange.com',
    status: 'Active',
    dateJoined: '25 Oct 2024, 11:05 am',
    noOrders: 64,
    noProducts: 79,
    total: '$1600.00',
  },
  {
    customerName: 'Mikaela Collins',
    detailsUrl: 'apps/ecommerce/customers/details.html',
    email: 'mik@pex.com',
    status: 'Disabled',
    dateJoined: '10 Nov 2024, 5:20 pm',
    noOrders: 30,
    noProducts: 39,
    total: '$76.00',
  },
  {
    customerName: 'Francis Mitcham',
    detailsUrl: 'apps/ecommerce/customers/details.html',
    email: 'f.mit@kpmg.com',
    status: 'Active',
    dateJoined: '20 Jun 2024, 6:43 am',
    noOrders: 13,
    noProducts: 26,
    total: '$4294.00',
  },
  {
    customerName: 'Olivia Wild',
    detailsUrl: 'apps/ecommerce/customers/details.html',
    email: 'olivia@corpmail.com',
    status: 'Active',
    dateJoined: '20 Jun 2024, 6:43 am',
    noOrders: 81,
    noProducts: 91,
    total: '$989.00',
  },
  {
    customerName: 'Neil Owen',
    detailsUrl: 'apps/ecommerce/customers/details.html',
    email: 'owen.neil@gmail.com',
    status: 'Disabled',
    dateJoined: '10 Mar 2024, 6:05 pm',
    noOrders: 82,
    noProducts: 92,
    total: '$4022.00',
  },
  {
    customerName: 'Dan Wilson',
    detailsUrl: 'apps/ecommerce/customers/details.html',
    email: 'dam@consilting.com',
    status: 'Active',
    dateJoined: '25 Oct 2024, 5:30 pm',
    noOrders: 41,
    noProducts: 49,
    total: '$1376.00',
  },
  {
    customerName: 'Emma Bold',
    detailsUrl: 'apps/ecommerce/customers/details.html',
    email: 'emma@intenso.com',
    status: 'Active',
    dateJoined: '15 Apr 2024, 10:30 am',
    noOrders: 13,
    noProducts: 26,
    total: '$3544.00',
  },
  {
    customerName: 'Ana Crown',
    detailsUrl: 'apps/ecommerce/customers/details.html',
    email: 'ana.cf@limtel.com',
    status: 'Active',
    dateJoined: '10 Nov 2024, 8:43 pm',
    noOrders: 59,
    noProducts: 65,
    total: '$1255.00',
  },
  {
    customerName: 'Robert Doe',
    detailsUrl: 'apps/ecommerce/customers/details.html',
    email: 'robert@benko.com',
    status: 'Active',
    dateJoined: '24 Jun 2024, 10:30 am',
    noOrders: 26,
    noProducts: 34,
    total: '$4107.00',
  },
  {
    customerName: 'John Miller',
    detailsUrl: 'apps/ecommerce/customers/details.html',
    email: 'miller@mapple.com',
    status: 'Locked',
    dateJoined: '22 Sep 2024, 11:05 am',
    noOrders: 59,
    noProducts: 67,
    total: '$3227.00',
  },
  {
    customerName: 'Lucy Kunic',
    detailsUrl: 'apps/ecommerce/customers/details.html',
    email: 'lucy.m@fentech.com',
    status: 'Active',
    dateJoined: '21 Feb 2024, 10:30 am',
    noOrders: 42,
    noProducts: 54,
    total: '$3871.00',
  },
  {
    customerName: 'Ethan Wilder',
    detailsUrl: 'apps/ecommerce/customers/details.html',
    email: 'ethan@loop.com.au',
    status: 'Active',
    dateJoined: '25 Jul 2024, 6:43 am',
    noOrders: 49,
    noProducts: 55,
    total: '$4774.00',
  },
];
const OrderReportPage = () => {
    const dispatch = useDispatch();
    const { customerOrders, isLoading, error } = useSelector((state: RootState) => state.statistic);
    
    // Local state for the search input
    const [searchReport, setSearchReport] = useState('');
    // State for Flatpickr date range
    const [selectedDateRange, setSelectedDateRange] = useState<Date[]>([]);
    // React-select state
    const [status, setStatus] = useState<{value: string, label: string} | null>(null);
  
    // -------- PAGINATION STATES --------
    // Current page state
    const [currentPage, setCurrentPage] = useState(1);
    // Choose how many entries per page you want
    const entriesPerPage = 10;
    
    // Use customer orders data from Redux or fallback to static data
    const totalEntries = customerOrders?.total_size || tableData.length;
  
    // Load customer orders on component mount and when page changes
    useEffect(() => {
      const params: CustomerOrdersParams = {
        limit: entriesPerPage,
        offset: currentPage // Offset is now exactly the page number
      };
      dispatch(fetchCustomerOrders(params) as any);
    }, [dispatch, currentPage, entriesPerPage]);
  
    // We use data from Redux or fallback to static data
    const currentPageData = customerOrders?.customers || 
      tableData.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);
  
    const handlePageChange = (newPage: number) => {
      setCurrentPage(newPage);
      // No need to dispatch here as the useEffect will handle it when currentPage changes
    };
    // -------- END PAGINATION --------
  
    /**
     * Handle form submission (or you can just call this on a link click).
     * This will log all input data to the console as requested.
     */
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      //console.log('Search Report:', searchReport);
      //console.log('Selected Date Range:', selectedDateRange);
      //console.log('Selected Status:', status);
      
      // Reset to first page when filters are applied
      setCurrentPage(1);
      
      // Prepare parameters for API call with filter conditions
      const params: CustomerOrdersParams = {
        limit: entriesPerPage,
        offset: 1 // Offset is 1 for the first page
      };
      
      // Add status filter if selected
      if (status && status.value !== 'all') {
        // Your API might need this parameter - adjust as needed
        // params.status = status.value;
      }
      
      // Add date range filter if selected
      if (selectedDateRange && selectedDateRange.length === 2) {
        // Format dates for API - adjust format as needed
        // params.from_date = selectedDateRange[0].toISOString().split('T')[0];
        // params.to_date = selectedDateRange[1].toISOString().split('T')[0];
      }
      
      // Add search term if provided
      if (searchReport.trim()) {
        // Your API might need this parameter - adjust as needed
        // params.search = searchReport.trim();
      }
      
      // Dispatch the fetch action with the form parameters
      dispatch(fetchCustomerOrders(params) as any);
    };

    // Helper function to render table row data correctly regardless of data source
    const renderCustomerName = (item: CustomerOrderStats | TableDataItem) => {
      return 'customer_name' in item ? item.customer_name : item.customerName;
    };

    const renderEmail = (item: CustomerOrderStats | TableDataItem) => {
      return item.email;
    };

    const renderStatus = (item: CustomerOrderStats | TableDataItem) => {
      return item.status;
    };

    const renderDateJoined = (item: CustomerOrderStats | TableDataItem) => {
      return 'date_joined' in item ? item.date_joined : item.dateJoined;
    };

    const renderNoOrders = (item: CustomerOrderStats | TableDataItem) => {
      return 'no_orders' in item ? item.no_orders : item.noOrders;
    };

    const renderNoProducts = (item: CustomerOrderStats | TableDataItem) => {
      return 'no_products' in item ? item.no_products : item.noProducts;
    };

    const renderTotal = (item: CustomerOrderStats | TableDataItem) => {
      if ('total' in item) {
        if (typeof item.total === 'number') {
          return `$${item.total.toFixed(2)}`;
        } else if (typeof item.total === 'string') {
          return item.total;
        }
      }
      // Fallback for any other case
      return '';
    };
  
    return (
      <div className="card card-flush">
        {/* begin::Card header */}
        <form onSubmit={handleSubmit}>
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
                  value={searchReport}
                  onChange={(e) => setSearchReport(e.target.value)}
                />
              </div>
              {/* end::Search */}
  
              {/* begin::Export buttons */}
              <div id="kt_ecommerce_report_customer_orders_export" className="d-none"></div>
              {/* end::Export buttons */}
            </div>
            {/* end::Card title */}
  
            {/* begin::Card toolbar */}
            <div className="card-toolbar flex-row-fluid justify-content-end gap-5">
              {/* begin::Daterangepicker -> replaced with Flatpickr */}
              <Flatpickr
                className="form-control form-control-solid w-100 mw-250px"
                id="kt_ecommerce_report_customer_orders_daterangepicker"
                placeholder="Pick date range"
                value={selectedDateRange}
                onChange={(date) => setSelectedDateRange(date)}
                options={{ mode: 'range' }}
              />
              {/* end::Daterangepicker */}
  
              {/* begin::Filter -> replaced <select> with react-select */}
              <Select
                  className="react-select-styled react-select-solid"
                  classNamePrefix="react-select"
                  placeholder="Status"
                  isClearable
                  isSearchable={false}
                  onChange={(selectedOption) => setStatus(selectedOption)}
                  value={status}
                  options={[
                    { value: 'all', label: 'All' },
                    { value: 'active', label: 'Active' },
                    { value: 'locked', label: 'Locked' },
                    { value: 'disabled', label: 'Disabled' },
                    { value: 'banned', label: 'Banned' },
                  ]}
                />
              {/* end::Filter */}
  
              {/* begin::Export dropdown */}
              {/* Replaced <button> with <a> preserving classes & data attributes */}
              <a
                type="submit"
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
                id="kt_ecommerce_report_customer_orders_export_menu"
                className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-semibold fs-7 w-200px py-4"
                data-kt-menu="true"
              >
                <div className="menu-item px-3">
                  <a
                    href="#"
                    className="menu-link px-3"
                    data-kt-ecommerce-export="copy"
                  >
                    Copy to clipboard
                  </a>
                </div>
                <div className="menu-item px-3">
                  <a
                    href="#"
                    className="menu-link px-3"
                    data-kt-ecommerce-export="excel"
                  >
                    Export as Excel
                  </a>
                </div>
                <div className="menu-item px-3">
                  <a
                    href="#"
                    className="menu-link px-3"
                    data-kt-ecommerce-export="csv"
                  >
                    Export as CSV
                  </a>
                </div>
                <div className="menu-item px-3">
                  <a
                    href="#"
                    className="menu-link px-3"
                    data-kt-ecommerce-export="pdf"
                  >
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
                {typeof error === 'string' ? error : 'Failed to load customer orders'}
              </div>
            )}
            
            {/* begin::Table */}
            {!isLoading && !error && (
              <table
                className="table align-middle table-row-dashed fs-6 gy-5"
                id="kt_ecommerce_report_customer_orders_table"
              >
                <thead>
                  <tr className="text-start text-gray-500 fw-bold fs-7 text-uppercase gs-0">
                    <th className="min-w-100px">Customer Name</th>
                    <th className="min-w-100px">Email</th>
                    <th className="min-w-100px">Status</th>
                    <th className="min-w-100px">Date Joined</th>
                    <th className="text-end min-w-75px">No. Orders</th>
                    <th className="text-end min-w-75px">No. Products</th>
                    <th className="text-end min-w-100px">Total</th>
                  </tr>
                </thead>
                <tbody className="fw-semibold text-gray-600">
                  {currentPageData.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <a
                          href="#"
                          className="text-gray-900 text-hover-primary"
                        >
                          {renderCustomerName(item)}
                        </a>
                      </td>
                      <td>
                        <a href="#" className="text-gray-900 text-hover-primary">
                          {renderEmail(item)}
                        </a>
                      </td>
                      <td>
                        <div
                          className={`badge badge-light-${
                            renderStatus(item)?.toLowerCase() || 'success'
                          }`}
                        >
                          {renderStatus(item)}
                        </div>
                      </td>
                      <td>{renderDateJoined(item)}</td>
                      <td className="text-end pe-0">{renderNoOrders(item)}</td>
                      <td className="text-end pe-0">{renderNoProducts(item)}</td>
                      <td className="text-end">{renderTotal(item)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {/* end::Table */}
  
            {/* ---------- PAGINATION WIDGET ADDED HERE ---------- */}
            {!isLoading && !error && (
              <PaginationWidget
                totalEntries={totalEntries}
                entriesPerPage={entriesPerPage}
                onPageChange={handlePageChange}
              />
            )}
            {/* -------------------------------------------------- */}
          </div>
          {/* end::Card body */}
        </form>
        {/* end::Card header/body */}
      </div>
    );
  };
  
  export default OrderReportPage;
