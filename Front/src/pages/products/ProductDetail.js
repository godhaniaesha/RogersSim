import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCheck, FaShoppingCart, FaInfoCircle } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../store/slices/cartSlice';
import { toast } from 'react-toastify';
import productService from '../../services/productService';
import cartService from '../../services/cartService';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // State for product data
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [numberType, setNumberType] = useState('new');
  const [portingNumber, setPortingNumber] = useState('');
  const [selectedAddons, setSelectedAddons] = useState([]);
  
  // Get cart state from Redux
  const { items, loading: cartLoading } = useSelector(state => state.cart);

  // Mock plans data
  const plans = [
    { id: 1, name: 'Basic', price: 199, data: '1.5GB/day', validity: '28 days', calls: 'Unlimited', sms: '100/day' },
    { id: 2, name: 'Value', price: 399, data: '2GB/day', validity: '56 days', calls: 'Unlimited', sms: '100/day' },
    { id: 3, name: 'Premium', price: 699, data: '2.5GB/day', validity: '84 days', calls: 'Unlimited', sms: 'Unlimited' },
  ];

  // Mock addons data
  const addons = [
    { id: 1, name: 'Extra 5GB Data', price: 49, description: 'One-time 5GB data pack' },
    { id: 2, name: 'International Roaming', price: 149, description: 'Works in 10 countries for 7 days' },
    { id: 3, name: 'Weekend Data Booster', price: 29, description: 'Unlimited data on weekends' },
  ];

  // Mock products data
  const products = [
    {
      id: 1,
      name: 'Prepaid SIM Card',
      type: 'prepaid',
      simType: 'physical',
      description: 'Standard prepaid SIM card with flexible recharge options',
      price: 99,
      image: 'https://via.placeholder.com/300x200?text=Prepaid+SIM',
      popular: true,
      features: ['Nationwide coverage', 'Flexible recharge options', 'No contract']
    },
    {
      id: 2,
      name: 'Postpaid SIM Card',
      type: 'postpaid',
      simType: 'physical',
      description: 'Premium postpaid SIM with priority network access',
      price: 149,
      image: 'https://via.placeholder.com/300x200?text=Postpaid+SIM',
      popular: false,
      features: ['Priority network access', 'Monthly billing', 'Customer support']
    },
    {
      id: 3,
      name: 'Data Only SIM',
      type: 'data',
      simType: 'physical',
      description: 'High-speed data SIM for tablets and hotspots',
      price: 79,
      image: 'https://via.placeholder.com/300x200?text=Data+SIM',
      popular: false,
      features: ['High-speed data', 'No voice calls', 'Perfect for tablets']
    },
    {
      id: 4,
      name: 'eSIM Card',
      type: 'prepaid',
      simType: 'esim',
      description: 'Digital SIM card for compatible devices',
      price: 49,
      image: 'https://via.placeholder.com/300x200?text=eSIM',
      popular: true,
      features: ['No physical SIM needed', 'Instant activation', 'Compatible with newer devices']
    },
    {
      id: 5,
      name: 'Premium Postpaid eSIM',
      type: 'postpaid',
      simType: 'esim',
      description: 'Digital postpaid SIM with premium benefits',
      price: 199,
      image: 'https://via.placeholder.com/300x200?text=Premium+eSIM',
      popular: false,
      features: ['Premium network priority', 'Digital activation', 'Enhanced customer support']
    },
    {
      id: 6,
      name: 'International Travel SIM',
      type: 'prepaid',
      simType: 'physical',
      description: 'Prepaid SIM with international roaming benefits',
      price: 299,
      image: 'https://via.placeholder.com/300x200?text=Travel+SIM',
      popular: true,
      features: ['Works in 100+ countries', 'Affordable roaming rates', 'Data and voice']
    }
  ];

  // Fetch product data
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        
        // Fetch product details
        const productData = await productService.getProductById(id);
        setProduct(productData);
        
        // Fetch plans for this product
        const plansData = await productService.getPlansByProductId(id);
        
        // Set default selected plan
        if (plansData.length > 0) {
          setSelectedPlan(plansData[0]);
        }
        
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch product details');
        toast.error(err.message || 'Failed to fetch product details');
        // Fallback to mock data
        const foundProduct = products.find(p => p.id === parseInt(id));
        if (foundProduct) {
          setProduct(foundProduct);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchProductDetails();
  }, [id]);

  // Handle plan selection
  const handlePlanSelect = async (plan) => {
    setSelectedPlan(plan);
    
    try {
      // Fetch addons for the selected plan
      const addonsData = await productService.getAddonsByPlanId(plan.id);
      // We keep the existing addons implementation for now
    } catch (err) {
      toast.error('Failed to fetch addons for the selected plan');
    }
  };

  // Handle addon toggle
  const handleAddonToggle = (addon) => {
    if (selectedAddons.some(a => a.id === addon.id)) {
      setSelectedAddons(selectedAddons.filter(a => a.id !== addon.id));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  // Calculate total price
  const calculateTotal = () => {
    let total = product ? product.price : 0;
    if (selectedPlan) {
      total += selectedPlan.price;
    }
    selectedAddons.forEach(addon => {
      total += addon.price;
    });
    return total;
  };

  // Add to cart
  const handleAddToCart = async () => {
    if (!selectedPlan) {
      toast.error('Please select a plan to continue');
      return;
    }

    // Create cart item
    const cartItem = {
      product,
      plan: selectedPlan,
      numberType,
      portingNumber: numberType === 'port' ? portingNumber : null,
      addons: selectedAddons,
      total: calculateTotal()
    };

    try {
      // Dispatch to Redux
      dispatch(addToCart(cartItem));
      
      // Add to cart via API
      await cartService.addToCart(cartItem);
      
      // Show success message
      toast.success('Added to cart successfully!');
      
      // Navigate to cart
      navigate('/cart');
    } catch (err) {
      toast.error(err.message || 'Failed to add item to cart');
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading product details...</p>
      </div>
    );
  }
  
  if (error && !product) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          {error}
          <button 
            className="btn btn-outline-danger btn-sm ms-3"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-5 text-center">
        <h2>Product not found</h2>
        <Link to="/products" className="btn btn-primary mt-3">
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* Back button */}
      <div className="mb-4">
        <Link to="/products" className="btn btn-outline-primary">
          <FaArrowLeft className="me-2" /> Back to Products
        </Link>
      </div>

      <div className="row">
        {/* Product Details */}
        <div className="col-lg-5 mb-4">
          <div className="card border-0 shadow-sm">
            <div className="position-relative">
              {product.popular && (
                <div className="position-absolute top-0 end-0 bg-primary text-white px-3 py-2 m-3 rounded-pill">
                  Popular
                </div>
              )}
              <img 
                src={product.image} 
                className="card-img-top" 
                alt={product.name} 
                style={{ height: '250px', objectFit: 'cover' }}
              />
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h2 className="card-title">{product.name}</h2>
                  <div className="d-flex align-items-center mb-2">
                    <span className="badge bg-light text-dark me-2">
                      {product.type.charAt(0).toUpperCase() + product.type.slice(1)}
                    </span>
                    <span className="badge bg-light text-dark">
                      {product.simType === 'esim' ? 'eSIM' : 'Physical SIM'}
                    </span>
                  </div>
                </div>
                <h3 className="text-primary mb-0">₹{product.price}</h3>
              </div>
              
              <p className="card-text">{product.description}</p>
              
              <h5 className="mt-4 mb-3">Features</h5>
              <ul className="list-unstyled">
                {product.features.map((feature, index) => (
                  <li key={index} className="d-flex align-items-center mb-2">
                    <FaCheck className="text-primary me-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Plan Selection */}
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white py-3">
              <h4 className="mb-0">Select a Plan</h4>
            </div>
            <div className="card-body">
              <div className="row row-cols-1 row-cols-md-3 g-3">
                {plans.map(plan => (
                  <div className="col" key={plan.id}>
                    <div 
                      className={`card h-100 ${selectedPlan && selectedPlan.id === plan.id ? 'border-primary' : 'border-light'}`}
                      onClick={() => handlePlanSelect(plan)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="card-body">
                        <h5 className="card-title">{plan.name}</h5>
                        <h6 className="text-primary mb-3">₹{plan.price}</h6>
                        <div className="small mb-1">
                          <strong>Data:</strong> {plan.data}
                        </div>
                        <div className="small mb-1">
                          <strong>Validity:</strong> {plan.validity}
                        </div>
                        <div className="small mb-1">
                          <strong>Calls:</strong> {plan.calls}
                        </div>
                        <div className="small mb-1">
                          <strong>SMS:</strong> {plan.sms}
                        </div>
                      </div>
                      {selectedPlan && selectedPlan.id === plan.id && (
                        <div className="card-footer bg-primary text-white text-center py-2">
                          <small>Selected</small>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Number Selection */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white py-3">
              <h4 className="mb-0">Number Selection</h4>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <div className="form-check mb-2">
                  <input 
                    className="form-check-input" 
                    type="radio" 
                    name="numberType" 
                    id="newNumber" 
                    checked={numberType === 'new'}
                    onChange={() => setNumberType('new')}
                  />
                  <label className="form-check-label" htmlFor="newNumber">
                    Get a new number
                  </label>
                </div>
                <div className="form-check">
                  <input 
                    className="form-check-input" 
                    type="radio" 
                    name="numberType" 
                    id="portNumber" 
                    checked={numberType === 'port'}
                    onChange={() => setNumberType('port')}
                  />
                  <label className="form-check-label" htmlFor="portNumber">
                    Port my existing number
                  </label>
                </div>
              </div>

              {numberType === 'port' && (
                <div className="mt-3">
                  <label htmlFor="portingNumber" className="form-label">Enter your number to port</label>
                  <input 
                    type="tel" 
                    className="form-control" 
                    id="portingNumber" 
                    placeholder="10-digit mobile number"
                    value={portingNumber}
                    onChange={(e) => setPortingNumber(e.target.value)}
                    maxLength="10"
                  />
                  <div className="form-text">
                    <FaInfoCircle className="me-1" />
                    Your current SIM will remain active during the porting process
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Add-ons */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white py-3">
              <h4 className="mb-0">Optional Add-ons</h4>
            </div>
            <div className="card-body">
              {addons.map(addon => (
                <div className="form-check custom-checkbox mb-3" key={addon.id}>
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    id={`addon-${addon.id}`}
                    checked={selectedAddons.some(a => a.id === addon.id)}
                    onChange={() => handleAddonToggle(addon)}
                  />
                  <label className="form-check-label d-flex justify-content-between" htmlFor={`addon-${addon.id}`}>
                    <div>
                      <div>{addon.name}</div>
                      <small className="text-muted">{addon.description}</small>
                    </div>
                    <div className="text-primary">₹{addon.price}</div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white py-3">
              <h4 className="mb-0">Summary</h4>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <span>SIM Card ({product.name})</span>
                <span>₹{product.price}</span>
              </div>
              {selectedPlan && (
                <div className="d-flex justify-content-between mb-2">
                  <span>Plan ({selectedPlan.name})</span>
                  <span>₹{selectedPlan.price}</span>
                </div>
              )}
              {selectedAddons.length > 0 && (
                <>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Add-ons</span>
                    <span>
                      ₹{selectedAddons.reduce((sum, addon) => sum + addon.price, 0)}
                    </span>
                  </div>
                  <div className="ps-3 small text-muted mb-2">
                    {selectedAddons.map((addon, index) => (
                      <div key={addon.id} className="d-flex justify-content-between">
                        <span>{addon.name}</span>
                        <span>₹{addon.price}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
              <hr />
              <div className="d-flex justify-content-between fw-bold">
                <span>Total</span>
                <span className="text-primary">₹{calculateTotal()}</span>
              </div>
            </div>
            <div className="card-footer bg-white border-0 pt-0">
              <button 
                className="btn btn-primary w-100 py-2" 
                onClick={handleAddToCart}
                disabled={!selectedPlan}
              >
                <FaShoppingCart className="me-2" />
                Add to Cart
              </button>
              {!selectedPlan && (
                <div className="text-center text-danger small mt-2">
                  Please select a plan to continue
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;