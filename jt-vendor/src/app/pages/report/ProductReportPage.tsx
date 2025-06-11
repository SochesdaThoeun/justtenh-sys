import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import Flatpickr from 'react-flatpickr';
import { PaginationWidget } from '../../components/common/PaginationWidget';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { 
  fetchProductPerformance, 
  fetchSalesChart 
} from '../../redux/statistic/statistic.slice';
import { 
  ProductPerformanceParams, 
  ProductPerformanceStats,
  SalesChartParams
} from '../../redux/statistic/statistic.models';
import { toast } from 'sonner';
import ApexCharts, { ApexOptions } from 'apexcharts';
import { getCSSVariableValue } from '../../../_metronic/assets/ts/_utils';
import { useThemeMode } from '../../../_metronic/partials/layout/theme-mode/ThemeModeProvider';
import { PRODUCT_THUMBNAIL_URL } from '../../constants/api.constants';

// Custom OrdersChart component
const OrdersChart = ({ monthNames, data, className }: { monthNames: string[], data: number[], className: string }) => {
  const chartRef = React.useRef<HTMLDivElement | null>(null);
  const { mode } = useThemeMode();

  useEffect(() => {
    const chart = refreshChart();

    return () => {
      if (chart) {
        chart.destroy();
      }
    };
  }, [chartRef, mode, data, monthNames]);

  const refreshChart = () => {
    if (!chartRef.current) {
      return;
    }

    const height = 350;
    const chart = new ApexCharts(chartRef.current, getChartOptions(height, monthNames, data));
    if (chart) {
      chart.render();
    }

    return chart;
  };

  function getChartOptions(height: number, categories: string[], chartData: number[]): ApexOptions {
    const labelColor = getCSSVariableValue('--bs-gray-500');
    const borderColor = getCSSVariableValue('--bs-gray-200');
    const baseColor = getCSSVariableValue('--bs-primary');
    const secondaryColor = getCSSVariableValue('--bs-gray-300');

    return {
      series: [
        {
          name: 'Orders',
          data: chartData,
        }
      ],
      chart: {
        fontFamily: 'inherit',
        type: 'bar',
        height: height,
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '30%',
          borderRadius: 5,
        },
      },
      legend: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent'],
      },
      xaxis: {
        categories: categories,
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          style: {
            colors: labelColor,
            fontSize: '12px',
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: labelColor,
            fontSize: '12px',
          },
        },
      },
      fill: {
        opacity: 1,
      },
      states: {
        normal: {
          filter: {
            type: 'none',
            value: 0,
          },
        },
        hover: {
          filter: {
            type: 'none',
            value: 0,
          },
        },
        active: {
          allowMultipleDataPointsSelection: false,
          filter: {
            type: 'none',
            value: 0,
          },
        },
      },
      tooltip: {
        style: {
          fontSize: '12px',
        },
        y: {
          formatter: function (val) {
            return val.toString();
          },
        },
      },
      colors: [baseColor],
      grid: {
        borderColor: borderColor,
        strokeDashArray: 4,
        yaxis: {
          lines: {
            show: true,
          },
        },
      },
    };
  }

  return (
    <div className={`card ${className}`}>
      {/* begin::Header */}
      <div className='card-header border-0 pt-5'>
        {/* begin::Title */}
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>Monthly Orders</span>
          <span className='text-muted fw-semibold fs-7'>Last 6 months</span>
        </h3>
      </div>
      {/* end::Header */}

      {/* begin::Body */}
      <div className='card-body'>
        {/* begin::Chart */}
        <div ref={chartRef} id='kt_charts_orders' style={{ height: '350px' }} />
        {/* end::Chart */}
      </div>
      {/* end::Body */}
    </div>
  );
};

