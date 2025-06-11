import React, { useState, useEffect } from 'react';
import { Product } from '../../../redux/models';
import { toast } from 'react-toastify';

interface UpdateStockModalProps {
  product: Product;
  onUpdateStock: (
    productId: number, 
    newStock: number, 
    variation?: Array<{ type: string; qty: number; price?: number; sku?: string }>
  ) => void;
}

export const UpdateStockModal: React.FC<UpdateStockModalProps> = ({ 
  product,
  onUpdateStock 
}) => {
  const [adjustmentType, setAdjustmentType] = useState<'add' | 'reduce'>('add');
  const [variationQuantities, setVariationQuantities] = useState<{[key: string]: number}>({});
  
  // Calculate total stock from all variations
  const calculateTotalStock = (): number => {
    if (!product.variation || product.variation.length === 0) {
      return product.current_stock || 0;
    }
    
    return product.variation.reduce((total, variant) => total + (variant.qty || 0), 0);
  };
  
  // Reset quantities when modal is opened with a new product
  useEffect(() => {
    setVariationQuantities({});
  }, [product.id]);
  
  // Handle quantity change for base product or variations
  const handleQuantityChange = (
    key: string, 
    change: number, 
    maxStock: number
  ) => {
    setVariationQuantities(prev => {
      const currentQty = prev[key] || 0;
      const newQty = currentQty + change;
      
      if (newQty >= 0) {
        return { ...prev, [key]: newQty };
      }
      return prev;
    });
  };
  
  // Get quantity value
  const getQuantity = (key: string): number => {
    return variationQuantities[key] || 0;
  };
  
  // Calculate new stock levels
  const getNewStockLevel = (currentStock: number, key: string): number => {
    const adjustment = getQuantity(key);
    return adjustmentType === 'add' 
      ? currentStock + adjustment 
      : currentStock - adjustment;
  };
  
  // Calculate new total stock based on all variant adjustments
  const calculateNewTotalStock = (): number => {
    if (!product.variation || product.variation.length === 0) {
      const baseStock = product.current_stock || 0;
      return getNewStockLevel(baseStock, 'base');
    }
    
    let newTotal = 0;
    product.variation.forEach(variant => {
      const variantKey = `variant-${variant.type}`;
      const currentStock = variant.qty || 0;
      
      if (getQuantity(variantKey) > 0) {
        newTotal += getNewStockLevel(currentStock, variantKey);
      } else {
        newTotal += currentStock;
      }
    });
    
    return newTotal;
  };
  
  // Check if any adjustments have been made
  const hasAnyAdjustments = (): boolean => {
    return Object.values(variationQuantities).some(qty => qty > 0);
  };
  
  // Handle form submission
  const handleSubmit = () => {
    if (!hasAnyAdjustments()) {
      toast.warning('Please enter at least one quantity adjustment');
      return;
    }
    
    // If product has variations, update each variant
    if (product.variation && product.variation.length > 0) {
      let hasErrors = false;
      
      // First calculate the new total stock from all variations
      const newTotalStock = calculateNewTotalStock();
      
      // Create an array to hold all updated variations
      const updatedVariation: Array<{ type: string; qty: number; price?: number; sku?: string }> = [];
      
      product.variation.forEach(variant => {
        const variantKey = `variant-${variant.type}`;
        const quantity = getQuantity(variantKey);
        
        if (quantity > 0) {
          const currentStock = variant.qty || 0;
          const newStock = getNewStockLevel(currentStock, variantKey);
          
          if (newStock < 0) {
            toast.error(`Cannot reduce more than available stock for ${variant.type}`);
            hasErrors = true;
            return;
          }
          
          // Make sure variant has a type property and it's not undefined
          if (variant.type) {
            // Add this variation to the updated variations array
            updatedVariation.push({ 
              type: variant.type, 
              qty: newStock, 
              price: variant.price,
              sku: variant.sku
            });
          }
        } else {
          // For variations that weren't changed, add them as is to maintain complete variation data
          if (variant.type) {
            updatedVariation.push({
              type: variant.type,
              qty: variant.qty || 0,
              price: variant.price,
              sku: variant.sku
            });
          }
        }
      });
      
      if (!hasErrors) {
        // Update stock with all variations (changed and unchanged)
        onUpdateStock(product.id!, newTotalStock, updatedVariation);
        
        // Reset form if successful
        setVariationQuantities({});
      }
    } else {
      // Update base product stock
      const baseKey = 'base';
      const quantity = getQuantity(baseKey);
      
      if (quantity > 0) {
        const currentStock = product.current_stock || 0;
        const newStock = getNewStockLevel(currentStock, baseKey);
        
        if (newStock < 0) {
          toast.error('Cannot reduce more than available stock');
          return;
        }
        
        // Update stock for base product (no variations)
        onUpdateStock(product.id!, newStock);
        
        // Reset form
        setVariationQuantities({});
      } else {
        toast.warning('Please enter a quantity adjustment');
      }
    }
  };
  
  return (
    <div className="modal fade" id={`update-stock-modal-${product.id}`} tabIndex={-1} aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered mw-650px">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Update Stock</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <div className="mb-5">
              <h4>{product.name}</h4>
            </div>
            
            <div className="mb-6">
              <label className="form-label fw-bold">Adjustment Type</label>
              <div className="d-flex">
                <div className="form-check form-check-custom form-check-solid form-check-sm me-5">
                  <input 
                    className="form-check-input" 
                    type="radio" 
                    name="adjustmentType" 
                    id={`add-stock-${product.id}`}
                    checked={adjustmentType === 'add'}
                    onChange={() => setAdjustmentType('add')}
                  />
                  <label className="form-check-label" htmlFor={`add-stock-${product.id}`}>
                    Add Stock
                  </label>
                </div>
                <div className="form-check form-check-custom form-check-solid form-check-sm">
                  <input 
                    className="form-check-input" 
                    type="radio" 
                    name="adjustmentType" 
                    id={`reduce-stock-${product.id}`}
                    checked={adjustmentType === 'reduce'}
                    onChange={() => setAdjustmentType('reduce')}
                  />
                  <label className="form-check-label" htmlFor={`reduce-stock-${product.id}`}>
                    Reduce Stock
                  </label>
                </div>
              </div>
            </div>
            
            {/* Display total stock information */}
            <div className="mb-5">
              <div className="d-flex justify-content-between align-items-center">
                <span className="fw-bold fs-6">Total Current Stock:</span>
                <span className="fw-bold fs-6">{calculateTotalStock()}</span>
              </div>
              
              {hasAnyAdjustments() && (
                <div className="d-flex justify-content-between align-items-center mt-2">
                  <span className="fw-bold fs-6">Projected New Total Stock:</span>
                  <span className="fw-bold fs-6">{calculateNewTotalStock()}</span>
                </div>
              )}
            </div>
            
            {product.variation && product.variation.length > 0 ? (
              // Show variants table when the product has variations
              <div className="table-responsive">
                <table className="table table-row-dashed align-middle gs-0 gy-3">
                  <thead>
                    <tr className="fw-bold text-muted">
                      <th>Variation</th>
                      <th>SKU</th>
                      <th>Current Stock</th>
                      <th>New Stock</th>
                      <th>Quantity to {adjustmentType === 'add' ? 'Add' : 'Reduce'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.variation.map((variant, index) => {
                      const variantKey = `variant-${variant.type}`;
                      const currentStock = variant.qty || 0;
                      const newStock = getNewStockLevel(currentStock, variantKey);
                      const isNegative = newStock < 0;
                      
                      return (
                        <tr key={`${product.id}-${index}`}>
                          <td>{variant.type || 'Default'}</td>
                          <td>{variant.sku || 'N/A'}</td>
                          <td>{currentStock}</td>
                          <td className={isNegative ? 'text-danger' : ''}>
                            {isNegative ? 'Invalid' : newStock}
                            {isNegative && (
                              <div className="text-danger fs-8 fw-normal">
                                Cannot be negative
                              </div>
                            )}
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <button
                                type="button"
                                className="btn btn-icon btn-sm btn-light-primary"
                                onClick={() => handleQuantityChange(variantKey, -1, currentStock)}
                                disabled={getQuantity(variantKey) <= 0}
                              >
                                <i className="ki-outline ki-minus fs-2"></i>
                              </button>
                              <input
                                type="number"
                                className="form-control form-control-sm mx-3 w-50px"
                                value={getQuantity(variantKey) || ''}
                                onChange={(e) => {
                                  const value = parseInt(e.target.value);
                                  if (!isNaN(value) && value >= 0) {
                                    setVariationQuantities(prev => ({
                                      ...prev,
                                      [variantKey]: value
                                    }));
                                  } else {
                                    setVariationQuantities(prev => ({
                                      ...prev,
                                      [variantKey]: 0
                                    }));
                                  }
                                }}
                                min="0"
                              />
                              <button
                                type="button"
                                className="btn btn-icon btn-sm btn-light-primary"
                                onClick={() => handleQuantityChange(variantKey, 1, currentStock)}
                              >
                                <i className="ki-outline ki-plus fs-2"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              // Show simple input for product without variations
              <div className="row mb-6">
                <div className="col-lg-6">
                  <div className="mb-4">
                    <label className="form-label fw-semibold">Current Stock:</label>
                    <div className="fs-5">{product.current_stock || 0}</div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="form-label fw-semibold">New Stock:</label>
                    <div className={`fs-5 ${getNewStockLevel(product.current_stock || 0, 'base') < 0 ? 'text-danger' : ''}`}>
                      {getNewStockLevel(product.current_stock || 0, 'base') < 0 ? 'Invalid' : getNewStockLevel(product.current_stock || 0, 'base')}
                    </div>
                    {getNewStockLevel(product.current_stock || 0, 'base') < 0 && (
                      <div className="text-danger fs-8">Stock cannot be negative</div>
                    )}
                  </div>
                </div>
                
                <div className="col-lg-6">
                  <label className="form-label fw-bold">Quantity to {adjustmentType === 'add' ? 'Add' : 'Reduce'}</label>
                  <div className="d-flex align-items-center">
                    <button
                      type="button"
                      className="btn btn-icon btn-sm btn-light-primary"
                      onClick={() => handleQuantityChange('base', -1, product.current_stock || 0)}
                      disabled={getQuantity('base') <= 0}
                    >
                      <i className="ki-outline ki-minus fs-2"></i>
                    </button>
                    <input
                      type="number"
                      className="form-control form-control-sm mx-3"
                      value={getQuantity('base') || ''}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (!isNaN(value) && value >= 0) {
                          setVariationQuantities(prev => ({
                            ...prev,
                            'base': value
                          }));
                        } else {
                          setVariationQuantities(prev => ({
                            ...prev,
                            'base': 0
                          }));
                        }
                      }}
                      min="0"
                    />
                    <button
                      type="button"
                      className="btn btn-icon btn-sm btn-light-primary"
                      onClick={() => handleQuantityChange('base', 1, product.current_stock || 0)}
                    >
                      <i className="ki-outline ki-plus fs-2"></i>
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            <div className="alert alert-info d-flex align-items-center mt-4">
              <i className="ki-outline ki-information-5 fs-2 me-2"></i>
              <div>
                {adjustmentType === 'add' 
                  ? 'Stock will be increased by the specified quantity.' 
                  : 'Stock will be decreased by the specified quantity.'}
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-light" data-bs-dismiss="modal">Cancel</button>
            <button 
              type="button" 
              className="btn btn-primary" 
              data-bs-dismiss="modal"
              onClick={handleSubmit}
              disabled={!hasAnyAdjustments() || 
                (product.variation && product.variation.length > 0
                  ? product.variation.some(v => {
                      const variantKey = `variant-${v.type}`;
                      return getQuantity(variantKey) > 0 && getNewStockLevel(v.qty || 0, variantKey) < 0;
                    })
                  : getNewStockLevel(product.current_stock || 0, 'base') < 0)
              }
            >
              Update Stock
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 