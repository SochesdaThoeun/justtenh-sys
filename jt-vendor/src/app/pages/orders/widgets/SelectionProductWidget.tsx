import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/app/redux/store';
import { toast } from 'sonner';
import { 
  fetchProducts, 
  addToCart, 
  setProductPage,
  setProductSearch,
} from '@/app/redux/order/orderCreation.slice';
import { Product } from '@/app/redux/product/product.models';
import { skuToNumber, makeVariantId } from '../utils/order.untils';

interface ProductWidgetProps {
  onAddProduct?: (product: Product) => void;
}

// Widget for displaying products to select
const SelectionProductWidget: React.FC<ProductWidgetProps> = ({
  onAddProduct,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  
  // Get Redux state
  const { 
    products, 
    productsLoading, 
    productsError, 
    productPage, 
    totalProducts, 
    productsPerPage, 
    productSearch,
    cartItems,
  } = useSelector((state: RootState) => state.orderCreation);

  // Search
  const [searchValue, setSearchValue] = useState<string>('');
  
  // Variation quantity selection
  const [variationQuantities, setVariationQuantities] = useState<{[key: number]: number}>({});
  
  // Reset variation quantities for a specific product
  const resetVariationQuantities = (productId: number | undefined) => {
    if (!productId) return;
    
    setVariationQuantities(prev => {
      const updated = { ...prev };
      // Find and reset all quantities related to this product's variants
      if (products.length > 0) {
        const product = products.find(p => p.id === productId);
        if (product?.variation) {
          product.variation.forEach(variant => {
            const variantId = makeVariantId(productId, variant.type || '');
            if (updated[variantId] !== undefined) {
              delete updated[variantId];
            }
          });
        } else {
          // Handle non-variant product
          const variantId = makeVariantId(productId, 'default');
          if (updated[variantId] !== undefined) {
            delete updated[variantId];
          }
        }
      }
      return updated;
    });
  };
  
  // Setup modal event listeners for resetting quantities on close
  useEffect(() => {
    // Create handler functions that we can reference for both adding and removing
    const modalHandlers: {[key: number]: () => void} = {};
    
    // Add event listeners after a slight delay to ensure Bootstrap has initialized the modals
    const setupEventListeners = () => {
      // Add event listeners to all product variation modals
      products.forEach(product => {
        if (product.id) {
          const modalId = `productVariationModal-${product.id}`;
          const modalElement = document.getElementById(modalId);
          
          if (modalElement) {
            // Store the handler function so we can reference it for cleanup
            const handler = () => resetVariationQuantities(product.id);
            modalHandlers[product.id] = handler;
            
            modalElement.addEventListener('hidden.bs.modal', handler);
          }
        }
      });
    };
    
    // Wait a bit for Bootstrap to initialize the modals
    const timer = setTimeout(setupEventListeners, 100);
    
    // Cleanup event listeners on component unmount or products change
    return () => {
      clearTimeout(timer);
      products.forEach(product => {
        if (product.id) {
          const modalId = `productVariationModal-${product.id}`;
          const modalElement = document.getElementById(modalId);
          
          if (modalElement && modalHandlers[product.id]) {
            modalElement.removeEventListener('hidden.bs.modal', modalHandlers[product.id]);
          }
        }
      });
    };
  }, [products]);
  
  // Handle quantity change for variations
  const handleVariationQuantityChange = (variantId: number, change: number, maxStock: number) => {
    setVariationQuantities(prev => {
      // Initialize to 0 if not set
      const currentQty = prev[variantId] || 0;
      const newQty = currentQty + change;
      
      // Ensure quantity is between 0 and available stock
      if (newQty >= 0 && newQty <= maxStock) {
        return { ...prev, [variantId]: newQty };
      } else if (newQty > maxStock) {
        toast.warning(`Cannot add more units. Maximum stock (${maxStock}) reached.`);
      }
      return prev;
    });
  };
  
  // Get quantity for a specific variant
  const getVariationQuantity = (variantId: number) => {
    return variationQuantities[variantId] || 0;
  };
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };
  
  // Handle search submit with delay to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setProductSearch(searchValue));
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchValue, dispatch]);
  
  // Fetch products when page or search changes
  useEffect(() => {
    dispatch(fetchProducts({ page: productPage, search: productSearch }));
  }, [dispatch, productPage, productSearch]);
  
  // Add product to cart
  const handleAddProduct = (productId: number) => {
    // Check if it's a regular product ID
    const product = products.find(p => p.id === productId);
    
    if (product) {
      if (onAddProduct) {
        // Use custom handler if provided
        onAddProduct(product);
      } else {
        // Check if the product is already in the cart
        const existingItem = cartItems.find(item => item.id === productId && !item.variant_id);
        
        if (existingItem && existingItem.quantity >= existingItem.stock) {
          toast.warning(`Cannot add more units. Maximum stock (${existingItem.stock}) reached.`);
          return;
        }
        
        // Fall back to default behavior
        dispatch(addToCart(product));
      }
      return;
    }
    
    // If not a regular product, it's likely a variant
    // Check if the ID is a generated variant ID (productId * 100 + index)
    for (const baseProduct of products) {
    
      if (baseProduct.variation && baseProduct.variation.length > 0) {
        // Find the index in the variation array
        for (let i = 0; i < baseProduct.variation.length; i++) {
          const variant = baseProduct.variation[i];
          
          const possibleVariantId = makeVariantId(baseProduct.id!, variant.type || '');
          
          if (possibleVariantId === productId) {
            const variant = baseProduct.variation[i];
            
            // Check if this variant is already in the cart and has reached stock limit
            const existingItem = cartItems.find(item => item.variant_id === productId);
            
            if (existingItem && existingItem.quantity >= existingItem.stock) {
              toast.warning(`Cannot add more of ${variant.type || 'this variant'}. Maximum stock (${existingItem.stock}) reached.`);
              return;
            }
            
            // Create a merged product with variant data
            const variantProduct = {
              ...baseProduct,
              id: baseProduct.id,  // Keep the original product ID
              variant_id: possibleVariantId,  // Store the variant ID separately
              sku: variant.type || '',
              price: variant.price || baseProduct.unit_price,
              current_stock: variant.qty || 0,
              variant_type: variant.type || '',
              // Create a name that includes the variant type
              name: variant.type 
                ? `${baseProduct.name || 'Unnamed Product'} - ${variant.type}` 
                : baseProduct.name || 'Unnamed Product',
            };
            
            if (onAddProduct) {
              // Use custom handler if provided
              onAddProduct(variantProduct as Product);
            } else {
              // Fall back to default behavior
              dispatch(addToCart(variantProduct as any));
            }
            return;
          }
        }
      } else if (baseProduct.id) {
        // Handle non-variant products
        const possibleVariantId = makeVariantId(baseProduct.id, 'default');
        
        if (possibleVariantId === productId) {
          // Check if this product is already in the cart and has reached stock limit
          const existingItem = cartItems.find(item => 
            (item.id === baseProduct.id && !item.variant_id) || 
            item.variant_id === productId
          );
          
          if (existingItem && existingItem.quantity >= existingItem.stock) {
            toast.warning(`Cannot add more units. Maximum stock (${existingItem.stock}) reached.`);
            return;
          }
          
          // Create a product with variant ID for non-variant products
          const regularProduct = {
            ...baseProduct,
            variant_id: possibleVariantId,
            variant_type: 'default',
          };
          
          if (onAddProduct) {
            // Use custom handler if provided
            onAddProduct(regularProduct as Product);
          } else {
            // Fall back to default behavior
            dispatch(addToCart(regularProduct as any));
          }
          return;
        }
      }
    }
  };
  
  // Handle pagination
  const handlePageChange = (page: number) => {
    dispatch(setProductPage(page));
  };
  
  // Calculate total pages for pagination
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  
  return (
    <div className="card card-flush py-4">
      <div className="card-header">
        <div className="card-title">
          <h2>Select product to add</h2>
        </div>
      </div>
      <div className="card-body pt-0">
        {/* Search box */}
        <div className="d-flex align-items-center position-relative mb-7">
          <i className="ki-outline ki-magnifier fs-3 position-absolute ms-4"></i>
          <input
            type="text"
            value={searchValue}
            onChange={handleSearchChange}
            className="form-control form-control-solid w-100 w-lg-50 ps-12"
            placeholder="Search Products by Name, SKU, or Code"
          />
        </div>

        {/* Error state */}
        {productsError && (
          <div className="alert alert-danger">
            <div className="d-flex flex-column">
              <h4 className="mb-1 text-danger">Error loading products</h4>
              <span>{productsError}</span>
            </div>
          </div>
        )}

        {/* Loading state */}
        {productsLoading && (
          <div className="d-flex justify-content-center my-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading products...</span>
            </div>
          </div>
        )}

        {/* Table of products */}
        {!productsLoading && !productsError && (
          <>
            <div className="table-responsive mb-5">
              <table className="table align-middle table-row-dashed fs-6 gy-5">
                <thead>
                  <tr className="text-start text-gray-500 fw-bold fs-7 text-uppercase gs-0">
                    <th className="min-w-200px">Product</th>
                    <th className="min-w-100px">Price</th>
                    <th className="min-w-50px text-center">Stock</th>
                    <th className="min-w-100px text-end">Action</th>
                  </tr>
                </thead>
                <tbody className="fw-semibold text-gray-600">
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-5">
                        No products found. Try a different search term.
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => (
                      <tr key={product.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <a href="#" className="symbol symbol-50px">
                              <span
                                className="symbol-label"
                                style={{
                                  backgroundImage: product.thumbnail_full_url?.path 
                                    ? `url(${product.thumbnail_full_url.path})`
                                    : 'url(assets/media/stock/ecommerce/placeholder.png)'
                                }}
                              />
                            </a>
                            <div className="ms-5">
                              <a
                                href="#"
                                className="text-gray-800 text-hover-primary fs-5 fw-bold"
                              >
                                {product.name || 'Unnamed Product'}
                              </a>
                              <div className="fw-semibold fs-7">
                                SKU: {product.variation?.[0]?.sku || 'N/A'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>${(product.unit_price || 0).toFixed(2)}</td>
                        <td className="text-center">
                          {product.current_stock && product.current_stock < 5 ? (
                            <span className="badge badge-light-warning">Low</span>
                          ) : product.current_stock === 0 ? (
                            <span className="badge badge-light-danger">Out</span>
                          ) : null}
                          <span className="fw-bold ms-2">{product.current_stock || 0}</span>
                        </td>
                        <td className="text-end">
                          <button
                            type="button"
                            className="btn btn-sm btn-light-primary"
                            data-bs-toggle="modal"
                            data-bs-target={`#productVariationModal-${product.id}`}
                          >
                            Select
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Product Modals - For all products (with or without variations) */}
            {products.map((product) => {
              const hasVariations = product.variation && product.variation.length > 0;
              
              return (
                <div 
                  key={`modal-${product.id}`}
                  className="modal fade" 
                  id={`productVariationModal-${product.id}`} 
                  tabIndex={-1} 
                  aria-hidden="true"
                >
                  <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">
                          {hasVariations ? "Select Variation" : "Select Quantity"}
                        </h5>
                        <button 
                          type="button" 
                          className="btn-close" 
                          data-bs-dismiss="modal" 
                          aria-label="Close"
                        ></button>
                      </div>
                      <div className="modal-body">
                        <div className="mb-3">
                          <h4>{product.name || 'Unnamed Product'}</h4>
                        </div>
                        <div className="table-responsive">
                          <table className="table table-row-dashed align-middle gs-0 gy-3">
                            <thead>
                              <tr className="fw-bold text-muted">
                                <th>Variation</th>
                                <th>SKU</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Quantity</th>
                              </tr>
                            </thead>
                            <tbody>
                              {hasVariations && product.variation ? (
                                // Render variations if product has them
                                product.variation.map((variant, index) => {
                                  const variantId = makeVariantId(product.id!, variant.type || '');
                                  const quantity = getVariationQuantity(variantId);
                                  const maxStock = variant.qty || 0;
                                  
                                  return (
                                    <tr key={`${product.id}-${index}`}>
                                      <td>{variant.type || 'Default'}</td>
                                      <td>{variant.sku || 'N/A'}</td>
                                      <td>${((variant.price || product.unit_price) || 0).toFixed(2)}</td>
                                      <td>
                                        {variant.qty && variant.qty < 5 ? (
                                          <span className="badge badge-light-warning">Low</span>
                                        ) : variant.qty === 0 ? (
                                          <span className="badge badge-light-danger">Out</span>
                                        ) : null}
                                        <span className="fw-bold ms-2">{variant.qty || 0}</span>
                                      </td>
                                      <td>
                                        <div className="d-flex align-items-center">
                                          <button
                                            type="button"
                                            className="btn btn-icon btn-sm btn-light-primary"
                                            onClick={() => handleVariationQuantityChange(variantId, -1, maxStock)}
                                            disabled={quantity <= 0 || maxStock === 0}
                                          >
                                            <i className="ki-outline ki-minus fs-2"></i>
                                          </button>
                                          <span className="mx-3 fw-bold">{quantity}</span>
                                          <button
                                            type="button"
                                            className="btn btn-icon btn-sm btn-light-primary"
                                            onClick={() => handleVariationQuantityChange(variantId, 1, maxStock)}
                                            disabled={quantity >= maxStock || maxStock === 0}
                                          >
                                            <i className="ki-outline ki-plus fs-2"></i>
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })
                              ) : (
                                // Render single row for products without variations
                                (() => {
                                  const variantId = makeVariantId(product.id!, 'default');
                                  const quantity = getVariationQuantity(variantId);
                                  const maxStock = product.current_stock || 0;
                                  
                                  return (
                                    <tr key={`${product.id}-default`}>
                                      <td>Default</td>
                                      <td>{product.sku || 'N/A'}</td>
                                      <td>${(product.unit_price || 0).toFixed(2)}</td>
                                      <td>
                                        {product.current_stock && product.current_stock < 5 ? (
                                          <span className="badge badge-light-warning">Low</span>
                                        ) : product.current_stock === 0 ? (
                                          <span className="badge badge-light-danger">Out</span>
                                        ) : null}
                                        <span className="fw-bold ms-2">{product.current_stock || 0}</span>
                                      </td>
                                      <td>
                                        <div className="d-flex align-items-center">
                                          <button
                                            type="button"
                                            className="btn btn-icon btn-sm btn-light-primary"
                                            onClick={() => handleVariationQuantityChange(variantId, -1, maxStock)}
                                            disabled={quantity <= 0 || maxStock === 0}
                                          >
                                            <i className="ki-outline ki-minus fs-2"></i>
                                          </button>
                                          <span className="mx-3 fw-bold">{quantity}</span>
                                          <button
                                            type="button"
                                            className="btn btn-icon btn-sm btn-light-primary"
                                            onClick={() => handleVariationQuantityChange(variantId, 1, maxStock)}
                                            disabled={quantity >= maxStock || maxStock === 0}
                                          >
                                            <i className="ki-outline ki-plus fs-2"></i>
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })()
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                      <div className="modal-footer">
                        <button 
                          type="button" 
                          className="btn btn-light" 
                          data-bs-dismiss="modal"
                        >Close</button>
                        <button 
                          type="button" 
                          className="btn btn-primary" 
                          data-bs-dismiss="modal"
                          onClick={() => {
                            if (hasVariations && product.variation) {
                              // Find selected variants (with quantity > 0) and add each individually
                              let addedAny = false;
                              product.variation.forEach((variant, index) => {
                                const variantId = makeVariantId(product.id!, variant.type || '');
                                const quantity = getVariationQuantity(variantId);
                                
                                if (quantity > 0) {
                                  // Check if this variant is already in the cart and has reached stock limit
                                  const existingItem = cartItems.find(item => item.variant_id === variantId);
                                  const maxStock = variant.qty || 0;
                                  
                                  if (existingItem && existingItem.quantity >= existingItem.stock) {
                                    toast.warning(`Cannot add more of ${variant.type || 'this variant'}. Maximum stock (${existingItem.stock}) reached.`);
                                    return;
                                  }
                                  
                                  // Check if the requested quantity would exceed stock when combined with existing cart quantity
                                  if (existingItem && (existingItem.quantity + quantity > maxStock)) {
                                    const remainingStock = Math.max(0, maxStock - existingItem.quantity);
                                    toast.warning(`Only ${remainingStock} more units of ${variant.type || 'this variant'} available. Adjusting quantity.`);
                                    // Adjust the quantity to add the maximum possible
                                    if (remainingStock > 0) {
                                      setVariationQuantities(prev => ({
                                        ...prev,
                                        [variantId]: remainingStock
                                      }));
                                    } else {
                                      return; // Skip if no stock left
                                    }
                                  }
                                  
                                  addedAny = true;
                                  // Create a merged product with variant data
                                  const variantProduct = {
                                    ...product,
                                    id: product.id,
                                    variant_id: variantId,
                                    sku: variant.sku || '',
                                    price: variant.price || product.unit_price,
                                    current_stock: variant.qty || 0,
                                    variant_type: variant.type || '',
                                    name: variant.type 
                                      ? `${product.name || 'Unnamed Product'} - ${variant.type}` 
                                      : product.name || 'Unnamed Product',
                                    quantity: quantity
                                  };
                                  
                                  if (onAddProduct) {
                                    // Use custom handler if provided
                                    onAddProduct(variantProduct as Product);
                                  } else {
                                    // Fall back to default behavior - add each variant individually
                                    dispatch(addToCart(variantProduct as any));
                                  }
                                }
                              });
                            } else {
                              // Handle non-variant product
                              const variantId = makeVariantId(product.id!, 'default');
                              const quantity = getVariationQuantity(variantId);
                              
                              if (quantity > 0) {
                                // Check if this product is already in the cart and has reached stock limit
                                const existingItem = cartItems.find(item => 
                                  (item.id === product.id && !item.variant_id) || 
                                  item.variant_id === variantId
                                );
                                const maxStock = product.current_stock || 0;
                                
                                if (existingItem && existingItem.quantity >= existingItem.stock) {
                                  toast.warning(`Cannot add more units. Maximum stock (${existingItem.stock}) reached.`);
                                  return;
                                }
                                
                                // Check if the requested quantity would exceed stock when combined with existing cart quantity
                                if (existingItem && (existingItem.quantity + quantity > maxStock)) {
                                  const remainingStock = Math.max(0, maxStock - existingItem.quantity);
                                  toast.warning(`Only ${remainingStock} more units available. Adjusting quantity.`);
                                  // Adjust the quantity to add the maximum possible
                                  if (remainingStock > 0) {
                                    setVariationQuantities(prev => ({
                                      ...prev,
                                      [variantId]: remainingStock
                                    }));
                                  } else {
                                    return; // Skip if no stock left
                                  }
                                }
                                
                                // Create product with variant_id for tracking
                                const productWithQuantity = {
                                  ...product,
                                  variant_id: variantId,
                                  variant_type: 'default',
                                  quantity: quantity
                                };
                                
                                if (onAddProduct) {
                                  // Use custom handler if provided
                                  onAddProduct(productWithQuantity as Product);
                                } else {
                                  // Fall back to default behavior
                                  dispatch(addToCart(productWithQuantity as any));
                                }
                              }
                            }
                          }}
                        >
                          Add Selected
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-between align-items-center flex-wrap">
                <div className="d-flex flex-wrap py-2 mr-3">
                  <button
                    type="button"
                    className="btn btn-icon btn-sm btn-light-primary me-2"
                    onClick={() => handlePageChange(1)}
                    disabled={productPage === 1}
                  >
                    <i className="ki-outline ki-double-left fs-2"></i>
                  </button>
                  <button
                    type="button"
                    className="btn btn-icon btn-sm btn-light-primary me-2"
                    onClick={() => handlePageChange(productPage - 1)}
                    disabled={productPage === 1}
                  >
                    <i className="ki-outline ki-left fs-2"></i>
                  </button>

                  {/* Page numbers */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = Math.max(1, Math.min(productPage - 2 + i, totalPages));
                    return (
                      <button
                        key={page}
                        type="button"
                        className={`btn btn-icon btn-sm me-2 ${
                          page === productPage
                            ? 'btn-primary'
                            : 'btn-light-primary'
                        }`}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    className="btn btn-icon btn-sm btn-light-primary me-2"
                    onClick={() => handlePageChange(productPage + 1)}
                    disabled={productPage === totalPages}
                  >
                    <i className="ki-outline ki-right fs-2"></i>
                  </button>
                  <button
                    type="button"
                    className="btn btn-icon btn-sm btn-light-primary"
                    onClick={() => handlePageChange(totalPages)}
                    disabled={productPage === totalPages}
                  >
                    <i className="ki-outline ki-double-right fs-2"></i>
                  </button>
                </div>

                <div className="fs-6 text-gray-700">
                  Showing {(productPage - 1) * productsPerPage + 1} to {Math.min(productPage * productsPerPage, totalProducts)} of {totalProducts} products
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SelectionProductWidget; 