// Custom CustomersChart component
const CustomersChart = ({ monthNames, data, className }: { monthNames: string[], data: number[], className: string }) => {
  const chartRef = React.useRef<HTMLDivElement | null>(null);
  const { mode } = useThemeMode();

  useEffect(() => {
    const chart = refreshChart();

    return () => {
      if (chart) {
        chart.destroy();
      }
    };
  }, [chartRef, mode, data, monthNames]);

  const refreshChart = () => {
    if (!chartRef.current) {
      return;
    }

    const chart = new ApexCharts(chartRef.current, getChartOptions());
    if (chart) {
      chart.render();
    }

    return chart;
  };

  function getChartOptions(): ApexOptions {
    const labelColor = getCSSVariableValue('--bs-gray-500');
    const borderColor = getCSSVariableValue('--bs-gray-200');
    const baseColor = getCSSVariableValue('--bs-info');
    const lightColor = getCSSVariableValue('--bs-info-light');

    return {
      series: [
        {
          name: 'Customers',
          data: data,
        },
      ],
      chart: {
        fontFamily: 'inherit',
        type: 'area',
        height: 350,
        toolbar: {
          show: false,
        },
      },
      plotOptions: {},
      legend: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      fill: {
        type: 'solid',
        opacity: 1,
      },
      stroke: {
        curve: 'smooth',
        show: true,
        width: 3,
        colors: [baseColor],
      },
      xaxis: {
        categories: monthNames,
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          style: {
            colors: labelColor,
            fontSize: '12px',
          },
        },
        crosshairs: {
          position: 'front',
          stroke: {
            color: baseColor,
            width: 1,
            dashArray: 3,
          },
        },
        tooltip: {
          enabled: true,
          formatter: undefined,
          offsetY: 0,
          style: {
            fontSize: '12px',
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: labelColor,
            fontSize: '12px',
          },
        },
      },
      states: {
        normal: {
          filter: {
            type: 'none',
            value: 0,
          },
        },
        hover: {
          filter: {
            type: 'none',
            value: 0,
          },
        },
        active: {
          allowMultipleDataPointsSelection: false,
          filter: {
            type: 'none',
            value: 0,
          },
        },
      },
      tooltip: {
        style: {
          fontSize: '12px',
        },
        y: {
          formatter: function (val) {
            return val.toString();
          },
        },
      },
      colors: [lightColor],
      grid: {
        borderColor: borderColor,
        strokeDashArray: 4,
        yaxis: {
          lines: {
            show: true,
          },
        },
      },
      markers: {
        strokeColors: baseColor,
        strokeWidth: 3,
      },
    };
  }

  return (
    <div className={`card ${className}`}>
      {/* begin::Header */}
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>Monthly Customers</span>
          <span className='text-muted fw-semibold fs-7'>Last 6 months</span>
        </h3>
      </div>
      {/* end::Header */}

      {/* begin::Body */}
      <div className='card-body'>
        {/* begin::Chart */}
        <div ref={chartRef} id='kt_charts_customers' style={{ height: '350px' }}></div>
        {/* end::Chart */}
      </div>
      {/* end::Body */}
    </div>
  );
};

