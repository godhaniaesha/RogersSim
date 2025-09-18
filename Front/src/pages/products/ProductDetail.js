import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaArrowLeft,
  FaCheck,
  FaShoppingCart,
  FaInfoCircle,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../store/slices/cartSlice";
import { toast } from "react-toastify";
import productService from "../../services/productService";
import cartService from "../../services/cartService";
import {
  fetchProductById,
  fetchPlansByProductId,
} from "../../store/slices/productSlice";
import "../../App.css";

const ProductDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get("type"); // "prepaid" if prepaid product

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [numberType, setNumberType] = useState("new");
  const [portingNumber, setPortingNumber] = useState("");
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [addons, setAddons] = useState([]);
  const { product, loading, error, plans } = useSelector(
    (state) => state.product
  );
  const { items, loading: cartLoading } = useSelector((state) => state.cart);

  // Fetch product and plans
  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
      dispatch(fetchPlansByProductId(id));
    }
  }, [id, dispatch]);

  const handlePlanSelect = async (plan) => {
    console.log("Selected Plan:", plan);
    setSelectedPlan(plan);
    // try {
    //   const response = await productService.getAddonsByPlanId(plan.id);
    //   setAddons(response); // store fetched addons here
    // } catch (err) {
    //   toast.error("Failed to fetch addons for the selected plan");
    // }
  };

  const handleAddonToggle = (addon) => {
    if (selectedAddons.some((a) => a.id === addon.id)) {
      setSelectedAddons(selectedAddons.filter((a) => a.id !== addon.id));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  const calculateTotal = () => {
    let total = product ? product.price : 0;
    if (selectedPlan) total += selectedPlan.price;
    selectedAddons.forEach((addon) => (total += addon.price));
    return total;
  };

  const handleAddToCart = async () => {
  if (isPrepaid && !selectedPlan) {
    toast.error("Please select a plan to continue");
    return;
  }

  const cartItem = {
    productId: product?._id,
    planId: selectedPlan?._id || null,
    planType: selectedPlan?.planType || null,
    numberType,
    portingNumber: numberType === "port" ? portingNumber : null,
    totalPrice: calculateTotal(), // match backend field name
  };

  try {
    // call thunk which posts to API and updates store
    await dispatch(addToCart(cartItem)).unwrap();
    toast.success("Added to cart successfully!");
    navigate("/cart");
  } catch (err) {
    toast.error(
      err?.response?.data?.error ||
      err?.message ||
      "Failed to add item to cart"
    );
  }
};


  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-danger" role="status">
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
          {/* Fixed: Ensure error is displayed as string */}
          {typeof error === 'object' ? JSON.stringify(error) : error}
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
        <Link to="/products" className="btn btn-danger mt-3">
          Back to Products
        </Link>
      </div>
    );
  }

  const isPrepaid = product.category === "prepaid" || type === "prepaid";

  return (
    <div className="container py-5">
      {/* Back button */}
      <div className="mb-4">
        <Link to="/products" className="btn btn-outline-danger">
          <FaArrowLeft className="me-2" /> Back to Products
        </Link>
      </div>

      <div className="row">
        {/* Product Info */}
        <div className="col-lg-5 mb-4">
          <div className="card border-0 shadow-sm">
            <div className="position-relative">
              {product.popular && (
                <div className="position-absolute top-0 end-0 bg-danger text-white px-3 py-2 m-3 rounded-pill">
                  Popular
                </div>
              )}
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h2 className="card-title">{product.name}</h2>
                  <div className="d-flex align-items-center mb-2">
                    <span className="badge bg-light text-dark me-2">
                      {product?.type
                        ? product.type.charAt(0).toUpperCase() +
                          product.type.slice(1)
                        : "N/A"}
                    </span>
                    <span className="badge bg-light text-dark">
                      {product.simType === "esim" ? "eSIM" : "Physical SIM"}
                    </span>
                  </div>
                </div>
                <h3 className="text-danger mb-0">₹{product.price}</h3>
              </div>
              <p className="card-text">{product.description}</p>
              <h5 className="mt-4 mb-3">Features</h5>
              <ul className="list-unstyled">
                {product?.features?.length > 0 ? (
                  product.features.map((feature, index) => (
                    <li key={index} className="d-flex align-items-center mb-2">
                      <FaCheck className="text-danger me-2" />
                      {/* Fixed: Ensure feature is rendered as string */}
                      <span>{typeof feature === 'object' ? JSON.stringify(feature) : feature}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-muted">No features available</li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="col-lg-7">
          {isPrepaid ? (
            <>
              {/* Plan Selection */}
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-header bg-white py-3">
                  <h4 className="mb-0">Select a Plan</h4>
                </div>
                <div className="card-body">
                  <div className="row row-cols-1 row-cols-md-3 g-3">
                    {plans && plans.length > 0 ? plans.map((plan, index) => {
                      const uniqueKey = `${plan.id || plan._id}-${plan.planType || index}`;
                      const isSelected =
                        selectedPlan &&
                        (selectedPlan.id === plan.id || selectedPlan._id === plan._id) &&
                        selectedPlan.planType === plan.planType;

                      return (
                        <div className="col" key={uniqueKey}>
                          <div
                            className={`card h-100 ${
                              isSelected ? "border-danger" : "border-light"
                            }`}
                            onClick={() => handlePlanSelect(plan)}
                            style={{ cursor: "pointer" }}
                          >
                            <div className="card-body">
                              <h5 className="card-title">{plan.name || 'Unnamed Plan'}</h5>
                              <h6 className="text-danger mb-3">
                                ₹{plan.price || 0}
                              </h6>
                              <div className="small mb-1">
                                <strong>Data:</strong> {plan.dataLimit || 'N/A'}
                              </div>
                              <div className="small mb-1">
                                <strong>Validity:</strong> {plan.validity || 'N/A'}
                              </div>
                              <div className="small mb-1">
                                <strong>Speed:</strong> {plan.speed || 'N/A'}
                              </div>
                              <div className="small mb-1">
                                <strong>PlanType:</strong> {plan.planType || 'N/A'}
                              </div>
                            </div>
                            {isSelected && (
                              <div className="card-footer bg-danger text-white text-center py-2">
                                <small>Selected</small>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    }) : (
                      <div className="col-12">
                        <div className="text-center text-muted">
                          No plans available for this product
                        </div>
                      </div>
                    )}
                  </div>
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
                          ₹
                          {selectedAddons.reduce(
                            (sum, addon) => sum + addon.price,
                            0
                          )}
                        </span>
                      </div>
                      <div className="ps-3 small text-muted mb-2">
                        {selectedAddons.map((addon) => (
                          <div
                            key={addon.id}
                            className="d-flex justify-content-between"
                          >
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
                    <span className="text-danger">₹{calculateTotal()}</span>
                  </div>
                </div>
                <div className="card-footer bg-white border-0 pt-0">
                  <button
                    className="btn btn-danger w-100 py-2"
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
            </>
          ) : (
            <div className="alert alert-info">
              This is not a prepaid SIM, so no plan selection required.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;