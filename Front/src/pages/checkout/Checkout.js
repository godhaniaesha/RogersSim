import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaPlus,
  FaEdit,
  FaCreditCard,
  FaMoneyBill,
} from "react-icons/fa";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCart,
  removeFromCart,
  updateQuantity,
} from "../../store/slices/cartSlice";
import { toast } from "react-toastify";
import cartService from "../../services/cartService";
import "../../style/checkout.css";

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get cart state from Redux
  const { items: cartItems } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  // State for loading and error
  const [loading, setLoading] = useState(true);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const [error, setError] = useState(null);

  // Calculate cart total from Redux
  const cartTotal = cartItems
    ? cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
    : 547;

  // Fetch cart items when component mounts
  // useEffect(() => {
  //   dispatch(fetchCart());
  // }, [dispatch]);

  // Redirect to login if not authenticated
  useEffect(() => {
    // if (!isAuthenticated) {
    //   navigate('/login');
    //   return;
    // }
    // If cart is empty, redirect to products
    if (cartItems && cartItems.length === 0 && !loading) {
      toast.error("Your cart is empty");
      navigate("/products");
    }

    setLoading(false);
  }, [isAuthenticated, cartItems, loading, navigate]);

  // Fetch addresses from API
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: "John Doe",
      mobile: "9876543210",
      address: "123 Main Street, Apartment 4B",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      isDefault: true,
    },
    {
      id: 2,
      name: "John Doe",
      mobile: "9876543210",
      address: "456 Park Avenue, Floor 2",
      city: "Delhi",
      state: "Delhi",
      pincode: "110001",
      isDefault: false,
    },
  ]);

  const [selectedAddress, setSelectedAddress] = useState(1);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("full");
  const [emiMonths, setEmiMonths] = useState(3);

  // Calculate EMI details
  const calculateEMI = () => {
    if (!cartTotal || cartTotal <= 0) {
      return {
        finalPrice: "0.00",
        advance: "0.00",
        emiPerMonth: "0.00",
        totalMonths: emiMonths,
      };
    }

    const finalPrice = cartTotal + cartTotal * 0.1;
    const advance = finalPrice * 0.5;
    const emiPerMonth = (finalPrice - advance) / emiMonths;

    return {
      finalPrice: finalPrice.toFixed(2),
      advance: advance.toFixed(2),
      emiPerMonth: emiPerMonth.toFixed(2),
      totalMonths: emiMonths,
    };
  };

  // Address form validation schema
  const addressSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    mobile: Yup.string()
      .required("Mobile number is required")
      .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits"),
    address: Yup.string().required("Address is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    pincode: Yup.string()
      .required("Pincode is required")
      .matches(/^[0-9]{6}$/, "Pincode must be 6 digits"),
    isDefault: Yup.boolean(),
  });

  // Handle address selection
  const handleAddressSelect = (addressId) => {
    setSelectedAddress(addressId);
  };

  // Handle add/edit address form submission
  const handleAddressSubmit = async (values, { resetForm }) => {
    try {
      if (editingAddress) {
        // Update existing address via API
        await cartService.updateAddress({ ...values, id: editingAddress.id });

        // Update local state
        setAddresses(
          addresses.map((addr) =>
            addr.id === editingAddress.id ? { ...values, id: addr.id } : addr
          )
        );
        setEditingAddress(null);
        toast.success("Address updated successfully");
      } else {
        // Add new address via API
        const newAddress = {
          ...values,
          id: addresses.length + 1,
        };
        const savedAddress = await cartService.addAddress(newAddress);

        // Update local state with the saved address
        setAddresses([...addresses, savedAddress || newAddress]);
        toast.success("Address added successfully");
      }

      setShowAddressForm(false);
      resetForm();
    } catch (err) {
      toast.error(err.message || "Failed to save address");
    }
  };

  // Edit address
  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setShowAddressForm(true);
  };

  // Process payment
  const handlePayment = async () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      return;
    }

    try {
      // Create order in the backend
      // const orderData = await cartService.createOrder({
      //   addressId: selectedAddress,
      //   paymentMethod,
      //   emiMonths: paymentMethod === "emi" ? emiMonths : null,
      // });

      // // Navigate to payment page with payment details and order ID
      navigate("/payment", {
        state: {
          // orderId: orderData?.orderId,
          paymentMethod,
          amount: paymentMethod === "full" ? cartTotal : calculateEMI().advance,
          emiDetails: paymentMethod === "emi" ? calculateEMI() : null,
        },
      });
      // navigate('/payment')
    } catch (err) {
      toast.error(err.message || "Failed to create order");
    }
  };

  return (
    <div className="d_checkout-container">
      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading checkout...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger">
          {error}
          <button
            className="btn btn-outline-danger btn-sm ms-3"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          <div className="d_checkout-header">
            <h1 className="d_checkout-title">Checkout</h1>
            <Link to="/cart" className="d_back-to-cart-btn">
              <FaArrowLeft /> Back to Cart
            </Link>
          </div>

          <div className="d_checkout-content row">
            <div className="d_checkout-main col-md-8">
              <div className="d_card d_address-section">
                <div className="d_card-header">
                  <h4 className="d_card-title">Delivery Address</h4>
                </div>
                <div className="d_card-body">
                  {!showAddressForm ? (
                    <div className="d_address-list">
                      {addresses.map((address) => (
                        <div
                          key={address.id}
                          className={`d_address-card ${
                            selectedAddress === address.id ? "selected" : ""
                          }`}
                          onClick={() => handleAddressSelect(address.id)}
                        >
                          <div className="d_address-card-body">
                            <div className="d_address-actions">
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="addressSelection"
                                  id={`address-${address.id}`}
                                  checked={selectedAddress === address.id}
                                  onChange={() =>
                                    handleAddressSelect(address.id)
                                  }
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor={`address-${address.id}`}
                                >
                                  <strong>{address.name}</strong>
                                  {address.isDefault && (
                                    <span className="badge bg-danger ms-2">
                                      Default
                                    </span>
                                  )}
                                </label>
                              </div>
                              <button
                                className="d_edit-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditAddress(address);
                                }}
                              >
                                <FaEdit /> Edit
                              </button>
                            </div>
                            <div className="d_address-details">
                              <div>{address.mobile}</div>
                              <div>{address.address}</div>
                              <div>
                                {address.city}, {address.state} -{" "}
                                {address.pincode}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      <button
                        className="d_add-new-btn"
                        onClick={() => {
                          setEditingAddress(null);
                          setShowAddressForm(true);
                        }}
                      >
                        <FaPlus /> Add New Address
                      </button>
                    </div>
                  ) : (
                    <div className="card border-light">
                      <div className="card-body">
                        <h5 className="mb-3">
                          {editingAddress ? "Edit Address" : "Add New Address"}
                        </h5>

                        <Formik
                          initialValues={
                            editingAddress || {
                              name: "",
                              mobile: "",
                              address: "",
                              city: "",
                              state: "",
                              pincode: "",
                              isDefault: false,
                            }
                          }
                          validationSchema={addressSchema}
                          onSubmit={handleAddressSubmit}
                        >
                          {({ isSubmitting }) => (
                            <Form>
                              <div className="row">
                                <div className="col-md-6 mb-3">
                                  <label htmlFor="name" className="form-label">
                                    Full Name
                                  </label>
                                  <Field
                                    name="name"
                                    type="text"
                                    className="form-control"
                                  />
                                  <ErrorMessage
                                    name="name"
                                    component="div"
                                    className="text-danger small"
                                  />
                                </div>

                                <div className="col-md-6 mb-3">
                                  <label
                                    htmlFor="mobile"
                                    className="form-label"
                                  >
                                    Mobile Number
                                  </label>
                                  <Field
                                    name="mobile"
                                    type="text"
                                    className="form-control"
                                  />
                                  <ErrorMessage
                                    name="mobile"
                                    component="div"
                                    className="text-danger small"
                                  />
                                </div>
                              </div>

                              <div className="mb-3">
                                <label htmlFor="address" className="form-label">
                                  Address
                                </label>
                                <Field
                                  name="address"
                                  as="textarea"
                                  className="form-control"
                                  rows="2"
                                />
                                <ErrorMessage
                                  name="address"
                                  component="div"
                                  className="text-danger small"
                                />
                              </div>

                              <div className="row">
                                <div className="col-md-4 mb-3">
                                  <label htmlFor="city" className="form-label">
                                    City
                                  </label>
                                  <Field
                                    name="city"
                                    type="text"
                                    className="form-control"
                                  />
                                  <ErrorMessage
                                    name="city"
                                    component="div"
                                    className="text-danger small"
                                  />
                                </div>

                                <div className="col-md-4 mb-3">
                                  <label htmlFor="state" className="form-label">
                                    State
                                  </label>
                                  <Field
                                    name="state"
                                    type="text"
                                    className="form-control"
                                  />
                                  <ErrorMessage
                                    name="state"
                                    component="div"
                                    className="text-danger small"
                                  />
                                </div>

                                <div className="col-md-4 mb-3">
                                  <label
                                    htmlFor="pincode"
                                    className="form-label"
                                  >
                                    Pincode
                                  </label>
                                  <Field
                                    name="pincode"
                                    type="text"
                                    className="form-control"
                                  />
                                  <ErrorMessage
                                    name="pincode"
                                    component="div"
                                    className="text-danger small"
                                  />
                                </div>
                              </div>

                              <div className="mb-3">
                                <div className="d_toggle-wrapper">
                                  <Field name="isDefault">
                                    {({ field }) => (
                                      <>
                                        <input
                                          type="checkbox"
                                          id="isDefault"
                                          {...field}
                                          className="d_toggle-input"
                                        />
                                        <label
                                          htmlFor="isDefault"
                                          className="d_toggle-label"
                                        >
                                          <span className="d_toggle-slider"></span>
                                          <span className="d_toggle-text">
                                            Set as default address
                                          </span>
                                        </label>
                                      </>
                                    )}
                                  </Field>
                                </div>
                              </div>

                              <div className="d-flex gap-2">
                                <button
                                  type="submit"
                                  className="btn btn-primary"
                                  disabled={isSubmitting}
                                >
                                  {editingAddress
                                    ? "Update Address"
                                    : "Save Address"}
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-outline-secondary"
                                  onClick={() => setShowAddressForm(false)}
                                >
                                  Cancel
                                </button>
                              </div>
                            </Form>
                          )}
                        </Formik>
                      </div>
                    </div>
                  )}
                </div>

                {/* Payment Options */}
                <div className="d_card" style={{ boxShadow: "none" }}>
                  <div className="d_card-header">
                    <h4 className="d_card-title">Payment Options</h4>
                  </div>
                  <div className="d_card-body">
                    <div className="d_payment-options">
                      <div
                        className={`d_payment-option ${
                          paymentMethod === "full" ? "selected" : ""
                        }`}
                        onClick={() => setPaymentMethod("full")}
                      >
                        <FaCreditCard className="d_payment-icon" />
                        <div>
                          <div>
                            <strong>Full Payment</strong>
                          </div>
                          <div className="text-muted small">
                            Pay the entire amount now
                          </div>
                        </div>
                      </div>

                      <div
                        className={`d_payment-option ${
                          paymentMethod === "emi" ? "selected" : ""
                        }`}
                        onClick={() => setPaymentMethod("emi")}
                      >
                        <FaMoneyBill className="d_payment-icon" />
                        <div>
                          <div>
                            <strong>EMI Payment</strong>
                          </div>
                          <div className="text-muted small">
                            Pay 50% now and rest in monthly installments
                          </div>
                        </div>
                      </div>
                    </div>

                    {paymentMethod === "emi" && (
                      <div className="d_emi-details mt-4">
                        <div className="mb-3">
                          <label className="form-label">
                            Select EMI Duration
                          </label>
                          <div className="d_emi-options">
                            {[3, 6, 9, 12].map((month) => (
                              <div
                                key={month}
                                className={`d_emi-option ${
                                  emiMonths === month ? "selected" : ""
                                }`}
                                onClick={() => setEmiMonths(month)}
                              >
                                {month} Months
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* EMI Breakdown */}
                        <div className="d_emi-breakdown">
                          <div className="d_emi-row">
                            <span>Original Price</span>
                            <span>₹{cartTotal.toFixed(2)}</span>
                          </div>
                          <div className="d_emi-row">
                            <span>Processing Fee (10%)</span>
                            <span>₹{(cartTotal * 0.1).toFixed(2)}</span>
                          </div>
                          <div className="d_emi-row highlight">
                            <span>Final Price</span>
                            <span>₹{calculateEMI().finalPrice}</span>
                          </div>
                          <div className="d_emi-row advance">
                            <span>Advance Payment (Now)</span>
                            <span>₹{calculateEMI().advance}</span>
                          </div>
                          <div className="d_emi-row">
                            <span>Monthly Payment</span>
                            <span>
                              ₹{calculateEMI().emiPerMonth} × {emiMonths} months
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="col-md-4">
              <div className="d_summary-card d_card">
                <div className="d_card-header">
                  <h4 className="d_card-title">Order Summary</h4>
                </div>
                <div className="d_summary-products mb-3">
                  {cartItems.map((item, index) => (
                    <div key={index} className="d_summary-product">
                      {/* Product Image */}

                      {/* Product + Plan Details */}
                      <div className="d_summary-product-info">
                        <h6 className="mb-1">{item.product?.name}</h6>
                        <div className="text-muted small">
                          Type: {item.product?.type} ({item.product?.simType})
                        </div>

                        {item.plan && (
                          <div className="d_summary-plan mt-1">
                            <strong>{item.plan.name}</strong> - ₹
                            {item.plan.price}
                            <div className="text-muted small">
                              {item.plan.data} • {item.plan.validity} •{" "}
                              {item.plan.calls} • {item.plan.sms}
                            </div>
                          </div>
                        )}

                        {item.addons?.length > 0 && (
                          <div className="d_summary-addons mt-1">
                            <span className="fw-bold">Addons:</span>
                            <ul className="small mb-0">
                              {item.addons.map((addon) => (
                                <li key={addon.id}>
                                  {addon.name} (+₹{addon.price})
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Item Price */}
                      <div className="d_summary-product-price">
                        ₹{item.total}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="d_card-body">
                  <div className="d_summary-item">
                    <span>Subtotal</span>
                    <span>₹{cartTotal}</span>
                  </div>
                  <div className="d_summary-item">
                    <span>Delivery</span>
                    <span>Free</span>
                  </div>
                  {paymentMethod === "emi" && (
                    <div className="d_summary-item">
                      <span>Processing Fee (10%)</span>
                      <span>₹{(cartTotal * 0.1).toFixed(2)}</span>
                    </div>
                  )}
                  <hr />
                  <div className="d_summary-total d_summary-item">
                    <span>
                      {paymentMethod === "emi" ? "Advance Payment" : "Total"}
                    </span>
                    <span className="d_price">
                      ₹
                      {paymentMethod === "emi"
                        ? calculateEMI().advance
                        : cartTotal}
                    </span>
                  </div>
                  {paymentMethod === "emi" && (
                    <div className="d_summary-item text-muted small">
                      <span>Remaining EMI</span>
                      <span>
                        ₹{calculateEMI().emiPerMonth} x {emiMonths} months
                      </span>
                    </div>
                  )}
                  <button
                    className="d_proceed-btn btn btn-primary"
                    onClick={handlePayment}
                    disabled={!selectedAddress}
                  >
                    Proceed to Payment
                  </button>
                  {!selectedAddress && (
                    <div className="text-danger small text-center mt-2">
                      Please select a delivery address
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Checkout;
