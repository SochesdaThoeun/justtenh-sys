import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/app/redux/store';
import { 
  fetchOrderDetailsThunk,
  updateOrderStatusThunk,
  updatePaymentStatusThunk,
  clearErrors
} from '@/app/redux/order/orderDetails.slice';
import {
  resetOrderCreation,
  selectCustomer,
  setOrderStatus,
  setPaymentMethod,
  setShippingMethod,
  setBillingAddress,
  setShippingAddress,
  setSameAsBilling,
  addToCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
  placeOrder,
  setGuestCheckout,
  setOrderDate,
  setPaymentStatus,
  setShippingCost,
  setExtraDiscount,
  setExtraDiscountType,
  updateTaxSettings,
  updateOrder
} from '@/app/redux/order/orderCreation.slice';
import { Order, ShippingAddressData, BillingAddressData } from '@/app/redux/order/order.models';
import { Product } from '@/app/redux/product/product.models';
import { toast } from 'sonner';
import OrderEditDetailsWidget from '../widgets/OrderEditDetailsWiget';
import OrderEditListWidget from '../widgets/OrderEditListWidget';
import OrderEditDeliveryWidget from '../widgets/OrderEditDeliveryWidget';
import { makeVariantId } from '../utils/order.untils';

interface StockChange {
  productId: number;
  originalQuantity: number;
  currentQuantity: number;
}

