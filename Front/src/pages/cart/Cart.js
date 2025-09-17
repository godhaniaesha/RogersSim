import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaTrash, FaArrowRight } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { clearCartError, getCart, removeFromCart } from '../../store/slices/cartSlice';
import { toast } from 'react-toastify';
import cartService from '../../services/cartService';
import { fetchProducts } from '../../store/slices/productSlice';

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
        dispatch(fetchProducts());
  // Clear any old error from add/remove before loading cart
  dispatch(clearCartError());
  dispatch(getCart());
}, [dispatch]);

  // Get cart and product state from Redux
  const { items, loading, error } = useSelector(state => state.cart);
  const products = useSelector(state => state.product.products);
  const { isAuthenticated } = useSelector(state => state.auth);

  // Update local cart state when Redux cart changes
  useEffect(() => {
    if (items) setCartItems(items);
  }, [items]);

  // Fetch cart items on mount
  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);

  // Redirect to login if not authenticated
useEffect(() => {
  // only redirect when authentication check finished
  if (isAuthenticated === false && !loading) {
    navigate('/login');
  }
}, [isAuthenticated, loading, navigate]);

  // Remove item from cart
  const removeItem = async (itemId) => {
    try {
      const result = await dispatch(removeFromCart(itemId));

      if (removeFromCart.fulfilled.match(result)) {
        toast.success("Item removed from cart");
      } else {
        // Fixed: Handle error object properly
        const errorMessage = result.payload || "Failed to remove item from cart";
        toast.error(typeof errorMessage === 'object' ? JSON.stringify(errorMessage) : errorMessage);
      }
    } catch (err) {
      // Fixed: Handle error object properly
      const errorMessage = err?.message || "Failed to remove item from cart";
      toast.error(typeof errorMessage === 'object' ? JSON.stringify(errorMessage) : errorMessage);
    }
  };

  // Calculate cart total
  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
  };

  // ✅ Tax calculation (example: 18% GST)
  const calculateTax = () => {
    const subtotal = calculateTotal();
    const taxRate = 0.18; // 18% GST, change if needed
    return Math.round(subtotal * taxRate);
  };

  // ✅ Final total including tax
  const calculateGrandTotal = () => {
    return calculateTotal() + calculateTax();
  };

  // Proceed to checkout
  const proceedToCheckout = () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    navigate('/checkout');
  };

  return (
    <div className="container py-5">
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="mb-0">Your Cart</h1>
        </div>
      </div>

      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading your cart...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger">
          {/* Fixed: Ensure error is displayed as string */}
          {typeof error === 'object' ? JSON.stringify(error) : error}
        </div>
      ) : cartItems.length > 0 ? (
        <div className="row">
          {/* Cart Items */}
          <div className="col-lg-8 mb-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                {cartItems.map((item) => {
                  const matchedProduct = products.find(
                    (p) => p._id === (item.productId?._id || item.productId)
                  );

                  if (!matchedProduct) {
                    return (
                      <div key={item._id} className="mb-4 pb-4 border-bottom">
                        <div className="alert alert-warning">
                          Product information not available
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={item._id} className="mb-4 pb-4 border-bottom">
                      <div className="row">
                        {/* Product Details */}
                        <div className="col-9">
                          <h5>{matchedProduct.name || 'Unknown Product'}</h5>

                          {/* Badges */}
                          <div className="d-flex mb-2">
                            <span className="badge bg-light text-dark me-2">
                              {matchedProduct.category ? 
                                (matchedProduct.category.charAt(0).toUpperCase() +
                                matchedProduct.category.slice(1)) : 
                                'N/A'
                              }
                            </span>
                            <span className="badge bg-light text-dark">
                              {matchedProduct.isPopular
                                ? 'Popular'
                                : matchedProduct.simType === 'esim'
                                  ? 'eSIM'
                                  : 'Physical SIM'}
                            </span>
                          </div>

                          <div className="mb-2 small">
                            <strong>Validity:</strong>{' '}
                            {matchedProduct.specifications?.validity || 'N/A'}
                          </div>
                        </div>

                        {/* Price and Remove */}
                        <div className="col-3 text-md-end mt-3 mt-md-0">
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => removeItem(item._id)}
                          >
                            <FaTrash className="me-0" />
                          </button>
                          <h5 className="mt-3">₹{item.totalPrice || 0}</h5>
                        </div>
                      </div>
                    </div>
                  );
                })}

                <div className="d-flex justify-content-between align-items-center">
                  <Link to="/products" className="btn btn-outline-primary">
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="col-lg-4">
            <div
              className="card border-0 shadow-sm sticky-lg-top"
              style={{ top: '2rem' }}
            >
              <div className="card-header bg-white py-3">
                <h4 className="mb-0">Order Summary</h4>
              </div>
              <div className="card-body">
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>₹{calculateTotal()}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Delivery</span>
                  <span>Free</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Tax (18%)</span>
                  <span>₹{calculateTax()}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between fw-bold mb-3">
                  <span>Total</span>
                  <span className="text-danger">₹{calculateGrandTotal()}</span>
                </div>
                <button
                  className="btn btn-primary w-100 py-2"
                  onClick={proceedToCheckout}
                >
                  Proceed to Checkout <FaArrowRight className="ms-2" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">
            <FaShoppingCart className="text-muted mb-3" size={50} />
            <h3>Your cart is empty</h3>
            <p className="text-muted mb-4">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Link to="/products" className="btn btn-primary">
              Browse Products
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;