import React, { useState } from "react";

interface PaginationProps {
  totalEntries: number;
  entriesPerPage: number;
  onPageChange: (page: number) => void;
  onEntriesPerPageChange?: (entriesPerPage: number) => void;
  currentPage?: number;
}

const PaginationWidget: React.FC<PaginationProps> = ({
  totalEntries,
  entriesPerPage,
  onPageChange,
  onEntriesPerPageChange,
  currentPage: externalCurrentPage,
}) => {
  const [internalCurrentPage, setInternalCurrentPage] = useState<number>(1);
  
  // Use external currentPage if provided, otherwise use internal state
  const currentPage = externalCurrentPage !== undefined ? externalCurrentPage : internalCurrentPage;
  
  const totalPages = Math.ceil(totalEntries / entriesPerPage);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    
    // Only update internal state if external page is not provided
    if (externalCurrentPage === undefined) {
      setInternalCurrentPage(page);
    }
    
    onPageChange(page);
  };

  const entriesOptions = [10, 25, 50, 100];

  return (
    <div className="d-flex flex-stack flex-wrap pt-10">
      <div className="d-flex align-items-center fs-6 fw-bold text-gray-700">
        {onEntriesPerPageChange && (
          <div className="me-5">
            <select
              className="form-select form-select-sm"
              value={entriesPerPage}
              onChange={(e) => onEntriesPerPageChange(Number(e.target.value))}
            >
              {entriesOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )}
        Showing {entriesPerPage * (currentPage - 1) + 1} to{" "}
        {Math.min(entriesPerPage * currentPage, totalEntries)} of {totalEntries} entries
      </div>

      <ul className="pagination">
        <li
          className={`page-item previous ${currentPage === 1 ? "disabled" : ""}`}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          <a href="#" className="page-link" aria-label="Previous">
            <i className="previous"></i>
          </a>
        </li>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <li
            key={page}
            className={`page-item ${page === currentPage ? "active" : ""}`}
            onClick={() => handlePageChange(page)}
          >
            <a href="#" className="page-link">
              {page}
            </a>
          </li>
        ))}

        <li
          className={`page-item next ${currentPage === totalPages ? "disabled" : ""}`}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          <a href="#" className="page-link" aria-label="Next">
            <i className="next"></i>
          </a>
        </li>
      </ul>
    </div>
  );
};

export { PaginationWidget };
export type { PaginationProps };