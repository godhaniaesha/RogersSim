import React, { useState } from "react";
import { Link } from "react-router-dom";
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
  const cartItemsCount = items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky-top shadow-sm">
      <nav className="navbar navbar-expand-lg navbar-light bg-white">
        <div className="container">
          {/* Logo */}
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <img
              src={Logo}
              alt="Rogers"
              style={{ height: "40px", width: "auto" }}
              className="me-2"
            />
          </Link>

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
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  Home
                </Link>
              </li>

              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  SIM Cards
                </a>
                <ul className="dropdown-menu dropdown-menu-animate">
                  <li>
                    <Link className="dropdown-item" to="/products?type=prepaid">
                      Prepaid
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/products?type=postpaid">
                      Postpaid
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/products?type=data">
                      Data Only
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/products?type=esim">
                      eSIM
                    </Link>
                  </li>
                </ul>
              </li>


              <li className="nav-item">
                <Link className="nav-link" to="/products">
                  Plans
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/products?type=addon">
                  Add-ons
                </Link>
              </li>
              <div className="d-flex align-items-center">
                {/* Cart */}
                <div className="nav-item ms-lg-3">
                  <Link
                    to="/cart"
                    className="btn btn-outline-danger position-relative"
                  >
                    <FaShoppingCart className="me-1" /> Cart
                    {cartItemsCount > 0 && (
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        {cartItemsCount}
                      </span>
                    )}
                  </Link>
                </div>

                {/* Login / Account */}
                <div className="nav-item ms-2">
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
                          <Link className="dropdown-item" to="/profile">
                            My Profile
                          </Link>
                        </li>
                        <li>
                          <Link className="dropdown-item" to="/profile/orders">
                            Order History
                          </Link>
                        </li>
                        <li>
                          <hr className="dropdown-divider" />
                        </li>
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => dispatch(logout())}
                          >
                            Logout
                          </button>
                        </li>
                      </ul>
                    </div>
                  ) : (
                    <Link to="/login" className="btn btn-danger">
                      <FaUser className="me-1" /> Login
                    </Link>
                  )}
                </div>
              </div>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
