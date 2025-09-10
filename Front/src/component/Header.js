import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaUser, FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";
import Logo from "../image/IMG_4025 (1).png";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();

  // Auth state
  const { isAuthenticated: isLoggedIn } = useSelector((state) => state.auth);

  // Cart items
  const { items } = useSelector((state) => state.cart);
  const cartItemsCount = items.reduce((total, item) => total + item.quantity, 0);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

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
          <div className={`collapse navbar-collapse ${isMenuOpen ? "show" : ""}`} id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-lg-center">

              {/* Home */}
              <li className="nav-item">
                <NavLink
                  to="/"
                  className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                  onClick={closeMenu}
                >
                  Home
                </NavLink>
              </li>

              {/* SIM Cards */}
              <li className="nav-item">
                <NavLink
                  to="/products"
                  className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                  onClick={closeMenu}
                >
                  SIM Cards
                </NavLink>
              </li>

              {/* Recharge */}
              <li className="nav-item">
                <NavLink
                  to="/recharge"
                  className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                  onClick={closeMenu}
                >
                  Recharge
                </NavLink>
              </li>

              {/* Plans */}
              <li className="nav-item">
                <NavLink
                  to="/plans"
                  className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                  onClick={closeMenu}
                >
                  Plans
                </NavLink>
              </li>

              {/* Cart */}
              <li className="nav-item ms-lg-3">
                <NavLink
                  to="/cart"
                  className="btn btn-outline-danger position-relative"
                  onClick={closeMenu}
                >
                  <FaShoppingCart className="me-1" /> Cart
                  {cartItemsCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {cartItemsCount}
                    </span>
                  )}
                </NavLink>
              </li>

              {/* Login / Account */}
              <li className="nav-item ms-2">
                {isLoggedIn ? (
                  <div className="dropdown">
                    <button
                      className="btn btn-danger dropdown-toggle"
                      type="button"
                      data-bs-toggle="dropdown"
                    >
                      <FaUser className="me-1" /> Account
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end">
                      <li>
                        <NavLink className="dropdown-item" to="/profile" onClick={closeMenu}>
                          My Profile
                        </NavLink>
                      </li>
                      <li>
                        <NavLink className="dropdown-item" to="/profile/orders" onClick={closeMenu}>
                          Order History
                        </NavLink>
                      </li>
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => {
                            dispatch(logout());
                            closeMenu();
                          }}
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                ) : (
                  <NavLink to="/login" className="btn btn-danger" onClick={closeMenu}>
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
