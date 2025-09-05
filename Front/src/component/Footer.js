import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaLinkedin, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-dark text-white pt-5 pb-4">
      <div className="container">
        <div className="row">
          {/* Company Info */}
          <div className="col-md-3 mb-4">
            <h5 className="text-primary-custom fw-bold mb-4">ROGERS</h5>
            <p className="small">Rogers is a leading telecom provider offering innovative mobile solutions, high-speed internet, and cutting-edge technology services across India.</p>
            <div className="d-flex gap-2 mt-3">
              <a href="https://facebook.com" className="text-white" aria-label="Facebook">
                <FaFacebook size={20} />
              </a>
              <a href="https://twitter.com" className="text-white" aria-label="Twitter">
                <FaTwitter size={20} />
              </a>
              <a href="https://instagram.com" className="text-white" aria-label="Instagram">
                <FaInstagram size={20} />
              </a>
              <a href="https://youtube.com" className="text-white" aria-label="Youtube">
                <FaYoutube size={20} />
              </a>
              <a href="https://linkedin.com" className="text-white" aria-label="LinkedIn">
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="col-md-3 mb-4">
            <h5 className="text-white mb-4">Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="text-white text-decoration-none hover-primary">Home</Link>
              </li>
              <li className="mb-2">
                <Link to="/products" className="text-white text-decoration-none hover-primary">SIM Cards</Link>
              </li>
              <li className="mb-2">
                <Link to="/products" className="text-white text-decoration-none hover-primary">Plans</Link>
              </li>
              <li className="mb-2">
                <Link to="/products?type=addon" className="text-white text-decoration-none hover-primary">Add-ons</Link>
              </li>
            </ul>
          </div>
          
          {/* Support */}
          <div className="col-md-3 mb-4">
            <h5 className="text-white mb-4">Support</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="#" className="text-white text-decoration-none hover-primary">Help Center</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-white text-decoration-none hover-primary">Contact Us</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-white text-decoration-none hover-primary">FAQs</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-white text-decoration-none hover-primary">Network Coverage</a>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div className="col-md-3 mb-4">
            <h5 className="text-white mb-4">Contact Us</h5>
            <div className="d-flex mb-3">
              <FaMapMarkerAlt className="me-2 mt-1 text-primary-custom" />
              <p className="m-0">123 Telecom Street, Mumbai, Maharashtra 400001, India</p>
            </div>
            <div className="d-flex mb-3">
              <FaPhoneAlt className="me-2 mt-1 text-primary-custom" />
              <p className="m-0">+91 1800-123-4567</p>
            </div>
            <div className="d-flex mb-3">
              <FaEnvelope className="me-2 mt-1 text-primary-custom" />
              <p className="m-0">support@rogers.com</p>
            </div>
          </div>
        </div>
        
        {/* Bottom Footer */}
        <div className="row mt-4 pt-4 border-top border-secondary">
          <div className="col-md-6 mb-md-0 mb-3">
            <p className="small text-muted mb-0">&copy; {currentYear} Rogers Telecom. All rights reserved.</p>
          </div>
          <div className="col-md-6 text-md-end">
            <ul className="list-inline mb-0">
              <li className="list-inline-item">
                <a href="#" className="text-white small text-decoration-none hover-primary">Privacy Policy</a>
              </li>
              <li className="list-inline-item ms-3">
                <a href="#" className="text-white small text-decoration-none hover-primary">Terms of Service</a>
              </li>
              <li className="list-inline-item ms-3">
                <a href="#" className="text-white small text-decoration-none hover-primary">Sitemap</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;