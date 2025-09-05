import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaShoppingCart, FaBars, FaTimes } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get auth state from Redux
  const { isAuthenticated: isLoggedIn, user } = useSelector(state => state.auth);
  
  // Get cart items count from Redux
  const { items } = useSelector(state => state.cart);
  const cartItemsCount = items.reduce((total, item) => total + item.quantity, 0);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky-top shadow-sm">
      <nav className="navbar navbar-expand-lg navbar-light bg-white">
        <div className="container">
          {/* Logo */}
          <Link className="navbar-brand" to="/">
            <h2 className="m-0 text-primary-custom fw-bold">ROGERS</h2>
          </Link>
          
          {/* Mobile menu toggle */}
          <button 
            className="navbar-toggler border-0" 
            type="button" 
            onClick={toggleMenu}
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
          
          {/* Navigation links */}
          <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`}>
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  Home
                </Link>
              </li>
              {/* <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                  SIM Cards
                </a>
                <ul className="dropdown-menu">
                  <li><Link className="dropdown-item" to="/products?type=prepaid">Prepaid</Link></li>
                  <li><Link className="dropdown-item" to="/products?type=postpaid">Postpaid</Link></li>
                  <li><Link className="dropdown-item" to="/products?type=data">Data Only</Link></li>
                  <li><Link className="dropdown-item" to="/products?type=esim">eSIM</Link></li>
                </ul>
              </li> */}
              <li className="nav-item">
                <Link className="nav-link" to="/products">
                 SIM Cards
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/products">
                  Plans
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  Plans
                </Link>
              </li>
              {/* <li className="nav-item">
                <Link className="nav-link" to="/products?type=addon">
                  Add-ons
                </Link>
              </li> */}
            </ul>
            
            {/* User actions */}
            <div className="d-flex align-items-center ms-lg-4">
              <Link to="/cart" className="btn btn-outline-primary me-2 position-relative">
                <FaShoppingCart className="me-1" /> Cart
                {cartItemsCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {cartItemsCount}
                    <span className="visually-hidden">items in cart</span>
                  </span>
                )}
              </Link>
              
              {isLoggedIn ? (
                <div className="dropdown">
                  <button className="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                    <FaUser className="me-1" /> Account
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li><Link className="dropdown-item" to="/profile">My Profile</Link></li>
                    <li><Link className="dropdown-item" to="/profile/orders">Order History</Link></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><button className="dropdown-item" onClick={() => dispatch(logout())}>Logout</button></li>
                  </ul>
                </div>
              ) : (
                <Link to="/login" className="btn btn-primary">
                  <FaUser className="me-1" /> Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
