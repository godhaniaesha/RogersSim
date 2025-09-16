
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Provider, useSelector } from 'react-redux';

// Styles
import './style/theme.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Header from './component/Header';
import Footer from './component/Footer';

// Redux Store
import store from './store';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Profile from './pages/profile/Profile';
import OrderHistory from './pages/profile/OrderHistory';
import Products from './pages/products/Products';
import ProductDetail from './pages/products/ProductDetail';
import Cart from './pages/cart/Cart';
import Checkout from './pages/checkout/Checkout';
import Payment from './pages/checkout/Payment';
import OrderConfirmation from './pages/checkout/OrderConfirmation';
import ExplorB from './pages/ExplorB';
import AdAbout from './pages/AdAbout';
import AddBus from './pages/AddBus';
import Recharge from './pages/Recharge';
import Plans from './pages/Plans';
import About from './pages/About';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Service from './pages/Service';
import HelpCenter from './pages/HelpCenter';
import ForgotPass from './pages/auth/ForgotPass';
import FAQ from './pages/FAQ';
import Termscondition from './pages/Terms&condition';

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

// AppContent component with access to Redux store
const AppContent = () => {
  // Protected route component
  const ProtectedRoute = ({ children }) => {
    // Using useSelector hook to access Redux state
    const { isAuthenticated } = useSelector(state => state.auth);

    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    return children;
  };

  return (
    <Provider store={store} >
      <Router >
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        <Header/>
        <main className="h-100" >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/exb" element={<ExplorB />} />
            <Route path="/addabout" element={<AdAbout />} />
            <Route path="/add" element={<AddBus />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/recharge" element={<Recharge />} />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/profile/orders" element={
              <ProtectedRoute>
                <OrderHistory />
              </ProtectedRoute>
            } />
            <Route path="/products" element={<Products />} />
            <Route path="/plans" element={<Plans />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/service" element={<Service />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/Termscondition" element={<Termscondition />} />

            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            {/* <Route path="/checkout" element={<Checkout />} /> */}
            {/* <Route path="/payment" element={<Payment />} /> */}
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            <Route path="/forgot-password" element={<ForgotPass />} />
            <Route path="/helpcenter" element={<HelpCenter />} />
            <Route path="/checkout" element={
              // <ProtectedRoute>
              <Checkout />
              // </ProtectedRoute>
            } />
            <Route path="/payment" element={
              // <ProtectedRoute>
              <Payment />
              // </ProtectedRoute>
            } />
            <Route path="/order-confirmation" element={
              <ProtectedRoute>
                <OrderConfirmation />
              </ProtectedRoute>
            } />

          </Routes>
        </main>
        <Footer />
      </Router>
    </Provider>
  );
}

export default App;
