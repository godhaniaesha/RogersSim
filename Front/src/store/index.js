import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import productReducer from './slices/productSlice';
import planReducer from './slices/planSlice';
import checkoutReducer from './slices/checkOutSlice';
import orderReducer from './slices/orderSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    product: productReducer,
    plan:planReducer,
    checkout: checkoutReducer,
    order: orderReducer,
  },
});

export default store;