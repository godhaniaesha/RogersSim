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
import { toast } from "react-toastify";
import "../../style/checkout.css";
import { addAddress, createCheckout, fetchAddresses, fetchOrders, updateAddress } from "../../store/slices/checkOutSlice";
import { getCart } from "../../store/slices/cartSlice";

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get cart state from Redux
  const { items: cartItems, subtotal, tax, total, loading: cartLoading } =
    useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  // State for loading and error
  const [loading, setLoading] = useState(true);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const [error, setError] = useState(null);

  // Calculate cart total from Redux
  const cartTotal = cartItems
    ? cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
    : 547;

  // Redirect to login if not authenticated
  useEffect(() => {

    // If cart is empty, redirect to products
    if (cartItems && cartItems.length === 0 && !loading) {
      toast.error("Your cart is empty");
      navigate("/products");
    }

    setLoading(false);
  }, [isAuthenticated, cartItems, loading, navigate]);

  // Fetch addresses from API


  const [selectedAddress, setSelectedAddress] = useState(1);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("full");
  const [emiMonths, setEmiMonths] = useState(3);
  const { addresses = [] } = useSelector((state) => state.checkout);
  const { orders = [] } = useSelector((state) => state.checkout);


  // console.log(addresses, 'addressessss');

  const mappedAddresses = addresses.map((address, idx) => ({
    id: address._id, // Use MongoDB _id
    name: address.fullName,
    mobile: address.mobileNumber,
    address: address.address,
    city: address.city,
    state: address.state,
    pincode: address.pincode,
    isDefault: address.isDefault || false,
  }));


  useEffect(() => {
    dispatch(getCart());
    dispatch(fetchAddresses());
    dispatch(fetchOrders());
  }, [dispatch]);
  useEffect(() => {
    if (addresses && addresses.length > 0) {
      // console.log("Fetched addresses:", addresses);
    }
  }, [addresses]);
  // Calculate EMI details
  const calculateEMI = () => {
    if (!total || total <= 0) {
      return { finalPrice: "0.00", advance: "0.00", emiPerMonth: "0.00", totalMonths: emiMonths };
    }
    const finalPrice = total + total * 0.1;
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
    localStorage.setItem("selectedAddressId", addressId);
  };

  const handleAddressSubmit = async (values, { resetForm }) => {
    try {
      if (editingAddress) {
        // Use editingAddress.index for backend index
        const result = await dispatch(updateAddress({ index: editingAddress.index, ...values }));

        if (updateAddress.fulfilled.match(result)) {
          toast.success("Address updated successfully");
        } else {
          toast.error(result.payload || "Failed to update address");
        }
      } else {
        // Add new
        const result = await dispatch(addAddress(values));
        if (addAddress.fulfilled.match(result)) {
          toast.success("Address added successfully");
        } else {
          toast.error(result.payload || "Failed to add address");
        }
      }

      resetForm();
      setShowAddressForm(false);
      setEditingAddress(null);
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    }
  };

  // Edit address
  const handleEditAddress = (address, idx) => {
    setEditingAddress({ ...address, index: idx });
    localStorage.setItem("editingAddressIndex", idx);
    setShowAddressForm(true);
  };

  // Process payment
  const handlePayment = async () => {
    const storedAddressId = localStorage.getItem("selectedAddressId");

    if (!storedAddressId) {
      toast.error("Please select a delivery address");
      return;
    }

    try {
      const selectedAddrObj = mappedAddresses.find(
        (addr) => addr.id.toString() === storedAddressId
      );

      if (!selectedAddrObj) {
        toast.error("Invalid address selected");
        return;
      }

      // ✅ Instead of sending whole object, send only addressId
      const checkoutPayload = {
        shippingAddress: selectedAddrObj.id,
        items: cartItems,
        paymentMethod,
        amount: paymentMethod === "full" ? cartTotal : calculateEMI().advance,
        emiDetails: paymentMethod === "emi" ? calculateEMI() : null,
      };

      console.log("📦 Checkout Payload Sending:", checkoutPayload);

      const result = await dispatch(createCheckout(checkoutPayload));

      if (createCheckout.fulfilled.match(result)) {
        toast.success("Checkout created successfully!");

        console.log(result.payload.checkout._id, 'checkout result');

        localStorage.setItem("checkoutId", result.payload.checkout._id);

        navigate("/payment", {
          state: {
            orderId: result.payload._id,
            amount: checkoutPayload.amount,
            items: cartItems,
            address: selectedAddrObj, // or just the address id if needed
          },
        });
      } else {
        toast.error(result.payload || "Failed to create checkout");
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong");
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
                      {mappedAddresses.map((address, idx) => (
                        <div
                          key={address.id}
                          className={`d_address-card ${selectedAddress === address.id ? "selected" : ""}`}
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
                                  onChange={() => handleAddressSelect(address.id)}
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
                                  handleEditAddress(address, idx); // Pass idx here
                                }}
                              >
                                <FaEdit /> Edit
                              </button>
                            </div>
                            <div className="d_address-details">
                              <div>{address.mobile}</div>
                              <div>{address.address}</div>
                              <div>
                                {address.city}, {address.state} - {address.pincode}
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
                        className={`d_payment-option ${paymentMethod === "full" ? "selected" : ""
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
                        className={`d_payment-option ${paymentMethod === "emi" ? "selected" : ""
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
                                className={`d_emi-option ${emiMonths === month ? "selected" : ""
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


                <div className="d_card-body">
                  <div className="d_summary-item">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="d_summary-item">
                    <span>Delivery</span>
                    <span>Free</span>
                  </div>

                  <div className="d_summary-item">
                    <span>Tax</span>
                    <span>₹{tax}</span>
                  </div>


                  <hr />

                  <div className="d_summary-total d_summary-item">
                    <span>{paymentMethod === "emi" ? "Advance Payment" : "Total"}</span>
                    <span className="d_price">
                      ₹ {(
                        paymentMethod === "emi"
                          ? calculateEMI().advance
                          : total
                      ).toFixed(2)}
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
