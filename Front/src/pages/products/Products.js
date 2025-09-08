import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaFilter, FaSort, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, setFilters, setSort } from '../../store/slices/productSlice';
import "../../style/z_app.css"
import { toast } from 'react-toastify';
import productService from '../../services/productService';

const Products = () => {
  const dispatch = useDispatch();

  // Get products state from Redux
  // const { products, loading, error } = useSelector(state => state.products);
  const { products = [], loading = false, error = null } =
    useSelector(state => state.products || {});

  // Mock product data (would come from API in real app)
  const [mockProducts, setMockProducts] = useState([
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
  ]);

  // Filter states
  const [filters, setLocalFilters] = useState({
    type: '',
    simType: '',
    priceRange: '',
    popular: false
  });

  // Sort state
  const [sortBy, setLocalSortBy] = useState('popularity');

  // Offcanvas state for mobile filters
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  // Update Redux when local state changes
  useEffect(() => {
    dispatch(setFilters(filters));
  }, [filters, dispatch]);

  useEffect(() => {
    dispatch(setSort(sortBy));
  }, [sortBy, dispatch]);

  // Filtered products
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Use products from Redux if available, otherwise use mock data
  const productsToUse = products && products.length > 0 ? products : mockProducts;

  // Apply filters and sorting
  useEffect(() => {
    let result = [...productsToUse];

    // Apply filters
    if (filters.type) {
      result = result.filter(product => product.type === filters.type);
    }

    if (filters.simType) {
      result = result.filter(product => product.simType === filters.simType);
    }

    if (filters.popular) {
      result = result.filter(product => product.popular);
    }

    if (filters.priceRange) {
      switch (filters.priceRange) {
        case 'under100':
          result = result.filter(product => product.price < 100);
          break;
        case '100to200':
          result = result.filter(product => product.price >= 100 && product.price <= 200);
          break;
        case 'over200':
          result = result.filter(product => product.price > 200);
          break;
        default:
          break;
      }
    }

    // Apply sorting
    switch (sortBy) {
      case 'priceLow':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'priceHigh':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'popularity':
        result.sort((a, b) => (b.popular === a.popular) ? 0 : b.popular ? 1 : -1);
        break;
      default:
        break;
    }

    setFilteredProducts(result);
  }, [productsToUse, filters, sortBy]);

  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  // Reset filters
  const resetFilters = () => {
    setLocalFilters({
      type: '',
      simType: '',
      priceRange: '',
      popular: false
    });
    setLocalSortBy('popularity');
  };

  // Filter Content Component (to avoid code duplication)
  const FilterContent = () => (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Filters</h5>
        <button
          className="btn btn-sm btn-link text-decoration-none"
          onClick={resetFilters}
        >
          Reset
        </button>
      </div>

      {/* SIM Type Filter */}
      <div className="mb-4">
        <h6>SIM Type</h6>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="simType"
            id="simTypeAll"
            checked={filters.simType === ''}
            onChange={() => handleFilterChange('simType', '')}
          />
          <label className="form-check-label" htmlFor="simTypeAll">
            All
          </label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="simType"
            id="simTypePhysical"
            checked={filters.simType === 'physical'}
            onChange={() => handleFilterChange('simType', 'physical')}
          />
          <label className="form-check-label" htmlFor="simTypePhysical">
            Physical SIM
          </label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="simType"
            id="simTypeEsim"
            checked={filters.simType === 'esim'}
            onChange={() => handleFilterChange('simType', 'esim')}
          />
          <label className="form-check-label" htmlFor="simTypeEsim">
            eSIM
          </label>
        </div>
      </div>

      {/* Plan Type Filter */}
      <div className="mb-4">
        <h6>Plan Type</h6>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="planType"
            id="planTypeAll"
            checked={filters.type === ''}
            onChange={() => handleFilterChange('type', '')}
          />
          <label className="form-check-label" htmlFor="planTypeAll">
            All
          </label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="planType"
            id="planTypePrepaid"
            checked={filters.type === 'prepaid'}
            onChange={() => handleFilterChange('type', 'prepaid')}
          />
          <label className="form-check-label" htmlFor="planTypePrepaid">
            Prepaid
          </label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="planType"
            id="planTypePostpaid"
            checked={filters.type === 'postpaid'}
            onChange={() => handleFilterChange('type', 'postpaid')}
          />
          <label className="form-check-label" htmlFor="planTypePostpaid">
            Postpaid
          </label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="planType"
            id="planTypeData"
            checked={filters.type === 'data'}
            onChange={() => handleFilterChange('type', 'data')}
          />
          <label className="form-check-label" htmlFor="planTypeData">
            Data Only
          </label>
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="mb-4">
        <h6>Price Range</h6>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="priceRange"
            id="priceRangeAll"
            checked={filters.priceRange === ''}
            onChange={() => handleFilterChange('priceRange', '')}
          />
          <label className="form-check-label" htmlFor="priceRangeAll">
            All
          </label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="priceRange"
            id="priceRangeUnder100"
            checked={filters.priceRange === 'under100'}
            onChange={() => handleFilterChange('priceRange', 'under100')}
          />
          <label className="form-check-label" htmlFor="priceRangeUnder100">
            Under ₹100
          </label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="priceRange"
            id="priceRange100to200"
            checked={filters.priceRange === '100to200'}
            onChange={() => handleFilterChange('priceRange', '100to200')}
          />
          <label className="form-check-label" htmlFor="priceRange100to200">
            ₹100 - ₹200
          </label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="priceRange"
            id="priceRangeOver200"
            checked={filters.priceRange === 'over200'}
            onChange={() => handleFilterChange('priceRange', 'over200')}
          />
          <label className="form-check-label" htmlFor="priceRangeOver200">
            Over ₹200
          </label>
        </div>
      </div>

      {/* Popular Filter */}
      <div className="mb-4">
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            id="popularFilter"
            checked={filters.popular}
            onChange={(e) => handleFilterChange('popular', e.target.checked)}
          />
          <label className="form-check-label" htmlFor="popularFilter">
            Show only popular SIMs
          </label>
        </div>
      </div>

      {/* Sort Options */}
      <div>
        <h6 className="d-flex align-items-center"><FaSort className="me-2" /> Sort By</h6>
        <select
          className="form-select"
          value={sortBy}
          onChange={(e) => setLocalSortBy(e.target.value)}
        >
          <option value="popularity">Popularity</option>
          <option value="priceLow">Price: Low to High</option>
          <option value="priceHigh">Price: High to Low</option>
        </select>
      </div>
    </>
  );

  return (
    <div className="container py-5">
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="mb-2">SIM Cards</h1>
              <p className="lead mb-0">Choose the perfect SIM card for your needs</p>
            </div>
            {/* Mobile Filter Button */}
            <button
              className="btn btn-outline-primary d-xl-none"
              type="button"
              onClick={() => setShowOffcanvas(true)}
            >
              <FaFilter className="me-2" />
              Filters
            </button>
          </div>

          {loading && (
            <div className="d-flex justify-content-center my-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
              <button
                className="btn btn-sm btn-outline-danger ms-3"
                onClick={() => dispatch(fetchProducts())}
              >
                Retry
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="row">
        {/* Desktop Filters - Always visible on desktop */}
        <div className="col-md-3 mb-4">
          <div className="card border-0 shadow-sm position-sticky" style={{ top: '1rem' }}>
            <div className="card-body">
              <FilterContent />
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="col-md-9">
          {/* Results count */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <p className="text-muted mb-0">
              Showing {filteredProducts.length} of {productsToUse.length} SIM cards
            </p>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="row">
              {filteredProducts.map(product => (
                <div className="col-12 col-sm-6 col-lg-4 mb-4 d-flex justify-content-center" key={product.id}>
                  <div className="card h-100 border-0 shadow-sm z_prd_card">
                    <div className="card-body d-flex flex-column">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="card-title mb-0">{product.name}</h5>
                      </div>
                      <p className="card-text text-muted small mb-3">{product.description}</p>
                      <div className="mb-3 flex-grow-1">
                        {product.features.map((feature, index) => (
                          <div key={index} className="d-flex align-items-center mb-1">
                            <div className="me-2 z_prd_bullet">•</div>
                            <div className="small">{feature}</div>
                          </div>
                        ))}
                      </div>
                      <div className="d-flex justify-content-between align-items-center mt-auto">
                        <h5 className="z_prd_price mb-0">₹{product.price}</h5>
                        <Link
                          to={`/products/${product.id}`}
                          className="btn z_prd_btn"
                        >
                          Select
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center py-5">
                <h5>No SIM cards found</h5>
                <p className="text-muted mb-4">Try adjusting your filters to see more options.</p>
                <button
                  className="btn z_prd_btn"
                  onClick={resetFilters}
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;