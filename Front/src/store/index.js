import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import productReducer from './slices/productSlice';
import planReducer from './slices/planSlice';
import checkoutReducer from './slices/checkOutSlice';
import cardReducer from './slices/cardSlice';
import orderReducer from './slices/orderSlice';
import paymentReducer from './slices/paymentSlice';

// Persist config for auth
const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['isAuthenticated', 'user'] // Only persist these fields
};

// Persist config for cart
const cartPersistConfig = {
  key: 'cart',
  storage,
  whitelist: ['items'] // Only persist cart items
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  cart: persistReducer(cartPersistConfig, cartReducer),
  product: productReducer,
  plan: planReducer,
  checkout: checkoutReducer,
  card: cardReducer,
  orders: orderReducer,
  payment: paymentReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);
export default store;