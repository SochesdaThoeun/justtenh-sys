import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'sonner';
import { Customer, Product } from '../models';
import { 
  OrderCreationState, 
  CartItem, 
  CustomerResponse, 
  ProductResponse, 
  CouponResponse, 
  OrderResponse,
  OrderRequestPayload
} from './orderCreation.models';
import { 
  fetchCustomersService, 
  fetchProductsService, 
  validateCouponService, 
  placeOrderService,
  updateOrderService,
  calculateItemTotal 
} from './orderCreation.service';

// Initial state
const initialState: OrderCreationState = {
  // Customers
  customers: [],
  customersLoading: false,
  customersError: null,
  totalCustomers: 0,
  customerPage: 1,
  customerSearch: '',
  selectedCustomer: null,
  isGuestCheckout: false,

  // Products
  products: [],
  productsLoading: false,
  productsError: null,
  totalProducts: 0,
  productPage: 1,
  productsPerPage: 5,
  productSearch: '',
  selectedCategoryId: null,

  // Cart
  cartItems: [],
  
  // Order Details
  orderDate: new Date().toISOString().split('T')[0],
  orderNote: '',
  paymentMethod: 'cash_on_delivery',
  shippingMethod: 'standard_shipping',
  deliveryType: 'self_pickup',
  deliveryServiceName: '',
  thirdPartyTrackingId: '',
  orderStatus: 'pending',
  paymentStatus: 'unpaid',
  couponCode: '',
  couponDiscount: 0,
  couponDiscountType: 'amount',
  extraDiscount: 0,
  extraDiscountType: 'amount',
  shippingCost: 0,
  
  // Addresses
  billingAddress: null,
  shippingAddress: null,
  sameAsBilling: true,

  // Order submission
  orderSubmitting: false,
  orderSubmitError: null,
  orderSubmitSuccess: false,
  createdOrderId: null,
};

// Async Thunks
export const fetchCustomers = createAsyncThunk<
  CustomerResponse,
  { page?: number; search?: string; limit?: number },
  { rejectValue: string }
>(
  'orderCreation/fetchCustomers',
  async ({ 
    page = 1, 
    search = '', 
    limit = 10 
  }, { rejectWithValue }) => {
    try {
      return await fetchCustomersService(page, search, limit);
    } catch (error) {
      return rejectWithValue('Failed to fetch customers');
    }
  }
);

export const fetchProducts = createAsyncThunk<
  ProductResponse,
  { page?: number; search?: string; limit?: number; category_id?: string | null },
  { rejectValue: string }
>(
  'orderCreation/fetchProducts',
  async ({
    page = 1,
    search = '',
    limit = 5,
    category_id = null
  }, { rejectWithValue }) => {
    try {
      return await fetchProductsService(page, search, limit, category_id);
    } catch (error) {
      console.error('Error fetching products:', error);
      return rejectWithValue('Failed to fetch products');
    }
  }
);

export const validateCoupon = createAsyncThunk<
  CouponResponse,
  { coupon_code: string; customer_id: number; order_amount: number },
  { rejectValue: string }
>(
  'orderCreation/validateCoupon',
  async ({ 
    coupon_code, 
    customer_id, 
    order_amount 
  }, { rejectWithValue }) => {
    try {
      return await validateCouponService(coupon_code, customer_id, order_amount);
    } catch (error) {
      return rejectWithValue('Invalid coupon code');
    }
  }
);

export const placeOrder = createAsyncThunk<
  OrderResponse,
  void,
  { rejectValue: string; state: { orderCreation: OrderCreationState } }
