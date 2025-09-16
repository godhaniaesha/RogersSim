import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FaUser, FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { logout, logoutUser } from "../store/slices/authSlice";
import Logo from "../image/IMG_4025 (1).png";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const dispatch = useDispatch();

  // Auth state
  const { isAuthenticated: isLoggedIn } = useSelector((state) => state.auth);

  // On mount, if token exists but not logged in, update Redux state
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !isLoggedIn) {
      // Dispatch a login success action or set isAuthenticated true in Redux
      dispatch({ type: "auth/loginSuccess", payload: { token } });
    }
  }, [dispatch, isLoggedIn]);

  // Cart items
  const { items } = useSelector((state) => state.cart);
  const cartItemsCount = items.reduce((total, item) => total + item.quantity, 0);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Dropdown styles
  const dropdownMenuStyle = {
    backgroundColor: '#ffffff',
    border: '1px solid #dee2e6',
    borderRadius: '0.375rem',
    boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.15)',
    minWidth: '10rem'
  };

  const dropdownItemStyle = {
    padding: '0.5rem 1rem',
    fontSize: '0.875rem',
    color: '#212529',
    textDecoration: 'none',
    display: 'block',
    width: '100%',
    backgroundColor: 'transparent',
    border: 'none',
    textAlign: 'left',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  };

  const getDropdownItemHoverStyle = (isHovered) => ({
    ...dropdownItemStyle,
    backgroundColor: isHovered ? '#b71414' : 'transparent',
    color: isHovered ? '#ffffff' : '#212529'
  });

  return (
    <header className="sticky-top shadow-sm">
      <nav className="navbar navbar-expand-lg navbar-light bg-white">
        <div className="container">
          {/* Logo */}
          <NavLink className="navbar-brand d-flex align-items-center" to="/" onClick={closeMenu}>
            <img
              src={Logo}
              alt="Rogers"
              style={{ height: "35px", width: "auto" }}
              className="rogers-nav"
            />
          </NavLink>

          {/* Mobile toggle */}
          <button
            className="navbar-toggler z_toggle_btn"
            type="button"
            onClick={toggleMenu}
            aria-controls="navbarNav"
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation"
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>

          {/* Menu */}
          <div
            className={`collapse navbar-collapse ${isMenuOpen ? "show" : ""}`}
            id="navbarNav"
          >
            <ul className="navbar-nav ms-auto align-items-lg-center">

              {/* Home */}
              <li className="nav-item">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                  onClick={closeMenu}
                >
                  Home
                </NavLink>
              </li>

              {/* SIM Cards */}
              <li className="nav-item">
                <NavLink
                  to="/products"
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                  onClick={closeMenu}
                >
                  SIM Cards
                </NavLink>
              </li>

              {/* Recharge */}
              <li className="nav-item">
                <NavLink
                  to="/recharge"
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                  onClick={closeMenu}
                >
                  Recharge
                </NavLink>
              </li>

              {/* Plans */}
              <li className="nav-item">
                <NavLink
                  to="/plans"
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                  onClick={closeMenu}
                >
                  Plans
                </NavLink>
              </li>

              {/* Cart + Account side by side (Mobile only) */}
              <li className="nav-item w-100 d-lg-none mt-3">
                <div className="d-flex  gap-2 position-relative">
                  {/* Cart */}
                  <NavLink
                    to="/cart"
                    className="btn x_btn_cart position-relative"
                    onClick={closeMenu}
                  >
                    <FaShoppingCart className="me-1" /> Cart
                    {cartItemsCount > 0 && (
                      <span
                        className="position-absolute top-0 start-100 translate-middle badge rounded-pill x_num_count"
                        style={{ backgroundColor: "#b71414" }}
                      >
                        {cartItemsCount}
                      </span>
                    )}
                  </NavLink>

                  {/* Login / Account */}
                  {isLoggedIn ? (
                    <div className="dropdown">
                      <button
                        className="btn btn-danger dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        style={{ backgroundColor: '#b71414', borderColor: '#b71414' }}
                      >
                        <FaUser className="me-1" /> Account
                      </button>
                      <ul
                        className="dropdown-menu dropdown-menu-end position-absolute"
                        style={{
                          ...dropdownMenuStyle,
                          top: "100%",
                          right: 0,
                          zIndex: 1050
                        }}
                      >
                        <li>
                          <NavLink
                            className="dropdown-item"
                            to="/profile"
                            onClick={closeMenu}
                            style={getDropdownItemHoverStyle(hoveredItem === 'profile-mobile')}
                            onMouseEnter={() => setHoveredItem('profile-mobile')}
                            onMouseLeave={() => setHoveredItem(null)}
                          >
                            My Profile
                          </NavLink>
                        </li>
                        <li>
                          <NavLink
                            className="dropdown-item"
                            to="/profile/orders"
                            onClick={closeMenu}
                            style={getDropdownItemHoverStyle(hoveredItem === 'orders-mobile')}
                            onMouseEnter={() => setHoveredItem('orders-mobile')}
                            onMouseLeave={() => setHoveredItem(null)}
                          >
                            Order History
                          </NavLink>
                        </li>
                        <li>
                          <hr className="dropdown-divider" style={{ margin: '0.5rem 0', borderColor: '#dee2e6' }} />
                        </li>
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => dispatch(logoutUser())}
                            style={getDropdownItemHoverStyle(hoveredItem === 'logout-mobile')}
                            onMouseEnter={() => setHoveredItem('logout-mobile')}
                            onMouseLeave={() => setHoveredItem(null)}
                          >
                            Logout
                          </button>
                        </li>
                      </ul>
                    </div>
                  ) : (
                    <NavLink to="/login" className="btn btn-danger" onClick={closeMenu} style={{ backgroundColor: '#b71414', borderColor: '#b71414' }}>
                      <FaUser className="me-1" /> Login
                    </NavLink>
                  )}
                </div>
              </li>

              {/* Cart + Account (Desktop only) */}
              <li className="nav-item ms-lg-3 d-none d-lg-block">
                <NavLink
                  to="/cart"
                  className="btn x_btn_cart position-relative"
                  onClick={closeMenu}
                >
                  <FaShoppingCart className="me-1" /> Cart
                  {cartItemsCount > 0 && (
                    <span
                      className="position-absolute top-0 start-100 translate-middle badge rounded-pill x_num_count"
                      style={{ backgroundColor: "#b71414" }}
                    >
                      {cartItemsCount}
                    </span>
                  )}
                </NavLink>
              </li>

              <li className="nav-item ms-3 d-none d-lg-block">
                {isLoggedIn ? (
                  <div className="dropdown">
                    <button
                      className="btn btn-danger dropdown-toggle"
                      type="button"
                      data-bs-toggle="dropdown"
                      style={{ backgroundColor: '#b71414', borderColor: '#b71414' }}
                    >
                      <FaUser className="me-1" /> Account
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end" style={dropdownMenuStyle}>
                      <li>
                        <NavLink
                          className="dropdown-item"
                          to="/profile"
                          onClick={closeMenu}
                          style={getDropdownItemHoverStyle(hoveredItem === 'profile-desktop')}
                          onMouseEnter={() => setHoveredItem('profile-desktop')}
                          onMouseLeave={() => setHoveredItem(null)}
                        >
                          My Profile
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          className="dropdown-item"
                          to="/profile/orders"
                          onClick={closeMenu}
                          style={getDropdownItemHoverStyle(hoveredItem === 'orders-desktop')}
                          onMouseEnter={() => setHoveredItem('orders-desktop')}
                          onMouseLeave={() => setHoveredItem(null)}
                        >
                          Order History
                        </NavLink>
                      </li>
                      <li>
                        <hr className="dropdown-divider" style={{ margin: '0.5rem 0', borderColor: '#dee2e6' }} />
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => dispatch(logoutUser())}
                          style={getDropdownItemHoverStyle(hoveredItem === 'logout-desktop')}
                          onMouseEnter={() => setHoveredItem('logout-desktop')}
                          onMouseLeave={() => setHoveredItem(null)}
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                ) : (
                  <NavLink to="/login" className="btn btn-danger" onClick={closeMenu} style={{ backgroundColor: '#b71414', borderColor: '#b71414' }}>
                    <FaUser className="me-1" /> Login
                  </NavLink>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}