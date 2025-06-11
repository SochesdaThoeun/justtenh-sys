import React from "react";
import { Category } from "../../../redux/category/category.models";

interface CategoryListProps {
  loading: boolean;
  error: string | null;
  categories: Category[];
  onCategoryClick: (categoryId: number) => void;
  selectedCategoryId?: string | number;
}

const CategoryList: React.FC<CategoryListProps> = ({
  loading,
  error,
  categories,
  onCategoryClick,
  selectedCategoryId,
}) => {
  // All category option to be displayed first
  const allCategory = {
    id: 0,
    name: "All Products",
    icon_full_url: {
      path: "../../../../public/media/svg/food-icons/menu.svg",
    },
  };

  // Use real category data
  const displayCategories = categories && categories.length > 0 
    ? [allCategory, ...categories] 
    : [allCategory];

  // Check if a category is active
  const isCategoryActive = (categoryId: number) => {
    if (selectedCategoryId === undefined && categoryId === 0) {
      return true; // All Products is selected when no category is selected
    }
    return selectedCategoryId === categoryId.toString();
  };

  return (
    <div className="category-scroll-container" style={{ 
      width: "100%", 
      overflowX: "auto", 
      overflowY: "hidden",
      paddingBottom: "10px" /* Add padding to account for scrollbar */
    }}>
      <ul className="nav nav-pills d-flex nav-pills-custom gap-3 mb-6" style={{ 
        flexWrap: "nowrap", 
        minWidth: "min-content" 
      }}>
        {loading && !categories.length ? (
          <div className="d-flex w-100 justify-content-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading categories...</span>
            </div>
          </div>
        ) : error ? (
          <div className="alert alert-danger w-100">
            <strong>Error loading categories:</strong> {error}
          </div>
        ) : (
          displayCategories.map((category) => (
            <li className="nav-item mb-3 me-0" key={category.id} style={{ flexShrink: 0 }}>
              <a
                className={`nav-link nav-link-border-solid btn btn-outline btn-flex btn-active-color-primary flex-column flex-stack pt-9 pb-7 page-bg ${
                  isCategoryActive(category.id) ? "active" : ""
                }`}
                href="#"
                style={{ width: "138px", height: "180px" }}
                onClick={(e) => {
                  e.preventDefault();
                  onCategoryClick(category.id);
                }}
              >
                <div className="nav-icon mb-3">
                  <img
                    src={category.icon_full_url?.path}
                    className="w-50px"
                    alt=""
                  />
                </div>
                <div>
                  <span className="text-gray-800 fw-bold fs-2 d-block">
                    {category.name}
                  </span>
                </div>
              </a>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default CategoryList; 