>(
  'orderCreation/placeOrder',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { orderCreation: OrderCreationState };
      const {
        cartItems,
        selectedCustomer,
        isGuestCheckout,
        orderDate,
        orderNote,
        paymentMethod,
        shippingMethod,
        deliveryType,
        orderStatus,
        couponCode,
        couponDiscount,
        couponDiscountType,
        extraDiscount,
        extraDiscountType,
        shippingCost,
        billingAddress,
        shippingAddress,
        sameAsBilling
      } = state.orderCreation;

      // Validate cart
      if (cartItems.length === 0) {
        return rejectWithValue('Cart is empty');
      }

      // Validate customer
      if (!isGuestCheckout && !selectedCustomer) {
        return rejectWithValue('Please select a customer');
      }

      // Validate addresses
      if (!billingAddress) {
        return rejectWithValue('Billing address is required');
      }

      if (!sameAsBilling && !shippingAddress) {
        return rejectWithValue('Shipping address is required');
      }

      // Calculate order totals
      const cart = cartItems.map((item: CartItem) => ({
        id: item.id,
        variant_id: item.variant_id,
        quantity: item.quantity,
        price: item.price,
        discount: item.discount,
        tax: item.tax,
        tax_model: item.tax_model,
        variant: item.variant || '',
        variation: item.variation || ''
      }));

      // Determine default tax model from cart items
      const defaultTaxModel = cartItems.length > 0 ? cartItems[0].tax_model : 'exclude';

      // Prepare the request payload
      const orderData: OrderRequestPayload = {
        cart: cart,
        customer_id: isGuestCheckout ? 0 : selectedCustomer?.id,
        order_amount: calculateGrandTotal(state.orderCreation),
        order_date: orderDate,
        payment_method: paymentMethod,
        order_status: orderStatus,
        shipping_method_id: shippingMethod,
        shipping_cost: shippingCost,
        discount_amount: couponDiscount,
        discount_type: couponDiscountType === 'percent' ? 'percent' : 'amount',
        coupon_code: couponCode,
        extra_discount: extraDiscount,
        extra_discount_type: extraDiscountType === 'percent' ? 'percent' : 'amount',
        order_type: 'add_order',
        delivery_type: deliveryType,
        order_note: orderNote,
        tax: calculateTotalTax(state.orderCreation),
        tax_model: defaultTaxModel,
        billing_address: billingAddress,
        shipping_address: sameAsBilling ? billingAddress : (shippingAddress || billingAddress),
      };

      //console.log("Order Data:", orderData);
      //await new Promise(resolve => setTimeout(resolve, 10000));

      return await placeOrderService(orderData);
      //return { order_id: 123 } as OrderResponse;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to place order');
    }
  }
);

export const updateOrder = createAsyncThunk<
  OrderResponse,
  string,
  { rejectValue: string; state: { orderCreation: OrderCreationState } }
>(
  'orderCreation/updateOrder',
  async (orderId, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { orderCreation: OrderCreationState };
      const {
        cartItems,
        selectedCustomer,
        isGuestCheckout,
        orderDate,
        orderNote,
        paymentMethod,
        shippingMethod,
        deliveryType,
        orderStatus,
        paymentStatus,
        couponCode,
        couponDiscount,
        couponDiscountType,
        extraDiscount,
        extraDiscountType,
        shippingCost,
        billingAddress,
        shippingAddress,
        sameAsBilling
      } = state.orderCreation;

      // Validate cart
      if (cartItems.length === 0) {
        return rejectWithValue('Cart is empty');
      }

      // Validate customer
      if (!isGuestCheckout && !selectedCustomer) {
        return rejectWithValue('Please select a customer');
      }

      // Validate addresses
      if (!billingAddress) {
        return rejectWithValue('Billing address is required');
      }

      if (!sameAsBilling && !shippingAddress) {
        return rejectWithValue('Shipping address is required');
      }

      // Calculate order totals
      const cart = cartItems.map((item: CartItem) => ({
        id: item.id,
        variant_id: item.variant_id,
        quantity: item.quantity,
        price: item.price,
        discount: item.discount,
        tax: item.tax,
        tax_model: item.tax_model,
        variant: item.variant || '',
        variation: item.variation || ''
      }));

      // Determine default tax model from cart items
      const defaultTaxModel = cartItems.length > 0 ? cartItems[0].tax_model : 'exclude';

      // Prepare the request payload
      const orderData: OrderRequestPayload = {
        cart: cart,
        customer_id: isGuestCheckout ? 0 : selectedCustomer?.id,
        order_amount: calculateGrandTotal(state.orderCreation),
        order_date: orderDate,
        payment_method: paymentMethod,
        order_status: orderStatus,
        payment_status: paymentStatus,
        shipping_method_id: shippingMethod,
        shipping_cost: shippingCost,
        discount_amount: couponDiscount,
        discount_type: couponDiscountType === 'percent' ? 'percent' : 'amount',
        coupon_code: couponCode,
        extra_discount: extraDiscount,
        extra_discount_type: extraDiscountType === 'percent' ? 'percent' : 'amount',
        order_type: 'edit_order',
        delivery_type: deliveryType,
        order_note: orderNote,
        tax: calculateTotalTax(state.orderCreation),
        tax_model: defaultTaxModel,
        billing_address: billingAddress,
        shipping_address: sameAsBilling ? billingAddress : (shippingAddress || billingAddress),
      };

      //console.log("Order Update Data:", orderData);

      return await updateOrderService(orderId, orderData);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update order');
    }
  }
);