const OrderEditPage: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    
    const [isLoading, setIsLoading] = useState(true);
    const [errors, setErrors] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [productsLoaded, setProductsLoaded] = useState(false);
    
    // Track stock changes to restore on submit/cancel
    const [originalStockState, setOriginalStockState] = useState<StockChange[]>([]);
    
    // Get order details from Redux
    const { orderDetails, error: orderDetailsError } = useSelector(
        (state: RootState) => state.orderDetailReducer
    );
    
    // Get order creation state
    const {
        cartItems,
        selectedCustomer,
        isGuestCheckout,
        billingAddress,
        shippingAddress,
        sameAsBilling,
        orderSubmitError,
        products,
    } = useSelector((state: RootState) => state.orderCreation);
    
    // Override standard cart actions to handle stock changes
    const handleAddProductToCart = (product: Product) => {
        // Track stock changes
        let stockItem = originalStockState.find(item => item.productId === product.id);
        
        if (!stockItem) {
            // First time adding this product, record initial state
            const newStockItem: StockChange = {
                productId: product.id!,
                originalQuantity: 0, // None in original order
                currentQuantity: 1    // Adding 1 now
            };
            setOriginalStockState(prev => [...prev, newStockItem]);
        } else {
            // Product already being tracked, update count
            setOriginalStockState(prev => 
                prev.map(item => 
                    item.productId === product.id 
                        ? { ...item, currentQuantity: item.currentQuantity + 1 } 
                        : item
                )
            );
        }
        
        // Add to cart as normal
        dispatch(addToCart(product));
        
        toast.success(`Added ${product.name || 'product'} to cart`);
    };
    
    const handleRemoveProductFromCart = (productId: number) => {
        // Find item in cart to get current quantity
        const cartItem = cartItems.find(item => item.id === productId);
        if (!cartItem) return;
        
        // Track stock change
        const stockItem = originalStockState.find(item => item.productId === productId);
        if (stockItem) {
            // Update stock tracking - removing this item
            setOriginalStockState(prev => 
                prev.map(item => 
                    item.productId === productId 
                        ? { ...item, currentQuantity: 0 } 
                        : item
                )
            );
        }
        
        // Remove from cart
        dispatch(removeCartItem(productId));
        
        toast.info(`Removed ${cartItem.name} from cart`);
    };
    
    const handleUpdateQuantity = (productId: number, newQuantity: number) => {
        // Find item in cart
        const cartItem = cartItems.find(item => item.id === productId);
        if (!cartItem) return;
        
        // Track stock change
        const stockItem = originalStockState.find(item => item.productId === productId);
        if (stockItem) {
            // Update stock tracking
            setOriginalStockState(prev => 
                prev.map(item => 
                    item.productId === productId 
                        ? { ...item, currentQuantity: newQuantity } 
                        : item
                )
            );
        }
        
        // Update cart
        dispatch(updateCartItemQuantity({ id: productId, quantity: newQuantity }));
    };
    
    // Fetch order details when component mounts
    useEffect(() => {
        if (orderId) {
            dispatch(resetOrderCreation()); // Reset any previous state
            dispatch(fetchOrderDetailsThunk(orderId))
                .then(() => {
                    setIsLoading(false);
                    ////console.log("Order details loaded successfully");
                })
                .catch((error) => {
                    console.error("Failed to load order details:", error);
                    setIsLoading(false);
                    toast.error("Failed to load order details");
                });
        }
        
        // Clean up stock tracking on unmount
        return () => {
            // Reset stock changes
            if (originalStockState.length > 0) {
                ////console.log("Restoring original stock on component unmount");
                restoreOriginalStock();
            }
        };
    }, [dispatch, orderId]);
    
    // Helper function to restore stock to original state
    const restoreOriginalStock = () => {
        // In a real implementation, this would call an API to update product stock
        // For now, we'll just log what would happen
        originalStockState.forEach(item => {
            const stockDiff = item.currentQuantity - item.originalQuantity;
            if (stockDiff !== 0) {
                ////console.log(`Restoring stock for product ${item.productId}: ${stockDiff > 0 ? 'Adding' : 'Removing'} ${Math.abs(stockDiff)} units`);
                // This would be an API call in production:
                // await updateProductStock(item.productId, item.originalQuantity);
            }
        });
        
        // Clear stock tracking
        setOriginalStockState([]);
    };
    
   
    
    // Populate form data when order details are loaded
    useEffect(() => {
        if (orderDetails && orderDetails.length > 0 && orderId && !productsLoaded) {
            try {
                ////console.log("Order details received:", orderDetails);
                
                // Start by clearing the cart to prevent duplicates
                dispatch(clearCart());
                
                // Clear stock tracking
                setOriginalStockState([]);
                
                // For order-level information, use the first order detail object's order property
                if (orderDetails[0] && orderDetails[0].order) {
                    const order = orderDetails[0].order as Order;
                    ////console.log("Order data found:", order);
                    
                    // Populate customer data
                    if (order.customer) {
                        ////console.log("Loading customer data:", order.customer);
                        // Convert customer type from Order model to Product model expected by selectCustomer
                        const customer = {
                            id: order.customer.id,
                            f_name: order.customer.f_name || order.billing_address_data?.contact_person_name,
                            l_name: order.customer.l_name || '',
                            phone: order.customer.phone || order.billing_address_data?.phone,
                            image: order.customer.image || '',
                            email: order.customer.email || order.billing_address_data?.email
                        };
                        dispatch(selectCustomer(customer));
                    } else {
                        // If customer is null, set as guest checkout
                        dispatch(setGuestCheckout(true));
                    }
                    
                    // Populate order date
                    if (order.created_at) {
                        dispatch(setOrderDate(order.created_at.split('T')[0]));
                    }
                    
                    // Populate order status, payment method, payment status, shipping method
                    if (order.order_status) {
                        dispatch(setOrderStatus(order.order_status));
                    }
                    
                    if (order.payment_method) {
                        dispatch(setPaymentMethod(order.payment_method));
                    }
                    
                    if (order.payment_status) {
                        dispatch(setPaymentStatus(order.payment_status));
                    }
                    
                    if (order.delivery_type) {
                        dispatch(setShippingMethod(order.delivery_type));
                    }
                    
                    // Update shipping cost
                    if (order.shipping_cost !== undefined) {
                        dispatch(setShippingCost(Number(order.shipping_cost)));
                    }
                    
                    // Update extra discount and discount type
                    if (order.extra_discount !== undefined) {
                        dispatch(setExtraDiscount(Number(order.extra_discount)));
                    }
                    
                    if (order.extra_discount_type) {
                        dispatch(setExtraDiscountType(order.extra_discount_type));
                    }
                    
                    // Set default tax model if available from first item
                    if (orderDetails[0].tax_model) {
                        const defaultTaxRate = orderDetails[0].tax || 0;
                        const defaultTaxModel = orderDetails[0].tax_model;
                        dispatch(updateTaxSettings({
                            taxRate: defaultTaxRate,
                            taxModel: defaultTaxModel
                        }));
                    }
                    
                    // Populate billing address
                    if (order.billing_address_data) {
                        dispatch(setBillingAddress(order.billing_address_data as BillingAddressData));
                    }
                    
                    // Populate shipping address
                    if (order.shipping_address_data) {
                        if (order.billing_address_data && 
                            JSON.stringify(order.shipping_address_data) === JSON.stringify(order.billing_address_data)) {
                            dispatch(setSameAsBilling(true));
                        } else {
                            dispatch(setSameAsBilling(false));
                            dispatch(setShippingAddress(order.shipping_address_data as ShippingAddressData));
                        }
                    }
                } else {
                    console.error("No order data found in order details");
                    toast.error("Missing order information");
                }
                
                // Products are in the orderDetails array directly
                ////console.log("Processing order items:", orderDetails.length);
                
                // Process each order detail item in the array
                for (const item of orderDetails) {
                    ////console.log("Processing order item:", item);
                    

                    
                    try {
                        if (!item.product_details) {
                            console.warn(`Missing product details for item ${item.id}`);
                            continue;
                        }
                        const possibleVariantId = makeVariantId(item.product_details.id!, item.variant || '');
                        ////console.log("variant", item.variant);
                        
                        // Create enhanced product object with merged stock information
                        const enhancedProduct = {
                            ...item.product_details,
                            variant_id: possibleVariantId,
                            quantity: item.qty || 1,
                            sku: item.variant || '',
                            variant_type: item.variant || '',
                            price: item.price || 0,
                            tax: item.tax || 0,
                            tax_model: item.tax_model || 'exclude',
                        }
                        ////console.log('order item', enhancedProduct);
                        
                        if (!enhancedProduct) {
                            console.warn(`Could not create enhanced product for item ${item.id}`);
                            continue;
                        }
                        
                        const quantity = item.quantity || item.qty || 1;
                        
                        // Add item to cart
                        dispatch(addToCart(enhancedProduct as any));
                        
                        // Add to stock tracking
                        setOriginalStockState(prev => [
                            ...prev, 
                            {
                                productId: enhancedProduct.id!,
                                originalQuantity: quantity,
                                currentQuantity: quantity
                            }
                        ]);
                        
                        
                    } catch (error) {
                        console.error(`Error adding product ${item.product_name || item.product_id} to cart:`, error);
                    }
                }
                
                setProductsLoaded(true);
                toast.success("Order loaded successfully");
            } catch (error) {
                console.error("Error processing order details:", error);
                toast.error("Error loading order data");
            }
        }
    }, [orderDetails, dispatch, orderId, productsLoaded, products]);
    
    // Log loaded cart items for debugging
    useEffect(() => {
        if (productsLoaded) {
            ////console.log("Current cart items:", cartItems);
            ////console.log("Stock tracking:", originalStockState);
        }
    }, [cartItems, productsLoaded, originalStockState]);
    
    // Handle form validation
    const validateForm = () => {
        const newErrors: string[] = [];
        
        if (cartItems.length === 0) {
            newErrors.push('Please add at least one product to the order');
        }
        
        if (!isGuestCheckout && !selectedCustomer) {
            newErrors.push('Please select a customer');
        }
        
        if (!billingAddress) {
            newErrors.push('Billing address is required');
        }
        
        if (!sameAsBilling && !shippingAddress) {
            newErrors.push('Shipping address is required');
        }
        
        setErrors(newErrors);
        return newErrors.length === 0;
    };
    
    // Handle update order
    const handleUpdateOrder = () => {
        if (!orderId) {
            toast.error('Invalid order ID');
            return;
        }
        
        if (validateForm()) {
            setIsSubmitting(true);
            
            // In a real implementation, we would update the stock based on differences
            // For now, we'll just log the stock changes
            ////console.log("Stock changes for order update:");
            originalStockState.forEach(item => {
                const stockDiff = item.currentQuantity - item.originalQuantity;
                if (stockDiff !== 0) {
                    ////console.log(`Product ${item.productId}: ${stockDiff > 0 ? 'Decrease' : 'Increase'} stock by ${Math.abs(stockDiff)} units`);
                    // This would be an API call in production:
                    // await updateProductStock(item.productId, -stockDiff);
                }
            });
            
            // Use the new updateOrder thunk to update the order
            dispatch(updateOrder(orderId))
                .then(() => {
                    // Clear stock tracking after successful submission
                    setOriginalStockState([]);
                    toast.success('Order updated successfully!');
                    setIsSubmitting(false);
                    //navigate(`/orders/details/${orderId}`);
                })
                .catch((error) => {
                    console.error("Error updating order:", error);
                    toast.error('Failed to update order');
                    setIsSubmitting(false);
                });
        }
    };
    
    // Handle cancel
    const handleCancel = () => {
        // Restore original stock on cancel
        if (originalStockState.length > 0) {
            restoreOriginalStock();
        }
        
        navigate(`/orders/list/all/order_details/${orderId}`);
    };
    
    return (
        <div className="d-flex flex-column gap-7">
            {isLoading ? (
                <div className="d-flex justify-content-center my-10">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading order details...</span>
                    </div>
                </div>
            ) : (
                <>
                    <div id="kt_ecommerce_edit_order_form" className="form d-flex flex-column flex-lg-row">
                        <OrderEditDetailsWidget />
                        <div className="d-flex flex-column flex-lg-row-fluid gap-7 gap-lg-10">
                            <OrderEditListWidget 
                                // Override with our custom handlers
                                onAddProduct={handleAddProductToCart}
                                onRemoveProduct={handleRemoveProductFromCart}
                                onUpdateQuantity={handleUpdateQuantity}
                            />
                            <OrderEditDeliveryWidget />
                        </div>
                    </div>
                    
                    {/* Error message display */}
                    {(errors.length > 0 || orderDetailsError || orderSubmitError) && (
                        <div className="alert alert-danger">
                            <div className="d-flex flex-column">
                                <h4 className="mb-1 text-danger">Please fix the following errors:</h4>
                                <ul className="list-unstyled">
                                    {errors.map((error, index) => (
                                        <li key={index}>• {error}</li>
                                    ))}
                                    {orderDetailsError && <li>• {orderDetailsError}</li>}
                                    {orderSubmitError && <li>• {orderSubmitError}</li>}
                                </ul>
                            </div>
                        </div>
                    )}
                    
                    {/* Submit button */}
                    <div className="d-flex justify-content-end">
                        <button 
                            type="button" 
                            className="btn btn-light me-5"
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>
                        <button 
                            type="button" 
                            className="btn btn-primary"
                            onClick={handleUpdateOrder}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Processing...
                                </>
                            ) : (
                                'Update Order'
                            )}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export {OrderEditPage};
