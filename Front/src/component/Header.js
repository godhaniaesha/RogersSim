import React, { useState } from "react";
import logo from "../image/IMG_4025 (1).png";
import "../style/z_app.css";

function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="z_header_container">
      <nav className="navbar navbar-expand-lg z_header_navbar">
        <div className="container-fluid">
          {/* Logo */}
          <div className="row w-100 align-items-center">
            <div className="col-6 col-lg-2 z_header_logo">
              <a className="navbar-brand" href="/">
                <img src={logo} alt="Logo" style={{ width: "70px" }} />
              </a>
            </div>

            {/* Hamburger button */}
            <div className="col-6 d-lg-none text-end">
              <button
                className="navbar-toggler z_header_hamburger"
                type="button"
                onClick={toggleMenu}
              >
                <span className="navbar-toggler-icon"></span>
              </button>
            </div>

            {/* Nav links */}
            <div
              className={`col-12 col-lg-10 mt-3 mt-lg-0 ${
                isOpen ? "d-block" : "d-none d-lg-block"
              }`}
            >
              <ul className="navbar-nav ms-auto mb-2 mb-lg-0 z_header_links">
                <li className="nav-item">
                  <a className="nav-link" href="/mobility">
                    Mobility
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/internet">
                    Internet
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/tv">
                    TV and Broadcasting
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/security">
                    Home Security
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/offers">
                    Offers
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
