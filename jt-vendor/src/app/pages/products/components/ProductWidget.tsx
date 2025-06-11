import React from 'react';
import { Product } from '../../../redux/models';
import { getStatusClass, getStatusText } from '../utils/product.utils';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { BarcodeModal } from './BarcodeModal';
import { UpdateStockModal } from './UpdateStockModal';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { deleteProduct, updateProductStatus, updateProductQuantity } from '../../../redux/product/productOperations.slice';
import { useParams } from 'react-router-dom';

export const ProductWidget: React.FC = () => {
  const { productId } = useParams<{ productId: string }>()
  const dispatch = useAppDispatch();
  const { sellerProductModel } = useAppSelector((state) => state.product);
  const products = sellerProductModel?.products || [];

  // Handle delete product
  const handleDeleteProduct = (productId: number) => {
    dispatch(deleteProduct(productId));
  };

  // Handle update stock
  const handleUpdateStock = (
    productId: number, 
    newStock: number, 
    variation?: Array<{ type: string; qty: number; price?: number; sku?: string }>
  ) => {
    dispatch(updateProductQuantity({
      productId,
      currentStock: newStock,
      variation
    }));
  };

  // Handle update status
  const handleUpdateStatus = (productId: number, status: 0 | 1) => {
    dispatch(updateProductStatus({ productId, status }));
  };

  return (
    <>
      <div className="table-responsive">
        <table className="table align-middle table-row-dashed fs-6 gy-5" id="kt_ecommerce_products_table">
          {/* begin::Table head */}
          <thead>
            <tr className="text-start text-gray-500 fw-bold fs-7 text-uppercase gs-0">
              <th className="w-10px pe-2">
                <div className="form-check form-check-sm form-check-custom form-check-solid me-3">
                  <input className="form-check-input" type="checkbox" data-kt-check="true" data-kt-check-target="#kt_ecommerce_products_table .form-check-input" value="1" />
                </div>
              </th>
              <th className="min-w-200px">Product</th>
              <th className="text-end min-w-100px" style={{paddingRight: '0'}}>Code</th>
              <th className="text-end min-w-70px" style={{paddingRight: '0'}}>Stock</th>
              <th className="text-end min-w-100px" style={{paddingRight: '0'}}>Price</th>
              <th className="text-end min-w-100px" style={{paddingRight: '0'}}>Rating</th>
              <th className="text-end min-w-100px" style={{paddingRight: '0'}}>Status</th>
              <th className="text-end min-w-70px">Actions</th>
            </tr>
          </thead>
          {/* end::Table head */}
          {/* begin::Table body */}
          <tbody className="fw-semibold text-gray-600">
            {products.length > 0 ? (
              products.map((product, index) => (
                <tr key={product.id || index}>
                  <td>
                    <div className="form-check form-check-sm form-check-custom form-check-solid">
                      <input className="form-check-input" type="checkbox" value={product.id} />
                    </div>
                  </td>
                  <td>
                    <div className="d-flex align-items-center">
                      <a href={`./edit?id=${product.id}`} className="symbol symbol-50px">
                        <span
                          className="symbol-label"
                          style={{ backgroundImage: `url(${product.thumbnail_full_url?.path})` }}
                        ></span>
                      </a>
                      <div className="ms-5">
                        <a
                          href={`./edit/${product.id}`}
                          className="text-gray-800 text-hover-primary fs-5 fw-bold"
                          data-kt-ecommerce-product-filter="product_name"
                        >
                          {product.name || 'Unnamed Product'}
                        </a>
                      </div>
                    </div>
                  </td>
                  <td className="text-end pe-0">
                    <span className="fw-bold">{product.code || 'N/A'}</span>
                  </td>
                  <td className="text-end pe-0" data-order={product.current_stock ?? 0}>
                    <div className={`badge badge-light-${(product.current_stock ?? 0) === 0 ? 'fail' : (product.current_stock ?? 0) < 30 ? 'warning' : 'success'}`}>
                      {(product.current_stock ?? 0) < 30 && (product.current_stock ?? 0) > 0 ? 'Low Stock' : null}
                      {(product.current_stock ?? 0) === 0 ? 'Out of Stock' : null}
                    </div>
                    <span className="fw-bold ms-3">{product.current_stock ?? 0}</span>
                  </td>
                  <td className="text-end pe-0">$ {(product.unit_price || 0).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                  <td className="text-end pe-0" data-order={`rating-${product.average_review}`}>
                    <div className="rating justify-content-end">
                      {[...Array(5)].map((_, i) => {
                        const ratingValue = parseFloat(product?.rating?.[0]?.average?.toString() ?? '0');
                        return (
                          <div
                            key={i}
                            className={`rating-label ${i < ratingValue ? "checked" : ""}`}
                          >
                            <i className="ki-solid ki-star fs-6"></i>
                          </div>
                        );
                      })}
                    </div>
                  </td>
                  <td className="text-end pe-0" data-order={product.status}>
                    <div className={`badge badge-light-${getStatusClass(product.status)}`}>
                      {getStatusText(product.status)}
                    </div>
                  </td>
                  <td className="text-end">
                    <div className="dropdown">
                      <button 
                        className="btn btn-sm btn-light btn-flex btn-center btn-active-light-primary" 
                        type="button" 
                        id={`dropdown-${product.id}`} 
                        data-bs-toggle="dropdown" 
                        aria-expanded="false"
                      >
                        Actions <i className="ki-outline ki-down fs-5 ms-1"></i>
                      </button>
                      <ul 
                        className="dropdown-menu menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-semibold fs-7 w-125px py-4" 
                        aria-labelledby={`dropdown-${product.id}`}
                      >
                        <li>
                          <a href={`./edit/${product.id}`} className="dropdown-item px-3">
                            Edit
                          </a>
                        </li>
                        <li>
                          <a
                            href="#"
                            className="dropdown-item px-3"
                            data-bs-toggle="modal"
                            data-bs-target={`#delete-product-modal-${product.id}`}
                          >
                            Delete
                          </a>
                        </li>
                        <li>
                          <a
                            href="#"
                            className="dropdown-item px-3"
                            data-bs-toggle="modal"
                            data-bs-target={`#barcode-modal-${product.id}`}
                          >
                            Barcode
                          </a>
                        </li>
                        <li>
                          <a
                            href="#"
                            className="dropdown-item px-3"
                            onClick={() => handleUpdateStatus(product.id || 0, product.status === 1 ? 0 : 1)}
                          >
                            {product.status === 1 ? 'Set Inactive' : 'Set Active'}
                          </a>
                        </li>
                        <li>
                          <a
                            href="#"
                            className="dropdown-item px-3"
                            data-bs-toggle="modal"
                            data-bs-target={`#update-stock-modal-${product.id}`}
                          >
                            Update Stock
                          </a>
                        </li>
                      </ul>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center py-5">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Render modals outside the table */}
      {products.map((product) => (
        <React.Fragment key={`modals-${product.id}`}>
          <DeleteConfirmationModal 
            productId={product.id || 0}
            productName={Array.isArray(product.name) ? product.name.join(', ') : (product.name || 'Unnamed Product')}
            onConfirmDelete={handleDeleteProduct}
          />
          <BarcodeModal 
            productId={product.id || 0}
            productName={Array.isArray(product.name) ? product.name.join(', ') : (product.name || 'Unnamed Product')}
            barcode={product.code || ''}
          />
          <UpdateStockModal 
            product={product}
            onUpdateStock={handleUpdateStock}
          />
        </React.Fragment>
      ))}
    </>
  );
}; 