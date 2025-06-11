import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { makeVariantId } from '@/app/pages/orders/utils/order.untils';

// Local interface for simplified product display
interface Product {
  id: number;
  image: string;
  title: string;
  note: string;
  price: number;
  current_stock?: number;
  variation?: ProductVariant[];
}

interface ProductVariant {
  id?: number;
  type: string;
  sku?: string;
  price?: number;
  qty?: number;
}

interface ProductListProps {
  products: Product[];
  loading: boolean;
  error: string | null;
  categoryId: string | number | undefined;
  onAddToOrder: (product: Product) => void;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  loading,
  error,
  categoryId,
  onAddToOrder,
}) => {
  // Selected variant and quantity
  const [selectedVariants, setSelectedVariants] = useState<{[key: number]: string}>({});
  const [quantityValues, setQuantityValues] = useState<{[key: number]: number}>({});
  
  // Reset selected variant and quantity when modal closes
  const resetProductSelections = (productId: number | undefined) => {
    if (!productId) return;
    
    setSelectedVariants(prev => {
      const updated = { ...prev };
      delete updated[productId];
      return updated;
    });
    
    setQuantityValues(prev => {
      const updated = { ...prev };
      delete updated[productId];
      return updated;
    });
  };
  
  // Setup modal event listeners for resetting selections on close
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
            const handler = () => resetProductSelections(product.id);
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
  
  // Handle quantity change
  const handleQuantityChange = (productId: number, change: number, maxStock: number = 100) => {
    setQuantityValues(prev => {
      // Initialize to 1 if not set
      const currentQty = prev[productId] || 1;
      const newQty = Math.max(1, currentQty + change);
      
      // Ensure quantity is between 1 and available stock
      if (newQty <= maxStock) {
        return { ...prev, [productId]: newQty };
      } else {
        toast.warning(`Cannot add more units. Maximum stock (${maxStock}) reached.`);
      }
      return prev;
    });
  };
  
  // Get current quantity for a product
  const getQuantity = (productId: number) => {
    return quantityValues[productId] || 1;
  };
  
  // Handle variant selection
  const handleVariantChange = (productId: number, variantType: string) => {
    setSelectedVariants(prev => ({
      ...prev,
      [productId]: variantType
    }));
  };
  
  // Get selected variant for a product
  const getSelectedVariant = (product: Product) => {
    if (!product.variation?.length) return null;
    
    const selectedType = selectedVariants[product.id];
    if (!selectedType) {
      // Set default selection to first variant if not set
      setSelectedVariants(prev => ({
        ...prev,
        [product.id]: product.variation![0].type
      }));
      return product.variation[0];
    }
    
    return product.variation.find(v => v.type === selectedType) || product.variation[0];
  };
  
  // Get max stock for the selected variant
  const getMaxStock = (product: Product) => {
    if (product.variation?.length) {
      const selectedVariant = getSelectedVariant(product);
      return selectedVariant?.qty || 0;
    }
    return product.current_stock || 0;
  };

  return (
    <>
      <div className="tab-content">
        {/* Tab Pane for the current category */}
        <div className="tab-pane fade show active">
          <div className="d-flex flex-wrap g-5 g-xl-8">
            {loading ? (
              <div className="d-flex w-100 justify-content-center p-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading products...</span>
                </div>
              </div>
            ) : error ? (
              <div className="alert alert-danger w-100">
                <strong>Error loading products:</strong> {error}
              </div>
            ) : products && products.length > 0 ? (
              // Display products
              products.map((product) => (
                <div
                  className="card card-flush col-sm-3 p-6 pb-2 cursor-pointer"
                  key={product.id}
                  data-bs-toggle="modal"
                  data-bs-target={`#productVariationModal-${product.id}`}
                >
                  <div className="card-body text-center">
                    <img
                      src={product.image}
                      className="rounded-3 mb-2 w-100px h-100px "
                      alt=""
                    />
                    <div className="mb-2">
                      <div className="text-center">
                        <span className="fw-bold text-gray-800 cursor-pointer text-hover-primary fs-18">
                          {product.title}
                        </span>
                        <span className="text-gray-500 fw-semibold d-block fs-18 mt-n1">
                          {product.note}
                        </span>
                      </div>
                    </div>
                    <span className="text-success text-end fw-bold fs-3">
                      ${product.price}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              // If no products, show empty message
              <div className="alert alert-info w-100">
                No products available
                {categoryId && categoryId !== 0 ? ` for this category` : ""}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Product Modals - For all products (with or without variations) */}
      {products.map((product) => {
        const hasVariations = product.variation && product.variation.length > 0;
        const selectedVariant = hasVariations ? getSelectedVariant(product) : null;
        const maxStock = getMaxStock(product);
        const currentQty = getQuantity(product.id);
        
        // Calculate current price based on selection
        const currentPrice = selectedVariant?.price || product.price;
        
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
                  <h5 className="modal-title">{product.title}</h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    data-bs-dismiss="modal" 
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="d-flex mb-5">
                    {/* Product Image */}
                    <div className="me-5">
                      <img 
                        src={product.image} 
                        className="rounded-3 w-125px h-125px" 
                        alt={product.title} 
                      />
                    </div>
                    {/* Product Info */}
                    <div>
                      <h4 className="fw-bold mb-2">{product.title}</h4>
                      <p className="text-gray-500">{product.note}</p>
                      <div className="text-success fw-bold fs-3 mt-3">${currentPrice.toFixed(2)}</div>
                    </div>
                  </div>
                  
                  <div className="mb-5">
                    {/* Variation Dropdown */}
                    {hasVariations && (
                      <div className="mb-5">
                        <label className="form-label fw-bold">Select Variation</label>
                        <select 
                          className="form-select form-select-solid"
                          value={selectedVariants[product.id] || (product.variation![0]?.type || '')}
                          onChange={(e) => handleVariantChange(product.id, e.target.value)}
                        >
                          {product.variation!.map((variant, idx) => (
                            <option key={idx} value={variant.type}>
                              {variant.type} - ${variant.price?.toFixed(2) || product.price.toFixed(2)}
                              {variant.qty !== undefined && ` (${variant.qty} in stock)`}
                            </option>
                          ))}
                        </select>
                        
                        {/* Show current stock for selected variant */}
                        {selectedVariant && (
                          <div className="mt-2 text-muted">
                            <span className="fw-bold">Stock:</span> {selectedVariant.qty || 0}
                            {selectedVariant.qty && selectedVariant.qty < 5 ? (
                              <span className="badge badge-light-warning ms-2">Low</span>
                            ) : selectedVariant.qty === 0 ? (
                              <span className="badge badge-light-danger ms-2">Out</span>
                            ) : null}
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Stock display for non-variant products */}
                    {!hasVariations && (
                      <div className="mb-3">
                        <span className="fw-bold">Stock:</span> {product.current_stock || 0}
                        {product.current_stock && product.current_stock < 5 ? (
                          <span className="badge badge-light-warning ms-2">Low</span>
                        ) : product.current_stock === 0 ? (
                          <span className="badge badge-light-danger ms-2">Out</span>
                        ) : null}
                      </div>
                    )}
                    
                    {/* Quantity Controls */}
                    <div className="mt-5">
                      <label className="form-label fw-bold">Quantity</label>
                      <div className="d-flex align-items-center">
                        <button
                          type="button"
                          className="btn btn-icon btn-light-primary"
                          onClick={() => handleQuantityChange(product.id, -1)}
                          disabled={currentQty <= 1}
                        >
                          <i className="ki-outline ki-minus fs-2"></i>
                        </button>
                        <span className="mx-5 fw-bold fs-2">{currentQty}</span>
                        <button
                          type="button"
                          className="btn btn-icon btn-light-primary"
                          onClick={() => handleQuantityChange(product.id, 1, maxStock)}
                          disabled={maxStock === 0 || currentQty >= maxStock}
                        >
                          <i className="ki-outline ki-plus fs-2"></i>
                        </button>
                      </div>
                    </div>
                    
                    {/* Total Price */}
                    <div className="d-flex justify-content-between align-items-center mt-7">
                      <span className="fw-bold fs-4">Total:</span>
                      <span className="text-success fw-bolder fs-2">${(currentPrice * currentQty).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-light" 
                    data-bs-dismiss="modal"
                  >Cancel</button>
                  <button 
                    type="button" 
                    className="btn btn-primary" 
                    data-bs-dismiss="modal"
                    disabled={maxStock === 0}
                    onClick={() => {
                      if (maxStock === 0) {
                        toast.error("This item is out of stock");
                        return;
                      }
                      
                      if (hasVariations && selectedVariant) {
                        // Create a product with variant data
                        const variantId = makeVariantId(product.id, selectedVariant.type);
                        const productWithVariant = {
                          ...product,
                          id: product.id,
                          variant_id: variantId,
                          sku: selectedVariant.sku || '',
                          price: selectedVariant.price || product.price,
                          current_stock: selectedVariant.qty || 0,
                          variant_type: selectedVariant.type || '',
                          variant_name: selectedVariant.type || 'Default',
                          name: `${product.title || 'Unnamed Product'} - ${selectedVariant.type}`,
                          quantity: currentQty,
                          total: (selectedVariant.price || product.price) * currentQty
                        };
                        
                        // Add to order
                        onAddToOrder(productWithVariant as any);
                      } else {
                        // Handle non-variant product
                        const variantId = makeVariantId(product.id, 'default');
                        const productWithQuantity = {
                          ...product,
                          variant_id: variantId,
                          variant_type: 'default',
                          variant_name: 'Default',
                          name: product.title,
                          quantity: currentQty,
                          total: product.price * currentQty
                        };
                        
                        // Add to order
                        onAddToOrder(productWithQuantity as any);
                      }
                      
                      // Reset after adding
                      resetProductSelections(product.id);
                    }}
                  >
                    Add to Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default ProductList; 