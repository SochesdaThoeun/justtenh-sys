import { configureStore, combineReducers } from '@reduxjs/toolkit';

import authReducer from './auth/auth.slice';
import vendorReducer from './vendor/vendorSlice';
import orderReducer from './order/orderSlice';
import orderDetailReducer from './order/orderDetails.slice';
import orderCreationReducer from './order/orderCreation.slice';
import productReducer from './product/productslice';
import productOperationsReducer from './product/productOperations.slice';
import categoryReducer from './category/category.slice';
import reviewReducer from './review/review.slice';
import customerReducer from './customer/customer.slice';
import posReducer from './pos/pos.slice';
import chatReducer from './chat/chat.slice';
import invoiceReducer from './order/invoice.slice';
import shippingMethodReducer from './shippingMethod/shippingMethod.slice';
import statisticReducer from './statistic/statistic.slice';

const rootReducer = combineReducers({
  auth: authReducer,
  vendorReducer: vendorReducer,
  orderReducer: orderReducer,
  orderDetailReducer: orderDetailReducer,
  orderCreation: orderCreationReducer,
  product: productReducer,
  productOperations: productOperationsReducer,
  category: categoryReducer,
  review: reviewReducer,
  customer: customerReducer,
  pos: posReducer,
  chat: chatReducer,
  invoice: invoiceReducer,
  shippingMethod: shippingMethodReducer,
  statistic: statisticReducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