// Selector functions that calculate derived values
export const calculateSubtotal = (state?: OrderCreationState): number => {
  const items = state?.cartItems || [];
  return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
};

export const calculateTotalDiscount = (state?: OrderCreationState): number => {
  if (!state) return 0;
  
  // Calculate item discounts
  const itemDiscounts = state.cartItems.reduce((sum, item) => {
    if (item.discount_type === 'percent') {
      return sum + (item.price * item.quantity * (item.discount / 100));
    } else {
      // Default to 'amount' for discount type
      return sum + (item.discount * item.quantity);
    }
  }, 0);
  
  // Add coupon discount
  let couponDiscountValue = 0;
  if (state.couponDiscountType === 'percent') {
    couponDiscountValue = calculateSubtotal(state) * (state.couponDiscount / 100);
  } else {
    // Default to 'amount' for coupon discount type
    couponDiscountValue = state.couponDiscount;
  }
  
  // Add extra discount
  let extraDiscountValue = 0;
  if (state.extraDiscountType === 'percent') {
    extraDiscountValue = calculateSubtotal(state) * (state.extraDiscount / 100);
  } else {
    // Default to 'amount' for extra discount type
    extraDiscountValue = state.extraDiscount;
  }
  
  return itemDiscounts + couponDiscountValue + extraDiscountValue;
};

export const calculateTotalTax = (state?: OrderCreationState): number => {
  if (!state) return 0;
  
  return state.cartItems.reduce((sum, item) => {
    if (item.tax_model === 'include') {
      // For inclusive tax, extract tax from the price
      return sum + (item.price * item.quantity) - ((item.price * item.quantity) / (1 + item.tax / 100));
    } else {
      // For exclusive tax, add tax on top of price
      return sum + (item.price * item.quantity * (item.tax / 100));
    }
  }, 0);
};

export const calculateGrandTotal = (state?: OrderCreationState): number => {
  if (!state) return 0;
  
  const subtotal = calculateSubtotal(state);
  const discount = calculateTotalDiscount(state);
  const tax = calculateTotalTax(state);
  const shipping = state.shippingCost;
  
  // Tax handling depends on tax model of items
  // For exclusive tax items, we add tax; for inclusive it's already in the price
  const exclusiveTaxValue = state.cartItems
    .filter(item => item.tax_model === 'exclude')
    .reduce((sum, item) => sum + (item.price * item.quantity * (item.tax / 100)), 0);
  
  return subtotal - discount + exclusiveTaxValue + shipping;
};

// Reducer for updating cart items with tax and tax_model
export const updateCartItemTax = createAsyncThunk<
  void,
  { id: number; tax: number; tax_model: string },
  { state: { orderCreation: OrderCreationState } }
