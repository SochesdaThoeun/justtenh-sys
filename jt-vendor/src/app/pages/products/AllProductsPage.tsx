import React, { useMemo, useEffect } from 'react'
import { KTIcon } from '../../../_metronic/helpers'
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchSellerProductList } from '../../redux/product/productslice'
import { getCategories } from '../../redux/category/category.slice';
import { AllProductsHeader } from './components/AllProductsHeader';
import { ProductWidget } from './components/ProductWidget';
import { AllProductsPagination } from './components/AllProductsPagination';
import { toast } from 'react-toastify';

type Props = {
  className: string
}

const AllProductsPage: React.FC<Props> = ({ className }) => {
  const dispatch = useAppDispatch();
  const { 
    isLoading, 
    error, 
    currentPage, 
    entriesPerPage,
    currentSearch,
    currentCategoryId,
    currentStatus
  } = useAppSelector((state) => state.product);
  
  const { 
    deleteProductSuccess, 
    deleteProductError,
    statusUpdateSuccess,
    statusUpdateError,
    quantityUpdateSuccess,
    quantityUpdateError,
    isDeleteProductLoading,
    isStatusUpdateLoading,
    isQuantityUpdateLoading
  } = useAppSelector((state) => state.productOperations);
  
  const { categories } = useAppSelector((state) => state.category);
  
  // Convert categories to react-select options
  const categoryOptions = useMemo(() => 
    categories.map((category) => ({
      value: category.id.toString(),
      label: category.name,
    })), [categories]);

  const statusOptions = [
    { value: '1', label: 'Active' },
    { value: '0', label: 'Inactive' },
  ]

  // Fetch categories on component mount
  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  // Fetch products on component mount and when search/filter/pagination changes
  useEffect(() => {
    const sellerId = '1'; // Replace with actual seller ID from your auth or context
    
    // Calculate offset based on current page and entries per page
    const offset = 1;
    
    dispatch(fetchSellerProductList({ 
      sellerId, 
      offset,
      limit: entriesPerPage,
      search: currentSearch,
      category_id: currentCategoryId,
      status: currentStatus
    }) as any);
  }, [dispatch, currentPage, entriesPerPage, currentSearch, currentCategoryId, currentStatus]);

  // Refresh product list after successful operations
  useEffect(() => {
    if (deleteProductSuccess || statusUpdateSuccess || quantityUpdateSuccess) {
      // Refresh the product list
      const sellerId = '1';
      const offset = 1;
      
      dispatch(fetchSellerProductList({ 
        sellerId, 
        offset,
        limit: entriesPerPage,
        search: currentSearch,
        category_id: currentCategoryId,
        status: currentStatus
      }) as any);
      
      // Show success messages
      if (deleteProductSuccess) {
        toast.success('Product deleted successfully');
      }
      
      if (statusUpdateSuccess) {
        toast.success('Product status updated successfully');
      }
      
      if (quantityUpdateSuccess) {
        toast.success('Product stock updated successfully');
      }
    }
    
    // Show error messages
    if (deleteProductError) {
      toast.error(`Error deleting product: ${deleteProductError}`);
    }
    
    if (statusUpdateError) {
      toast.error(`Error updating product status: ${statusUpdateError}`);
    }
    
    if (quantityUpdateError) {
      toast.error(`Error updating product stock: ${quantityUpdateError}`);
    }
  }, [deleteProductSuccess, statusUpdateSuccess, quantityUpdateSuccess, 
      deleteProductError, statusUpdateError, quantityUpdateError]);
  
  // -------------------------------------
  // RENDER
  // -------------------------------------
  return (
    <div className={`card ${className}`}>
      {/* begin::Header */}
      <AllProductsHeader
        categoryOptions={categoryOptions}
        statusOptions={statusOptions}
      />
      {/* end::Header */}

      {/* begin::Body */}
      <div className='card-body pt-0'>
        {isLoading || isDeleteProductLoading || isStatusUpdateLoading || isQuantityUpdateLoading ? (
          <div className="d-flex justify-content-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <>
            {/* begin::Table container */}
            <ProductWidget />
            {/* end::Table container */}

            {/* Add pagination component */}
            <AllProductsPagination />
          </>
        )}
        
        {error && (
          <div className="alert alert-danger mt-5">
            Error loading products: {error}
          </div>
        )}
      </div>
      {/* end::Body */}
    </div>
  )
}

export { AllProductsPage };


