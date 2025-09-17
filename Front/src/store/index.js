import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import productReducer from './slices/productSlice';
import planReducer from './slices/planSlice';
import checkoutReducer from './slices/checkOutSlice';
import cardReducer from './slices/cardSlice';
import orderReducer from './slices/orderSlice';
import paymentReducer from './slices/paymentSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    product: productReducer,
    plan:planReducer,
    checkout: checkoutReducer,
    card: cardReducer,
    orders: orderReducer,
    payment: paymentReducer,
  },
});

export default store;