>(
  'orderCreation/updateCartItemTax',
  async ({ id, tax, tax_model }, { getState, dispatch }) => {
    const state = getState() as { orderCreation: OrderCreationState };
    const { cartItems } = state.orderCreation;
    
    const itemIndex = cartItems.findIndex(item => 
      item.id === id || (item.variant_id && item.variant_id === id)
    );
    
    if (itemIndex !== -1) {
      // Create a new cart item with updated tax values
      const updatedCartItem = {
        ...cartItems[itemIndex],
        tax,
        tax_model,
        subtotal: calculateItemTotal(
          cartItems[itemIndex].price,
          cartItems[itemIndex].quantity,
          cartItems[itemIndex].discount,
          cartItems[itemIndex].discount_type,
          tax,
          tax_model
        )
      };
      
      // Create a new cart items array
      const updatedCartItems = [...cartItems];
      updatedCartItems[itemIndex] = updatedCartItem;
      
      // Update the cart items in the state
      dispatch(setCartItems(updatedCartItems));
    }
  }
);

const orderCreationSlice = createSlice({
  name: 'orderCreation',
  initialState,
  reducers: {
    // Customer actions
    setCustomerSearch: (state, action: PayloadAction<string>) => {
      state.customerSearch = action.payload;
      state.customerPage = 1; // Reset page when search changes
    },
    
    setCustomerPage: (state, action: PayloadAction<number>) => {
      state.customerPage = action.payload;
    },
    
    selectCustomer: (state, action: PayloadAction<Customer | null>) => {
      state.selectedCustomer = action.payload;
      state.isGuestCheckout = false;
    },
    
    setGuestCheckout: (state, action: PayloadAction<boolean>) => {
      state.isGuestCheckout = action.payload;
      if (action.payload) {
        state.selectedCustomer = null;
      }
    },
    
    // Product actions
    setProductSearch: (state, action: PayloadAction<string>) => {
      state.productSearch = action.payload;
      state.productPage = 1; // Reset page when search changes
    },
    
    setProductPage: (state, action: PayloadAction<number>) => {
      state.productPage = action.payload;
    },
    
    setSelectedCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategoryId = action.payload;
      state.productPage = 1; // Reset page when category changes
    },
    
    // Cart actions
    addToCart: (state, action: PayloadAction<Product>) => {
      const product = action.payload;
      ////console.log("product", product);
      
      // Check if the product (considering variants) is already in cart
      const existingItemIndex = state.cartItems.findIndex(item => 
        (product.variant_id && item.variant_id === product.variant_id)
      );
      
      if (existingItemIndex !== -1) {
        // If product already exists, add the new quantity instead of just incrementing by 1
        const quantityToAdd = product.quantity || 1;
        const currentStock = state.cartItems[existingItemIndex].stock;
        const currentQuantity = state.cartItems[existingItemIndex].quantity;
        
        // Ensure the total quantity doesn't exceed available stock
        const newQuantity = Math.min(currentQuantity + quantityToAdd, currentStock);
        
        // Update the quantity
        state.cartItems[existingItemIndex].quantity = newQuantity;
        
        // Recalculate subtotal
        state.cartItems[existingItemIndex].subtotal = 
          state.cartItems[existingItemIndex].price * state.cartItems[existingItemIndex].quantity;
      } else {
        // Add new product to cart
        const itemSubtotal = (product.price || product.unit_price || 0) * (product.quantity || 1);
        //console.log("variant", product.variant_type);
        
        // Create cart item
        const newItem: CartItem = {
          id: product.id!,
          variant_id: product.variant_id,
          name: Array.isArray(product.name) ? product.name.join(', ') : (product.name || 'Unnamed Product'),
          price: product.price || product.unit_price || 0,
          quantity: product.quantity || 1,
          tax: product.tax || 0,
          tax_model: product.tax_model || 'exclude',
          discount: product.discount || 0,
          discount_type: product.discount_type || 'amount',
          subtotal: itemSubtotal,
          stock: product.current_stock || 0,
          sku: product.sku || product.variation?.[0]?.sku || '',
          variant: product.variant_type || '',
          image: product.thumbnail_full_url?.path || '',
        };
        
        state.cartItems.push(newItem);
      }
    },
    
    updateCartItemQuantity: (state, action: PayloadAction<{id: number, quantity: number}>) => {
      const { id, quantity } = action.payload;
      const itemIndex = state.cartItems.findIndex(item => 
        item.id === id || (item.variant_id && item.variant_id === id)
      );
      
      if (itemIndex !== -1) {
        if (quantity <= 0) {
          // If quantity is 0 or less, remove item
          state.cartItems.splice(itemIndex, 1);
        } else {
          // Otherwise update quantity and recalculate subtotal
          state.cartItems[itemIndex].quantity = quantity;
          state.cartItems[itemIndex].subtotal = 
            state.cartItems[itemIndex].price * quantity;
        }
      }
    },
    
    removeCartItem: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      const itemIndex = state.cartItems.findIndex(item => 
        item.id === id || (item.variant_id && item.variant_id === id)
      );
      
      if (itemIndex !== -1) {
        state.cartItems.splice(itemIndex, 1);
      }
    },
    
    clearCart: (state) => {
      state.cartItems = [];
    },
    
    // Order details actions
    setOrderDate: (state, action: PayloadAction<string>) => {
      state.orderDate = action.payload;
    },
    
    setOrderNote: (state, action: PayloadAction<string>) => {
      state.orderNote = action.payload;
    },
    
    setPaymentMethod: (state, action: PayloadAction<string>) => {
      state.paymentMethod = action.payload;
    },
    
    setShippingMethod: (state, action: PayloadAction<string>) => {
      state.shippingMethod = action.payload;
    },
    
    setDeliveryType: (state, action: PayloadAction<string>) => {
      state.deliveryType = action.payload;
    },
    
    setDeliveryServiceName: (state, action: PayloadAction<string>) => {
      state.deliveryServiceName = action.payload;
    },
    
    setThirdPartyTrackingId: (state, action: PayloadAction<string>) => {
      state.thirdPartyTrackingId = action.payload;
    },
    
    setOrderStatus: (state, action: PayloadAction<string>) => {
      state.orderStatus = action.payload;
    },
    
    setPaymentStatus: (state, action: PayloadAction<string>) => {
      state.paymentStatus = action.payload;
    },
    
    setCouponCode: (state, action: PayloadAction<string>) => {
      state.couponCode = action.payload;
      if (action.payload === '') {
        state.couponDiscount = 0;
      }
    },
    
    setExtraDiscount: (state, action: PayloadAction<number>) => {
      state.extraDiscount = action.payload;
    },
    
    setExtraDiscountType: (state, action: PayloadAction<string>) => {
      state.extraDiscountType = action.payload;
    },
    
    setShippingCost: (state, action: PayloadAction<number>) => {
      state.shippingCost = action.payload;
    },
    
    // Tax actions
    updateTaxSettings: (state, action: PayloadAction<{taxRate: number, taxModel: string}>) => {
      const { taxRate, taxModel } = action.payload;
      
      // Update tax settings for all cart items
      state.cartItems.forEach(item => {
        item.tax = taxRate;
        item.tax_model = taxModel;
        // Recalculate subtotal with tax consideration
        item.subtotal = calculateItemTotal(
          item.price, 
          item.quantity, 
          item.discount, 
          item.discount_type, 
          taxRate, 
          taxModel
        );
      });
    },
    
    // Address actions
    setBillingAddress: (state, action: PayloadAction<any>) => {
      state.billingAddress = action.payload;
      
      // If same as billing is true, also update shipping address
      if (state.sameAsBilling) {
        state.shippingAddress = action.payload;
      }
    },
    
    setShippingAddress: (state, action: PayloadAction<any>) => {
      state.shippingAddress = action.payload;
    },
    
    setSameAsBilling: (state, action: PayloadAction<boolean>) => {
      state.sameAsBilling = action.payload;
      
      // If same as billing is true, sync shipping address to billing
      if (action.payload && state.billingAddress) {
        state.shippingAddress = state.billingAddress;
      }
    },
    
    // Reset action
    resetOrderCreation: (state) => {
      return { ...initialState };
    },
    
    // Add a new reducer to set cart items directly
    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.cartItems = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Customers
      .addCase(fetchCustomers.pending, (state) => {
        state.customersLoading = true;
        state.customersError = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action: PayloadAction<CustomerResponse>) => {
        state.customersLoading = false;
        state.customers = action.payload.customers || [];
        state.totalCustomers = action.payload.total_size || 0;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.customersLoading = false;
        state.customersError = action.payload as string;
      })
      
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.productsLoading = true;
        state.productsError = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<ProductResponse>) => {
        state.productsLoading = false;
        state.products = action.payload.products || [];
        state.totalProducts = action.payload.total_size || 0;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.productsLoading = false;
        state.productsError = action.payload as string;
      })
      
      // Validate Coupon
      .addCase(validateCoupon.fulfilled, (state, action: PayloadAction<CouponResponse>) => {
        if (action.payload.discount) {
          state.couponDiscount = action.payload.discount;
          state.couponDiscountType = action.payload.discount_type || 'amount';
          toast.success('Coupon applied successfully');
        } else {
          state.couponDiscount = 0;
          toast.error('Invalid coupon code');
        }
      })
      .addCase(validateCoupon.rejected, (state) => {
        state.couponDiscount = 0;
        toast.error('Invalid coupon code');
      })
      
      // Place Order
      .addCase(placeOrder.pending, (state) => {
        state.orderSubmitting = true;
        state.orderSubmitError = null;
        state.orderSubmitSuccess = false;
      })
      .addCase(placeOrder.fulfilled, (state, action: PayloadAction<OrderResponse>) => {
        state.orderSubmitting = false;
        state.orderSubmitSuccess = true;
        state.createdOrderId = action.payload.order_id || null;
        toast.success('Order placed successfully');
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.orderSubmitting = false;
        state.orderSubmitError = action.payload as string;
        toast.error(action.payload as string || 'Failed to place order');
      })
      
      // Update Order
      .addCase(updateOrder.pending, (state) => {
        state.orderSubmitting = true;
        state.orderSubmitError = null;
        state.orderSubmitSuccess = false;
      })
      .addCase(updateOrder.fulfilled, (state, action: PayloadAction<OrderResponse>) => {
        state.orderSubmitting = false;
        state.orderSubmitSuccess = true;
        state.createdOrderId = action.payload.order_id || null;
        toast.success('Order updated successfully');
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.orderSubmitting = false;
        state.orderSubmitError = action.payload as string;
        toast.error(action.payload as string || 'Failed to update order');
      });
  }
});

export const {
  // Customer actions
  setCustomerSearch,
  setCustomerPage,
  selectCustomer,
  setGuestCheckout,
  
  // Product actions
  setProductSearch,
  setProductPage,
  setSelectedCategory,
  
  // Cart actions
  addToCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
  
  // Order details actions
  setOrderDate,
  setOrderNote,
  setPaymentMethod,
  setShippingMethod,
  setDeliveryType,
  setDeliveryServiceName,
  setThirdPartyTrackingId,
  setOrderStatus,
  setPaymentStatus,
  setCouponCode,
  setExtraDiscount,
  setExtraDiscountType,
  setShippingCost,
  
  // Tax actions
  updateTaxSettings,
  
  // Address actions
  setBillingAddress,
  setShippingAddress,
  setSameAsBilling,
  
  // Reset action
  resetOrderCreation,
  
  // Cart actions
  setCartItems,
} = orderCreationSlice.actions;

export default orderCreationSlice.reducer; 