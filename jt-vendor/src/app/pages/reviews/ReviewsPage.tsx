import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import Flatpickr from 'react-flatpickr';
import { PaginationWidget } from '../../components/common/PaginationWidget';
import { PageLink, PageTitle } from '../../../_metronic/layout/core';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { fetchReviews } from '../../redux/review/review.slice';
import { format } from 'date-fns';

const widgetsBreadCrumbs: Array<PageLink> = [
  {
    title: 'reviews',
    path: '/reviews/',
    isSeparator: false,
    isActive: false,
  },
];

const ReviewPage = () => {
  //--------------------------------------------------------------------------
  // Redux Hooks
  //--------------------------------------------------------------------------
  const dispatch = useDispatch<AppDispatch>();
  const { reviews = [], totalSize, loading } = useSelector((state: RootState) => state.review);


  //--------------------------------------------------------------------------
  // State Hooks
  //--------------------------------------------------------------------------
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState<Date[]>([]);
  const [selectedRating, setSelectedRating] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [entriesPerPage] = useState(10);

  //--------------------------------------------------------------------------
  // Fetch reviews on component mount and when filters change
  //--------------------------------------------------------------------------
  useEffect(() => {
    const params: any = {
      limit: entriesPerPage.toString(),
      page: currentPage.toString(),
      search: searchTerm || undefined
    };
    //console.log('page', currentPage);
    // Add rating filter if selected
    if (selectedRating && selectedRating !== 'all') {
      params.rating = selectedRating.replace('rating-', '');
    }
    
    // Add date range filter if selected
    if (dateRange.length === 2) {
      // Format dates as YYYY-MM-DD
      params.start_date = format(dateRange[0], 'yyyy-MM-dd');
      params.end_date = format(dateRange[1], 'yyyy-MM-dd');
      
      
    }
    
    // Fetch reviews
    dispatch(fetchReviews(params));
  }, [dispatch, currentPage, entriesPerPage, searchTerm, selectedRating, dateRange]);

  //--------------------------------------------------------------------------
  // react-select Options for Ratings
  //--------------------------------------------------------------------------
  const ratingOptions = [
    { value: 'all', label: 'All Ratings' },
    { value: 'rating-5', label: '5 Stars' },
    { value: 'rating-4', label: '4 Stars' },
    { value: 'rating-3', label: '3 Stars' },
    { value: 'rating-2', label: '2 Stars' },
    { value: 'rating-1', label: '1 Star' },
  ];

  //--------------------------------------------------------------------------
  // Handler: Export filtered reviews to CSV
  //--------------------------------------------------------------------------
  const handleExportCSV = () => {
    // 1) CSV headers
    let csv = 'Review ID,Product,Customer,Rating,Review,Reply,Date\n';

    // 2) Build each CSV row from the filtered data
    reviews.forEach((item) => {
      const {
        id,
        product,
        customer,
        rating,
        comment,
        reply,
        created_at
      } = item;

      const formattedDate = new Date(created_at).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });

      // Replace any commas in text fields and wrap in quotes for safety
      const safeReview = `"${comment?.replace(/"/g, '""') || 'N/A'}"`;
      const safeReply = `"${(reply || 'N/A').replace(/"/g, '""')}"`;
      const productName = product?.name || 'N/A';
      const customerName = customer?.name || 'N/A';

      csv += `${id},"${productName}","${customerName}",${rating},${safeReview},${safeReply},"${formattedDate}"\n`;
    });

    // 3) Trigger file download
    const blob = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'reviews.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  //--------------------------------------------------------------------------
  // onPageChange
  //--------------------------------------------------------------------------
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  //--------------------------------------------------------------------------
  // Helper: Render star rating
  //--------------------------------------------------------------------------
  const renderRatingStars = (rating: number) => {
    const totalStars = 5;
    const starsArray = [];
    for (let i = 0; i < totalStars; i++) {
      starsArray.push(
        <div key={i} className={`rating-label ${i < rating ? 'checked' : ''}`}>
          <i className="ki-duotone ki-star fs-6"></i>
        </div>
      );
    }
    return starsArray;
  };

  //--------------------------------------------------------------------------
  // Format date as required
  //--------------------------------------------------------------------------
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <>
      <PageTitle breadcrumbs={widgetsBreadCrumbs}>Reviews</PageTitle>
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
                placeholder="Search Reviews"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
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
                mode: 'range',
                dateFormat: 'Y-m-d',
              }}
              value={dateRange}
              onChange={(selectedDates) => {
                setDateRange(selectedDates);
                setCurrentPage(1);
              }}
            />
            {/* end::Flatpickr-based Daterangepicker */}

            {/* begin::Filter (react-select) */}
            <div
              className="w-150px"
              data-control="select2"
              data-hide-search="true"
              data-placeholder="Rating"
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
                }}
              />
            </div>
            {/* end::Filter */}

            {/* begin::Export dropdown */}
            <a
              href="#"
              className="btn btn-light-primary"
              data-kt-menu-trigger="click"
              data-kt-menu-placement="bottom-end"
              onClick={(e) => {
                e.preventDefault();
                handleExportCSV();
              }}
            >
              <i className="ki-duotone ki-exit-up fs-2">
                <span className="path1"></span>
                <span className="path2"></span>
              </i>
              Export Report
            </a>
            {/* end::Export dropdown */}
          </div>
          {/* end::Card toolbar */}
        </div>
        {/* end::Card header */}

        {/* begin::Card body */}
        <div className="card-body pt-0">
          {/* begin::Table */}
          {loading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <table
              className="table align-middle table-row-dashed fs-6 gy-5"
              id="kt_ecommerce_review_table"
            >
              <thead>
                <tr className="text-start text-gray-500 fw-bold fs-7 text-uppercase gs-0">
                  <th className="text-center">ID</th>
                  <th className="min-w-150px">Product</th>
                  <th className="min-w-150px">Customer</th>
                  <th className="text-center">Rating</th>
                  <th className="min-w-150px">Review</th>
                  <th className="min-w-150px">Reply</th>
                  <th className="text-center">Date</th>
                </tr>
              </thead>
              <tbody className="fw-semibold text-gray-600">
                {reviews.length > 0 ? (
                  reviews.map((item) => (
                    <tr key={item.id}>
                      {/* Review ID */}
                      <td className="text-center">{item.id}</td>

                      {/* Product */}
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="ms-2">
                            <a href="#" className="text-gray-800 text-hover-primary fs-6 fw-bold">
                              {item.product?.name || 'N/A'}
                            </a>
                          </div>
                        </div>
                      </td>

                      {/* Customer */}
                      <td>{item.customer?.name || 'N/A'}</td>

                      {/* Rating */}
                      <td className="text-center" data-order={`rating-${item.rating}`} data-filter={`rating-${item.rating}`}>
                        <div className="rating justify-content-center">
                          {renderRatingStars(item.rating)}
                        </div>
                      </td>

                      {/* Review Text */}
                      <td>{item.comment || 'N/A'}</td>

                      {/* Reply */}
                      <td>{item.reply ? item.reply : 'N/A'}</td>

                      {/* Date */}
                      <td className="text-center">{formatDate(item.created_at)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-5">
                      No reviews found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
          {/* end::Table */}

          {/* begin::Pagination Widget */}
          {reviews.length > 0 && (
            <PaginationWidget
              totalEntries={totalSize}
              entriesPerPage={entriesPerPage}
              onPageChange={handlePageChange}
            />
          )}
          {/* end::Pagination Widget */}
        </div>
        {/* end::Card body */}
      </div>
    </>
  );
};

export default ReviewPage;