const ProductReportPage = () => {
  //--------------------------------------------------------------------------
  // State Hooks and Redux
  //--------------------------------------------------------------------------
  const dispatch = useAppDispatch();
  const { 
    productPerformance, 
    salesChart,
    isLoading, 
    error 
  } = useAppSelector((state) => state.statistic);

  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState(''); // We'll store a string
  const [selectedRating, setSelectedRating] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [sortBy, setSortBy] = useState<'most_sold' | 'highest_rating' | 'most_revenue'>('most_revenue');
  const [orderChartData, setOrderChartData] = useState<{months: number[], month_names: string[], data: number[]}>({
    months: [],
    month_names: [],
    data: []
  });
  const [customerChartData, setCustomerChartData] = useState<{months: number[], month_names: string[], data: number[]}>({
    months: [],
    month_names: [],
    data: []
  });

  //--------------------------------------------------------------------------
  // react-select Options for Ratings
  //--------------------------------------------------------------------------
  const ratingOptions = [
    { value: 'all', label: 'All' },
    { value: 'rating-5', label: '5 Stars' },
    { value: 'rating-4', label: '4 Stars' },
    { value: 'rating-3', label: '3 Stars' },
    { value: 'rating-2', label: '2 Stars' },
    { value: 'rating-1', label: '1 Stars' },
  ];

  //--------------------------------------------------------------------------
  // Get last 6 months for chart data
  //--------------------------------------------------------------------------
  const getLast6Months = (): number[] => {
    const months = [];
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-indexed
    const currentYear = currentDate.getFullYear();
    
    for (let i = 5; i >= 0; i--) {
      let month = currentMonth - i;
      // Handle wrapping around to previous year
      if (month <= 0) {
        month += 12;
      }
      months.push(month);
    }
    
    return months;
  };

  //--------------------------------------------------------------------------
  // Fetch Product Performance Data
  //--------------------------------------------------------------------------
  useEffect(() => {
    const fetchProductData = async () => {
      //console.log('Fetching product performance data...');
      const params: ProductPerformanceParams = {
        sort_by: sortBy,
        limit: entriesPerPage,
        offset: currentPage
      };
      
      //console.log('Product performance params:', params);
      await dispatch(fetchProductPerformance(params));
    };

    fetchProductData();
  }, [dispatch, sortBy, entriesPerPage, currentPage]);

  //--------------------------------------------------------------------------
  // Fetch Sales Chart Data for Orders and Customers
  //--------------------------------------------------------------------------
  useEffect(() => {
    const fetchOrdersChartData = async () => {
      //console.log('Fetching orders chart data...');
      const months = getLast6Months();
      const params: SalesChartParams = {
        months: months,
        type: 'orders',
        year: new Date().getFullYear()
      };
      
      //console.log('Orders chart params:', params);
      const result = await dispatch(fetchSalesChart(params));
      if (fetchSalesChart.fulfilled.match(result)) {
        //console.log('Orders chart data received:', result.payload);
        setOrderChartData(result.payload);
      }
    };

    const fetchCustomersChartData = async () => {
      //console.log('Fetching customers chart data...');
      const months = getLast6Months();
      const params: SalesChartParams = {
        months: months,
        type: 'customers',
        year: new Date().getFullYear()
      };
      
      //console.log('Customers chart params:', params);
      const result = await dispatch(fetchSalesChart(params));
      if (fetchSalesChart.fulfilled.match(result)) {
        //console.log('Customers chart data received:', result.payload);
        setCustomerChartData(result.payload);
      }
    };

    fetchOrdersChartData();
    fetchCustomersChartData();
  }, [dispatch]);

  //--------------------------------------------------------------------------
  // Handler: "Export Report"  (or "Submit")
  //--------------------------------------------------------------------------
  const handleExportReport = () => {
    //console.log('--- Export / Submit Clicked ---');
    //console.log('Search Term:', searchTerm);
    //console.log('Date Range:', dateRange);
    //console.log('Selected Rating:', selectedRating);
    //console.log('Current Page:', currentPage);
    
    // You could trigger a re-fetch with updated filters here
    const fetchProductData = async () => {
      const params: ProductPerformanceParams = {
        sort_by: sortBy,
        limit: entriesPerPage,
        offset: currentPage
      };
      
      await dispatch(fetchProductPerformance(params));
    };

    fetchProductData();
  };

  //--------------------------------------------------------------------------
  // Filter with search term on client side (server API doesn't support search)
  //--------------------------------------------------------------------------
  const filteredData = productPerformance?.products?.filter((item) => {
    // If there's a search term
    if (searchTerm && !item.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    // If user chose a rating in the dropdown
    if (selectedRating && selectedRating !== 'all') {
      const numeric = parseInt(selectedRating.replace('rating-', ''), 10);
      const ratingRounded = Math.round(item.rating);
      if (ratingRounded !== numeric) return false;
    }
    return true;
  }) || [];

  //--------------------------------------------------------------------------
  // Pagination Logic
  //--------------------------------------------------------------------------
  const totalEntries = productPerformance?.total_size || 0;
  
  //--------------------------------------------------------------------------
  // onPageChange from Pagination Widget
  //--------------------------------------------------------------------------
  const handlePageChange = (pageNumber: number) => {
    //console.log('Changing page to:', pageNumber);
    setCurrentPage(pageNumber);
  };

  //--------------------------------------------------------------------------
  // Helper: Render star rating
  //--------------------------------------------------------------------------
  const renderRatingStars = (rating: number) => {
    const totalStars = 5;
    const ratingRounded = Math.round(rating);
    const starsArray = [];
    for (let i = 0; i < totalStars; i++) {
      starsArray.push(
        <div key={i} className={`rating-label ${i < ratingRounded ? 'checked' : ''}`}>
          <i className="ki-duotone ki-star fs-6"></i>
        </div>
      );
    }
    return starsArray;
  };

  //--------------------------------------------------------------------------
  // Helper: Format currency
  //--------------------------------------------------------------------------
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <>
    <div className='row g-5 g-xl-8'>
      <div className='col-xl-6'>
        <OrdersChart
          className='card-xl-stretch mb-xl-8'
          monthNames={orderChartData.month_names}
          data={orderChartData.data}
        />
      </div>
      <div className='col-xl-6'>
        <CustomersChart
          className='card-xl-stretch mb-xl-8'
          monthNames={customerChartData.month_names}
          data={customerChartData.data}
        />
      </div>
    </div>
    <div className="card card-flush">

        {/* begin::Card header */}
        <div className="card-header align-items-center py-5 gap-2 gap-md-5">
          {/* begin::Card title */}
          <div className="card-title">
            {/* begin::Search */}
            <div className="d-flex align-items-center position-relative my-1">
              <i className="ki-duotone ki-magnifier fs-2 position-absolute ms-4">
                <span className="path1"></span>
                <span className="path2"></span>
              </i>
              <input
                type="text"
                data-kt-ecommerce-order-filter="search"
                className="form-control form-control-solid w-250px ps-12"
                placeholder="Search Report"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                } } />
            </div>
            {/* end::Search */}

          </div>
          {/* end::Card title */}

          {/* begin::Card toolbar */}
          <div className="card-toolbar flex-row-fluid justify-content-end gap-5">
            {/* begin::Flatpickr-based Daterangepicker */}
            <Flatpickr
              className="form-control form-control-solid w-100 mw-250px"
              placeholder="Pick date range"
              options={{
                mode: 'range', // Allows selection of multiple dates in a range
                dateFormat: 'Y-m-d', // Control display format
              }}
              // The value can be a string or array of date objects; here we store it as a string
              value={dateRange}
              onChange={(selectedDates, dateStr) => {
                setDateRange(dateStr); // e.g. "2025-01-01 to 2025-01-03" 
                setCurrentPage(1);
              } } />
            {/* end::Flatpickr-based Daterangepicker */}

            {/* begin::Filter (react-select) */}
            <div
              className="w-150px"
              data-control="select2"
              data-hide-search="true"
              data-placeholder="Rating"
              data-kt-ecommerce-order-filter="rating"
            >
              <Select
                className="react-select-styled react-select-solid"
                classNamePrefix="react-select"
                options={ratingOptions}
                placeholder="Rating"
                value={ratingOptions.find((opt) => opt.value === selectedRating)}
                onChange={(option) => {
                  setSelectedRating(option?.value || '');
                  setCurrentPage(1);
                } } />
            </div>
            {/* end::Filter */}

            {/* begin::Sort By Filter */}
            <div
              className="w-150px"
              data-control="select2"
              data-hide-search="true"
              data-placeholder="Sort By"
            >
              <Select
                className="react-select-styled react-select-solid"
                classNamePrefix="react-select"
                options={[
                  { value: 'most_revenue', label: 'Most Revenue' },
                  { value: 'most_sold', label: 'Most Sold' },
                  { value: 'highest_rating', label: 'Highest Rating' }
                ]}
                placeholder="Sort By"
                value={{ 
                  value: sortBy, 
                  label: sortBy === 'most_revenue' 
                    ? 'Most Revenue' 
                    : sortBy === 'most_sold' 
                      ? 'Most Sold' 
                      : 'Highest Rating' 
                }}
                onChange={(option) => {
                  setSortBy(option?.value as any);
                  setCurrentPage(1);
                } } />
            </div>
            {/* end::Sort By Filter */}

            {/* begin::Export dropdown */}
            <a
              href="#"
              className="btn btn-light-primary"
              data-kt-menu-trigger="click"
              data-kt-menu-placement="bottom-end"
              onClick={(e) => {
                e.preventDefault();
                handleExportReport();
              } }
            >
              <i className="ki-duotone ki-exit-up fs-2">
                <span className="path1"></span>
                <span className="path2"></span>
              </i>
              Export Report
            </a>

            <div
              id="kt_ecommerce_report_views_export_menu"
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
            {/* end::Export dropdown */}
          </div>
          {/* end::Card toolbar */}
        </div>
        {/* end::Card header */}

        {/* begin::Card body */}
        <div className="card-body pt-0">
          {isLoading && (
            <div className="d-flex justify-content-center py-10">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}

          {!isLoading && error && (
            <div className="alert alert-danger">
              {typeof error === 'string' ? error : 'An error occurred while fetching data'}
            </div>
          )}

          {!isLoading && !error && (
            <>
              {/* begin::Table */}
              <table
                className="table align-middle table-row-dashed fs-6 gy-5"
                id="kt_ecommerce_report_views_table"
              >
                <thead>
                  <tr className="text-start text-gray-500 fw-bold fs-7 text-uppercase gs-0">
                    <th className="min-w-150px">Product</th>
                    <th className="text-end min-w-100px">ID</th>
                    <th className="text-end min-w-100px">Rating</th>
                    <th className="text-end min-w-100px">Price</th>
                    <th className="text-end min-w-120px">Total Revenue</th>
                    <th className="text-end min-w-100px">Times Sold</th>
                  </tr>
                </thead>
                <tbody className="fw-semibold text-gray-600">
                  {filteredData.map((item: ProductPerformanceStats) => (
                    <tr key={item.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          {/* begin::Thumbnail */}
                          <a href="#" className="symbol symbol-50px">
                            <span
                              className="symbol-label"
                              style={{ backgroundImage: `url(${item.thumbnail_full_url?.path || ''})` }}
                            ></span>
                          </a>
                          {/* end::Thumbnail */}
                          <div className="ms-5">
                            {/* begin::Title */}
                            <a
                              href="#"
                              className="text-gray-800 text-hover-primary fs-5 fw-bold"
                              data-kt-ecommerce-product-filter="product_name"
                            >
                              {item.name}
                            </a>
                            {/* end::Title */}
                          </div>
                        </div>
                      </td>
                      <td className="text-end pe-0">
                        <span className="fw-bold">{item.id}</span>
                      </td>
                      <td
                        className="text-end pe-0"
                        data-order={`rating-${Math.round(item.rating)}`}
                        data-filter={`rating-${Math.round(item.rating)}`}
                      >
                        <div className="rating justify-content-end">{renderRatingStars(item.rating)}</div>
                      </td>
                      <td className="text-end pe-0">
                        <span>{formatCurrency(item.price)}</span>
                      </td>
                      <td className="text-end pe-0">
                        <span className="fw-bold text-success">{formatCurrency(item.total_revenue)}</span>
                      </td>
                      <td className="text-end pe-0">{item.times_sold.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* end::Table */}

              {/* begin::Pagination Widget */}
              <PaginationWidget
                totalEntries={totalEntries}
                entriesPerPage={entriesPerPage}
                onPageChange={handlePageChange} />
              {/* end::Pagination Widget */}
            </>
          )}
        </div>
        {/* end::Card body */}
      </div></>
  );
};

export default ProductReportPage;
