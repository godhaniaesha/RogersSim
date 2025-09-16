import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaTrash, FaArrowRight } from 'react-icons/fa';

const Cart = () => {
  const navigate = useNavigate();
  
  // Mock cart items (would come from Redux/Context in real app)
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      product: {
        id: 1,
        name: 'Prepaid SIM Card',
        type: 'prepaid',
        simType: 'physical',
        price: 99,
        image: 'https://via.placeholder.com/300x200?text=Prepaid+SIM',
      },
      plan: {
        id: 2,
        name: 'Value',
        price: 399,
        data: '2GB/day',
        validity: '56 days',
        calls: 'Unlimited',
        sms: '100/day'
      },
      numberType: 'new',
      portingNumber: null,
      addons: [
        { id: 1, name: 'Extra 5GB Data', price: 49 }
      ],
      total: 547
    }
  ]);

  // Remove item from cart
  const removeItem = (itemId) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
  };

  // Calculate cart total
  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.total, 0);
  };

  // Proceed to checkout
  const proceedToCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="container py-5">
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="mb-0">Your Cart</h1>
        </div>
      </div>

      {cartItems.length > 0 ? (
        <div className="row">
          {/* Cart Items */}
          <div className="col-lg-8 mb-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                {cartItems.map(item => (
                  <div key={item.id} className="mb-4 pb-4 border-bottom">
                    <div className="row">
                      {/* Product Image */}
                      <div className="col-md-3 mb-3 mb-md-0">
                        <img 
                          src={item.product.image} 
                          alt={item.product.name}
                          className="img-fluid rounded"
                          style={{ maxHeight: '120px', objectFit: 'cover' }}
                        />
                      </div>
                      
                      {/* Product Details */}
                      <div className="col-md-6">
                        <h5>{item.product.name}</h5>
                        <div className="d-flex mb-2">
                          <span className="badge bg-light text-dark me-2">
                            {item.product.type.charAt(0).toUpperCase() + item.product.type.slice(1)}
                          </span>
                          <span className="badge bg-light text-dark">
                            {item.product.simType === 'esim' ? 'eSIM' : 'Physical SIM'}
                          </span>
                        </div>
                        
                        <div className="mb-2">
                          <strong>Plan:</strong> {item.plan.name} (₹{item.plan.price})
                          <div className="small text-muted">
                            {item.plan.data} • {item.plan.validity} • {item.plan.calls} calls
                          </div>
                        </div>
                        
                        <div className="mb-2">
                          <strong>Number:</strong> {item.numberType === 'new' ? 'New number' : `Port number: ${item.portingNumber}`}
                        </div>
                        
                        {item.addons.length > 0 && (
                          <div>
                            <strong>Add-ons:</strong>
                            <ul className="list-unstyled ms-3 mb-0 small">
                              {item.addons.map(addon => (
                                <li key={addon.id}>
                                  {addon.name} (₹{addon.price})
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                      
                      {/* Price and Remove */}
                      <div className="col-md-3 text-md-end mt-3 mt-md-0">
                        <h5 className="text-primary mb-3">₹{item.total}</h5>
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => removeItem(item.id)}
                        >
                          <FaTrash className="me-1" /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
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
            <div className="card border-0 shadow-sm sticky-lg-top" style={{ top: '2rem' }}>
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
                  <span>Tax</span>
                  <span>Included</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between fw-bold mb-3">
                  <span>Total</span>
                  <span className="text-primary">₹{calculateTotal()}</span>
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
            <p className="text-muted mb-4">Looks like you haven't added any products to your cart yet.</p>
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