import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '@/app/redux/store';
import OrderEditDetailsWidget from '../widgets/OrderEditDetailsWiget';
import OrderEditListWidget from '../widgets/OrderEditListWidget';
import OrderEditDeliveryWidget from '../widgets/OrderEditDeliveryWidget';
import { 
    placeOrder, 
    resetOrderCreation,
    selectCustomer,
    setOrderStatus,
    setPaymentMethod,
    setShippingMethod,
    setBillingAddress,
    setShippingAddress,
    setSameAsBilling,
    addToCart
} from '@/app/redux/order/orderCreation.slice';
import { toast } from 'sonner';
import { ORDER_STATUS } from '@/app/constants/api.constants';

const OrderAddPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    
    // Get state from Redux
    const {
        cartItems,
        selectedCustomer,
        isGuestCheckout,
        billingAddress,
        shippingAddress,
        sameAsBilling,
        orderSubmitting,
        orderSubmitError,
        orderSubmitSuccess,
        createdOrderId,
        products
    } = useSelector((state: RootState) => state.orderCreation);
    
    // Track validation errors
    const [errors, setErrors] = useState<string[]>([]);
    
    // Reset order creation state when component mounts and unmounts
    useEffect(() => {
        // Reset state when component mounts
        dispatch(resetOrderCreation());
        
        // Reset state when component unmounts
        return () => {
            dispatch(resetOrderCreation());
        };
    }, [dispatch]);
    
    // Handle filling form with dummy data
    const handleInsertDummyData = () => {
        try {
            // 1. Customer details (OrderEditDetailsWidget)
            dispatch(selectCustomer({
                id: 1,
                f_name: 'John',
                l_name: 'Doe',
                phone: '+61 412 345 678',
                email: 'john.doe@example.com'
            }));
            
            // Order status, payment & shipping method
            dispatch(setOrderStatus(ORDER_STATUS.CONFIRMED));
            dispatch(setPaymentMethod('credit_card'));
            dispatch(setShippingMethod('express_shipping'));
            
            // 2. Billing and shipping addresses (OrderEditDeliveryWidget)
            const dummyBillingAddress = {
                contact_person_name: 'John Doe',
                address: '123 Main Street',
                city: 'Sydney',
                zip: '2000',
                phone: '+61 412 345 678',
                email: 'john.doe@example.com',
                country: 'AU',
                latitude: '-33.8688',
                longitude: '151.2093'
            };
            
            dispatch(setBillingAddress(dummyBillingAddress));
            
            // Set shipping to be the same as billing
            dispatch(setSameAsBilling(true));
            
            // 3. Add products to cart (OrderEditListWidget)
            // First check if we have products loaded, otherwise show a message
            if (products && products.length > 0) {
                // Add first two available products to cart
                const availableProducts = products.filter(p => p.current_stock && p.current_stock > 0);
                
                if (availableProducts.length > 0) {
                    // Add first product with quantity of 2
                    dispatch(addToCart(availableProducts[0]));
                    // Add the same product again to increase quantity
                    dispatch(addToCart(availableProducts[0]));
                    
                    // Add second product if available
                    if (availableProducts.length > 1) {
                        dispatch(addToCart(availableProducts[1]));
                    }
                } else {
                    toast.warning('No products with stock available. Please load products first.');
                }
            } else {
                toast.warning('Please load products first by going to the products tab');
            }
            
            toast.success('Dummy data inserted successfully!');
        } catch (error) {
            toast.error('Failed to insert dummy data');
            console.error('Error inserting dummy data:', error);
        }
    };
    
    // Handle order placement
    const handlePlaceOrder = () => {
        // Validate order
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
        
        // Update error state
        setErrors(newErrors);
        
        // If no errors, place order
        if (newErrors.length === 0) {
            dispatch(placeOrder());
        }
    };
    
    // Redirect on successful order creation
    useEffect(() => {
        if (orderSubmitSuccess && createdOrderId) {
            toast.success('Order created successfully!');
            
            // Navigate to order details page after a brief delay
            const timer = setTimeout(() => {
                navigate(`/orders/list/all/`);
            }, 1500);
            
            return () => clearTimeout(timer);
        }
    }, [orderSubmitSuccess, createdOrderId, navigate]);
    
    return (
        <div className="d-flex flex-column gap-7">
            {/* Order form */}
            <div id="kt_ecommerce_edit_order_form" className="form d-flex flex-column flex-lg-row" data-kt-redirect="apps/ecommerce/sales/listing.html">
                <OrderEditDetailsWidget />
                <div className="d-flex flex-column flex-lg-row-fluid gap-7 gap-lg-10">
                    <OrderEditListWidget />
                    <OrderEditDeliveryWidget />
                </div>
            </div>
            
            {/* Error message display */}
            {(errors.length > 0 || orderSubmitError) && (
                <div className="alert alert-danger">
                    <div className="d-flex flex-column">
                        <h4 className="mb-1 text-danger">Please fix the following errors:</h4>
                        <ul className="list-unstyled">
                            {errors.map((error, index) => (
                                <li key={index}>• {error}</li>
                            ))}
                            {orderSubmitError && <li>• {orderSubmitError}</li>}
                        </ul>
                    </div>
                </div>
            )}
            
            {/* Submit button */}
            <div className="d-flex justify-content-end">
                <button 
                    type="button"
                    className="btn btn-info me-5"
                    onClick={handleInsertDummyData}
                >
                    Insert Dummy Data
                </button>
                <button 
                    type="button" 
                    className="btn btn-light me-5"
                    onClick={() => navigate('/orders/list/all/')}
                >
                    Cancel
                </button>
                <button 
                    type="button" 
                    className="btn btn-primary"
                    onClick={handlePlaceOrder}
                    disabled={orderSubmitting}
                >
                    {orderSubmitting ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Processing...
                        </>
                    ) : (
                        'Place Order'
                    )}
                </button>
            </div>
        </div>
    );
};

export { OrderAddPage };
