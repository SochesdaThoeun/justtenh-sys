import React, { useState, useEffect } from "react";
import { PageLink, PageTitle } from "../../../_metronic/layout/core";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { fetchCategories, fetchProducts, placeOrder, resetOrderState } from "../../redux/pos/pos.slice";
import { AppDispatch } from "../../redux/store";
import { PosProduct } from "../../redux/pos/pos.models";
import { PaginationWidget } from "../../components/common/PaginationWidget";
import { toast } from "sonner";
import { OrderRequestPayload } from "../../redux/order/orderCreation.models";
import { calculateCartTotals } from "../../redux/order/orderCreation.service";
import OrderCompletionModal from "./components/OrderCompletionModal";
import OrderFailureModal from "./components/OrderFailureModal";

// Import the new components
import CategoryList from "./components/CategoryList";
import ProductList from "./components/ProductList";
import OrderList from "./components/OrderList";

// Import local OrderItem interface
import { OrderItem } from "./components/OrderList";

// Local interface for simplified product display
interface LocalProduct {
  id: number;
  image: string;
  title: string;
  note: string;
  price: number;
  current_stock?: number;
  variation?: Array<{
    type: string;
    price?: number;
    sku?: string;
    qty?: number;
  }>;
}

const PosPage = () => {
  /********************************************************************
   * 1) DATA DEFINITIONS
   ********************************************************************/
  const dispatch = useDispatch<AppDispatch>();
  const { categories: apiCategories, products: apiProducts, loading, error } = useSelector((state: RootState) => state.pos);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage] = useState(20);

  // Fetch categories on component mount
  useEffect(() => {
    dispatch(fetchCategories());
    
    // Fetch initial products with required parameters
    fetchProductsWithPagination();
  }, [dispatch, currentPage]); // Added currentPage as dependency

  // Fetch products when category changes
  useEffect(() => {
    fetchProductsWithPagination();
    setCurrentPage(1); // Reset to first page when category changes
  }, [selectedCategoryId, dispatch]);

  // Helper function for fetching products with pagination
  const fetchProductsWithPagination = () => {
    const offset = ((currentPage - 1) * entriesPerPage);
    
    dispatch(fetchProducts({ 
      category_id: selectedCategoryId, 
      limit: entriesPerPage, 
      offset: offset 
    }));
  };

  // Log raw category and product data for debugging
  useEffect(() => {
    //console.log("Raw API Categories Data:", apiCategories);
    //console.log("Raw API Products Data:", apiProducts);
  }, [apiCategories, apiProducts]);

  // Convert API products to LocalProduct format
  const convertProductsToProducts = (products: PosProduct[]): LocalProduct[] => {
    return products.map(product => {
      // Safely transform variation data
      const transformedVariation = product.variation?.map(v => ({
        type: v.type || '',
        price: v.price,
        sku: v.sku,
        qty: v.qty
      }));
      
      return {
        id: product.id || 0,
        image: product.thumbnail_full_url?.path || "../../../../public/media/stock/food/img-1.jpg",
        title: typeof product.name === 'string' ? product.name : (Array.isArray(product.name) ? product.name[0] : "Unnamed Product"),
        note: product.code || "",
        price: product.unit_price || 0,
        current_stock: product.current_stock,
        variation: transformedVariation
      };
    });
  };

  // Current order: items that appear on the right side
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  // Get order placement status from redux store
  const { orderSubmitting, orderSubmitError, orderSubmitSuccess, createdOrderId } = useSelector((state: RootState) => state.pos);

  // Tax and discount state
  const [taxRate, setTaxRate] = useState<number>(0);
  const [taxModel, setTaxModel] = useState<string>('exclude');
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [discountType, setDiscountType] = useState<string>('amount');
  const [shippingCost, setShippingCost] = useState<number>(0);

  // Modal states
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailureModal, setShowFailureModal] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  /********************************************************************
   * 2) EVENT HANDLERS
   ********************************************************************/

  // Category click handler
  const handleCategoryClick = (categoryId: number) => {
    if (categoryId === 0) {
      // All products category
      setSelectedCategoryId(undefined);
    } else {
      setSelectedCategoryId(categoryId.toString());
    }
    
    // For debugging
    //console.log("Selected category:", categoryId);
  };

  // Pagination handler
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Decrease item quantity in "Current Order"
  const handleDialerDecrease = (itemId: number) => {
    setOrderItems((prev) => {
      // First find the item
      const item = prev.find(item => item.id === itemId);
      
      // If item not found, return unmodified array
      if (!item) return prev;
      
      // If quantity is 1, remove the item completely
      if (item.quantity === 1) {
        return prev.filter(item => item.id !== itemId);
      }
      
      // Otherwise, decrease the quantity
      return prev.map((item) => {
        if (item.id === itemId) {
          const newQty = item.quantity - 1;
          return {
            ...item,
            quantity: newQty,
            total: newQty * item.price,
          };
        }
        return item;
      });
    });
  };

  // Increase item quantity in "Current Order"
  const handleDialerIncrease = (itemId: number) => {
    setOrderItems((prev) => {
      const item = prev.find(i => i.id === itemId);
      if (!item) return prev;
      
      // Check if we're at stock limit
      if (item.current_stock !== undefined && item.quantity >= item.current_stock) {
        // Don't increase if at stock limit
        return prev;
      }
      
      return prev.map((item) => {
        if (item.id === itemId) {
          const newQty = item.quantity + 1;
          return {
            ...item,
            quantity: newQty,
            total: newQty * item.price,
          };
        }
        return item;
      });
    });
  };

  // Clear all order items
  const handleClearAll = () => {
    setOrderItems([]);
  };

  // Method to calculate totals
  const calculateOrderTotals = () => {
    // Apply tax and discount to all items
    const itemsWithTaxAndDiscount = orderItems.map(item => ({
      ...item,
      tax: taxRate,
      tax_model: taxModel,
      discount: discountType === 'amount' ? discountValue / orderItems.length : 0,
      discount_type: discountType,
      // Add required CartItem properties
      subtotal: item.price * item.quantity,
      stock: item.current_stock || 0,
      sku: ''
    }));

    // Use the same calculation method as in orderCreationService
    const { subtotal, totalDiscount, totalTax } = calculateCartTotals(itemsWithTaxAndDiscount);
    
    // Calculate total discount amount
    let additionalDiscount = 0;
    if (discountType === 'percent') {
      additionalDiscount = subtotal * (discountValue / 100);
    } else {
      additionalDiscount = discountValue;
    }

    return {
      subtotal,
      totalTax,
      totalDiscount: totalDiscount + additionalDiscount,
      grandTotal: subtotal + (taxModel === 'exclude' ? totalTax : 0) - additionalDiscount + shippingCost
    };
  };

  // Handle tax updates from OrderList component
  const handleTaxUpdate = (rate: number, model: string) => {
    setTaxRate(rate);
    setTaxModel(model);
  };

  // Handle discount updates from OrderList component
  const handleDiscountUpdate = (value: number, type: string) => {
    setDiscountValue(value);
    setDiscountType(type);
  };

  // Handle shipping cost updates
  const handleShippingUpdate = (cost: number) => {
    setShippingCost(cost);
  };

  // Handle "Create Order" (submit)
  const handleSubmit = () => {
    if (orderItems.length === 0) {
      toast.error("Please add items to your order first");
      return;
    }

    //console.log("Order Items:", orderItems);
    
    // Calculate order totals
    const { subtotal, totalTax, totalDiscount, grandTotal } = calculateOrderTotals();
    
    // Prepare cart items for order request with proper tax and discount
    const cart = orderItems.map(item => ({
      id: item.id,
      variant_id: item.variant_id,
      quantity: item.quantity,
      price: item.price,
      discount: item.discount || 0,
      tax: taxRate,
      tax_model: taxModel,
      variant: item.variant_type || '',
      variation: item.variant_name || ''
    }));

    // Create order payload
    const orderData: OrderRequestPayload = {
      cart: cart,
      customer_id: 0, // Guest checkout
      order_amount: grandTotal,
      order_date: new Date().toISOString().split('T')[0],
      payment_method: 'cash_on_delivery',
      order_status: 'pending',
      shipping_method_id: 'standard_shipping',
      shipping_cost: shippingCost,
      discount_amount: 0,
      discount_type: 'amount',
      coupon_code: '',
      extra_discount: discountValue,
      extra_discount_type: discountType,
      order_type: 'add_order',
      delivery_type: 'self_pickup',
      order_note: 'Order placed from POS',
      tax: taxRate,
      tax_model: taxModel,
      billing_address: {
        contact_person_name: 'POS Customer',
        address: 'POS Sale',
        city: 'POS City',
        zip: '00000',
        phone: '00000000000',
        email: 'pos@example.com',
        country: 'AU',
        latitude: '0',
        longitude: '0'
      },
      shipping_address: {
        contact_person_name: 'POS Customer',
        address: 'POS Sale',
        city: 'POS City',
        zip: '00000',
        phone: '00000000000',
        email: 'pos@example.com',
        country: 'AU',
        latitude: '0',
        longitude: '0'
      }
    };

    //console.log("Submitting order with data:", orderData);
    dispatch(placeOrder(orderData));
  };

  // Watch for order submission status changes
  useEffect(() => {
    if (orderSubmitSuccess && createdOrderId) {
      // Show success modal instead of toast
      setShowSuccessModal(true);
      
      // Reset order state (but do this when modal is closed to avoid flickering)
      // dispatch(resetOrderState()); // This will be called from the modal close handler
    }
    
    if (orderSubmitError) {
      // Show failure modal with error message
      setOrderError(orderSubmitError);
      setShowFailureModal(true);
      
      // Reset order state
      dispatch(resetOrderState());
    }
  }, [orderSubmitSuccess, orderSubmitError, createdOrderId, dispatch]);

  // Handle order completion modal close
  const handleOrderComplete = () => {
    setShowSuccessModal(false);
    // Clear the cart
    handleClearAll();
    // Reset order state
    dispatch(resetOrderState());
  };

  // Handle order failure modal close
  const handleOrderFailure = () => {
    setShowFailureModal(false);
  };

  // Handle adding an item from the left side (Food grid) to the order
  const handleAddItemToOrder = (product: any) => {
    setOrderItems((prevItems) => {
      // Check if product has a variant_id (it's a variation)
      const existing = prevItems.find((i) => 
        (product.variant_id && i.variant_id === product.variant_id) || 
        (!product.variant_id && i.id === product.id && !i.variant_id)
      );
      
      // Determine the available stock
      let availableStock: number | undefined;
      if (product.variant_id && product.variant_type) {
        // It's a variant, find its stock from variation array
        if (product.current_stock !== undefined) {
          availableStock = product.current_stock;
        }
      } else {
        // Regular product, use current_stock directly
        availableStock = product.current_stock;
      }
      
      // Check if adding would exceed stock limits
      if (existing && availableStock !== undefined) {
        const newQty = existing.quantity + (product.quantity || 1);
        if (newQty > availableStock) {
          // Show warning instead of adding beyond stock
          console.warn(`Cannot add more of ${product.name}. Maximum stock (${availableStock}) reached.`);
          // You can use toast here if you have it set up
          // toast.warning(`Cannot add more units. Maximum stock (${availableStock}) reached.`);
          return prevItems;
        }
      }
      
      if (existing) {
        // Update existing item quantity
        return prevItems.map((i) => {
          if ((product.variant_id && i.variant_id === product.variant_id) || 
              (!product.variant_id && i.id === product.id && !i.variant_id)) {
            const newQty = i.quantity + (product.quantity || 1);
            return {
              ...i,
              quantity: newQty,
              total: newQty * i.price,
            };
          }
          return i;
        });
      } else {
        // Add new item to order
        const itemPrice = product.price || product.unit_price || 0;
        const itemQty = product.quantity || 1;
        
        return [
          ...prevItems,
          {
            id: product.id,
            variant_id: product.variant_id,
            image: product.image,
            name: product.name || product.title,
            price: itemPrice,
            quantity: itemQty,
            total: itemPrice * itemQty,
            variant_type: product.variant_type,
            variant_name: product.variant_name,
            current_stock: availableStock, // Add stock info for validation
          },
        ];
      }
    });
  };

  const widgetsBreadCrumbs: Array<PageLink> = [
    {
      title: "POS",
      path: "/pos/",
      isSeparator: false,
      isActive: false,
    },
  ];

  // Get products to display
  const displayProducts = apiProducts && apiProducts.products ? 
    convertProductsToProducts(apiProducts.products) : 
    [];
    
  // Get total product count for pagination
  const totalProductCount = apiProducts?.total_size || 0;

  /********************************************************************
   * 3) RENDER
   ********************************************************************/
  return (
    <>
      <PageTitle breadcrumbs={widgetsBreadCrumbs}>POS</PageTitle>

      <div className="d-flex flex-column flex-xl-row">
        {/*begin::Content*/}
        <div className="d-flex flex-row-fluid me-xl-9 mb-10 mb-xl-0">
          {/*begin::Pos food*/}
          <div className="card card-flush card-p-0 bg-transparent border-0 shadow-none">
            {/*begin::Body*/}
            <div className="card-body">
              {/* Category List Component */}
              <CategoryList 
                loading={loading}
                error={error}
                categories={apiCategories}
                onCategoryClick={handleCategoryClick}
                selectedCategoryId={selectedCategoryId}
              />

              {/* Product List Component */}
              <ProductList 
                products={displayProducts}
                loading={loading}
                error={error}
                categoryId={selectedCategoryId}
                onAddToOrder={handleAddItemToOrder}
              />
              
              {/* Pagination Component */}
              {!loading && totalProductCount > 0 && (
                <PaginationWidget 
                  totalEntries={totalProductCount}
                  entriesPerPage={entriesPerPage}
                  onPageChange={handlePageChange}
                />
              )}
            </div>
            {/*end::Card Body*/}
          </div>
          {/*end::Pos food*/}
        </div>
        {/*end::Content*/}

        {/*begin::Sidebar*/}
        <div className="flex-row-auto w-xl-450px">
          {/* Order List Component */}
          <OrderList 
            orderItems={orderItems}
            onClearAll={handleClearAll}
            onQuantityDecrease={handleDialerDecrease}
            onQuantityIncrease={handleDialerIncrease}
            onSubmit={handleSubmit}
            isSubmitting={orderSubmitting}
            onTaxUpdate={handleTaxUpdate}
            onDiscountUpdate={handleDiscountUpdate}
            onShippingUpdate={handleShippingUpdate}
            taxRate={taxRate}
            taxModel={taxModel}
            discountValue={discountValue}
            discountType={discountType}
            shippingCost={shippingCost}
          />
        </div>
        {/*end::Sidebar*/}
      </div>

      {/* Order Success Modal */}
      <OrderCompletionModal
        isOpen={showSuccessModal}
        orderId={createdOrderId}
        onClose={handleOrderComplete}
      />

      {/* Order Failure Modal */}
      <OrderFailureModal
        isOpen={showFailureModal}
        errorMessage={orderError}
        onClose={handleOrderFailure}
      />
    </>
  );
};

export default PosPage;
