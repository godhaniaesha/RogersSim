import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import {
  FaUser,
  FaIdCard,
  FaHistory,
  FaMapMarkerAlt,
  FaEdit,
  FaSave,
  FaBarcode,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  updateProfileStart,
  updateProfileSuccess,
  updateProfileFailure,
  fetchProfileStart,
  fetchProfileSuccess,
  fetchProfileFailure,
} from "../../store/slices/authSlice";
import authService from "../../services/authService";
import {
  fetchUserProfile,
  updateUserProfile,
} from "../../store/slices/userSlice";
import { fetchMyOrders } from "../../store/slices/orderSlice";
// Import card slice actions
import {
  checkoutComplete,
  requestOtp,
  activateCard,
  clearCardState,
  clearError,
  resetOtpState,
} from "../../store/slices/cardSlice";
import { uploadKyc } from "../../store/slices/kycSlice";

const Profile = () => {
  // KYC file upload states
  const [profileToastShown, setProfileToastShown] = useState(false);
  const [idProofFile, setIdProofFile] = useState(null);
  const [addressProofFile, setAddressProofFile] = useState(null);
  const [activeTab, setActiveTab] = useState("personal");
  const [barcode, setBarcode] = useState("");
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const kycState = useSelector(state => state.kyc);

  // Get user profile from Redux
  const { user, loading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );
  // Get card state from Redux
  const {
    currentCard,
    loading: cardLoading,
    error: cardError,
    otpSent,
    activationSuccess,
  } = useSelector((state) => state.card);

  // Orders state
  const {
    orders: myOrders,
    loading: ordersLoading,
    error: ordersError,
  } = useSelector((state) => state.orders);
  useEffect(() => {
  // Only redirect if we *know* the user is not authenticated
  if (isAuthenticated === false) {
    navigate("/login");
  }

  // fetch profile only if not already in localStorage
  const cachedProfile = localStorage.getItem("userProfile");
  if (cachedProfile) {
    dispatch(fetchProfileSuccess(JSON.parse(cachedProfile)));
  }

  // Always fetch a fresh profile
  dispatch(fetchUserProfile())
    .unwrap()
    .then((profile) => {
      localStorage.setItem("userProfile", JSON.stringify(profile));
      if (!profileToastShown.current) {
        toast.success("Profile loaded successfully"); 
        profileToastShown.current = true;
      }
    })
    .catch((err) => {
      toast.error(err);
    });
}, [isAuthenticated, navigate, dispatch]);


  useEffect(() => {
    if (activeTab === "orders") {
      dispatch(fetchMyOrders());
    }
  }, [activeTab, dispatch]);

  // Clear card state when component unmounts or tab changes
  useEffect(() => {
    return () => {
      dispatch(clearCardState());
    };
  }, [dispatch]);

  // Handle checkout complete (when user enters barcode)
  const handleCheckoutComplete = async () => {
    if (!barcode || barcode.length < 8) {
      toast.error("Please enter a valid barcode (minimum 8 digits)");
      return;
    }

    try {
      await dispatch(checkoutComplete({ barcode })).unwrap();
      toast.success("Card checkout completed successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to complete checkout");
    }
  };

  // Handle OTP request
  const handleRequestOtp = async () => {
    if (!barcode) {
      toast.error("Please enter barcode first");
      return;
    }

    try {
      await dispatch(requestOtp({ barcode })).unwrap();
      toast.success("OTP sent to your registered mobile number");
    } catch (error) {
      toast.error(error.message || "Failed to send OTP");
    }
  };

  // Handle card activation
  const handleActivateCard = async () => {
    if (!barcode || !otp) {
      toast.error("Please enter both barcode and OTP");
      return;
    }

    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      await dispatch(activateCard({ barcode, otp })).unwrap();
      toast.success("Card activated successfully!");

      // Reset form after successful activation
      setTimeout(() => {
        setBarcode("");
        setOtp("");
        dispatch(clearCardState());
        setActiveTab("personal");
      }, 2000);
    } catch (error) {
      toast.error(error.message || "Failed to activate card");
    }
  };

  // Clear error when user starts typing
  const handleBarcodeChange = (e) => {
    setBarcode(e.target.value);
    if (cardError) {
      dispatch(clearError());
    }
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value.replace(/\D/g, ""));
    if (cardError) {
      dispatch(clearError());
    }
  };

  // Validation schema for personal details
  const personalDetailsSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    mobile: Yup.string()
      .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits")
      .required("Mobile number is required"),
    address: Yup.string().required("Address is required"),
    pincode: Yup.string()
      .matches(/^[0-9]{6}$/, "Pincode must be 6 digits")
      .required("Pincode is required"),
  });

  // Handle personal details update
  const handlePersonalDetailsUpdate = async (values, { setSubmitting }) => {
    try {
      await dispatch(updateUserProfile(values)).unwrap();
      toast.success("Profile updated successfully!");

      // save profile to localStorage
      localStorage.setItem("userProfile", JSON.stringify(values));

      // 🔁 update success pachhi profile feri fetch karo
      await dispatch(fetchUserProfile()).unwrap();
    } catch (err) {
      toast.error(err || "Failed to update profile");
    } finally {
      setSubmitting(false);
    }
  };

  // Dynamic KYC document upload using uploadKyc thunk
  const handleDocumentUpload = async (type, e) => {
    if (!isAuthenticated) {
      toast.error("Please login to upload documents.");
      return;
    }
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append(type, file);

    try {
      await dispatch(uploadKyc(formData)).unwrap();
      toast.success(`${type} uploaded successfully!`);
      // Optionally refresh profile after upload
      await dispatch(fetchUserProfile()).unwrap();
    } catch (err) {
      toast.error(err || "Failed to upload document");
    }
  };
  const [userData, setUserData] = useState({
    name: user?.name || 'John Doe',
    email: user?.email || 'john.doe@example.com',
    mobile: user?.mobile || '9876543210',
    address: user?.address || '123 Main Street, Mumbai, Maharashtra',
    pincode: user?.pincode || '400001',
    kycStatus: user?.kycStatus || 'pending', // 'pending', 'verified', 'rejected'
    kycDocuments: user?.kycDocuments || {
      idProof: null,
      addressProof: null
    }
  });
  console.log("userData", userData);
  

  return (
    <div className="container py-5">
      <div className="row">
        {/* Profile Sidebar */}
        <div className="col-md-3 mb-4">
          <div className="card border-0 shadow-sm x_m_card">
            <div className="card-body">
              <div className="text-center mb-4">
                <div
                  className="bg-light-custom rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                  style={{ width: "100px", height: "100px" }}
                >
                  <FaUser className="text-primary-custom" size={40} />
                </div>
                <h5 className="mb-0">{user.name}</h5>
                <p className="text-muted small">{user.email}</p>
              </div>

              <div className="list-group list-group-flush">
                <button
                  className={`list-group-item list-group-item-action border-0  d-flex align-items-center x_btn_rs ${activeTab === "personal"
                    ? "active bg-primary-custom text-white"
                    : ""
                    }`}
                  onClick={() => setActiveTab("personal")}
                >
                  <div>
                    <FaUser className="me-2" />
                  </div>
                  Personal Details
                </button>
                <button
                  className={`list-group-item list-group-item-action border-0 d-flex align-items-center x_btn_rs ${activeTab === "kyc"
                    ? "active bg-primary-custom text-white"
                    : ""
                    }`}
                  onClick={() => setActiveTab("kyc")}
                >
                  <FaIdCard className="me-2" /> KYC Verification
                </button>
                <button
                  className={`list-group-item list-group-item-action border-0 d-flex align-items-center x_btn_rs ${activeTab === "orders"
                    ? "active bg-primary-custom text-white"
                    : ""
                    }`}
                  onClick={() => setActiveTab("orders")}
                >
                  <FaHistory className="me-2" /> Order History
                </button>
                <button
                  className={`list-group-item list-group-item-action border-0 d-flex align-items-center x_btn_rs ${activeTab === "activate"
                    ? "active bg-primary-custom text-white"
                    : ""
                    }`}
                  onClick={() => setActiveTab("activate")}
                >
                  <FaBarcode className="me-2" /> Activate Card
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="col-md-9">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              {/* Personal Details Tab */}
              {activeTab === "personal" && (
                <div>
                  <h4 className="mb-4">Personal Details</h4>
                  <Formik
                    initialValues={{
                      name: user?.name || "",
                      email: user?.email || "",
                      mobile: user?.mobile || "",
                      address: user?.address || "",
                      pincode: user?.pincode || "",
                    }}
                    validationSchema={personalDetailsSchema}
                    onSubmit={handlePersonalDetailsUpdate}
                    enableReinitialize
                  >
                    {({ isSubmitting }) => (
                      <Form>
                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <label htmlFor="name" className="form-label">
                              Full Name
                            </label>
                            <Field name="name" className="form-control" />
                            <ErrorMessage
                              name="name"
                              component="div"
                              className="text-danger small"
                            />
                          </div>
                          <div className="col-md-6 mb-3">
                            <label htmlFor="email" className="form-label">
                              Email
                            </label>
                            <Field
                              name="email"
                              type="email"
                              className="form-control"
                            />
                            <ErrorMessage
                              name="email"
                              component="div"
                              className="text-danger small"
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <label htmlFor="mobile" className="form-label">
                              Mobile
                            </label>
                            <Field name="mobile" className="form-control" />
                            <ErrorMessage
                              name="mobile"
                              component="div"
                              className="text-danger small"
                            />
                          </div>
                          <div className="col-md-6 mb-3">
                            <label htmlFor="pincode" className="form-label">
                              Pincode
                            </label>
                            <Field name="pincode" className="form-control" />
                            <ErrorMessage
                              name="pincode"
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
                            rows={3}
                          />
                          <ErrorMessage
                            name="address"
                            component="div"
                            className="text-danger small"
                          />
                        </div>
                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            "Saving..."
                          ) : (
                            <>
                              <FaSave className="me-2" /> Save Changes
                            </>
                          )}
                        </button>
                      </Form>
                    )}
                  </Formik>
                </div>
              )}

           
              {activeTab === 'kyc' && (
                <div>
                  <h4 className="mb-4">KYC Verification</h4>
               
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (!isAuthenticated) {
                        toast.error("Please login to upload documents.");
                        return;
                      }
                      if (!idProofFile && !addressProofFile) {
                        toast.error("Please select both documents.");
                        return;
                      }
                      const formData = new FormData();
                      if (idProofFile) formData.append('idProof', idProofFile);
                      if (addressProofFile) formData.append('addressProof', addressProofFile);
                      try {
                        await dispatch(uploadKyc(formData)).unwrap();
                        toast.success("KYC documents uploaded successfully!");
                        await dispatch(fetchUserProfile()).unwrap();
                      } catch (err) {
                        toast.error(err || "Failed to upload KYC documents");
                      }
                    }}
                  >
                    <div className="row mb-4">
                      <div className="col-md-6 mb-3 mb-md-0">
                        <div className="card h-100">
                          <div className="card-body">
                            <h5 className="card-title">ID Proof</h5>
                            <p className="card-text text-muted small">Upload your Aadhaar Card, PAN Card, Voter ID, or Driving License</p>
                            <input
                              type="file"
                              accept="image/*,application/pdf"
                              onChange={(e) => setIdProofFile(e.target.files[0])}
                              className="form-control"
                            />
                            {userData.kycDocuments.idProof && (
                              <div className="mt-2">
                                <span className="text-success">Uploaded: {userData.kycDocuments.idProof}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="card h-100">
                          <div className="card-body">
                            <h5 className="card-title">Address Proof</h5>
                            <p className="card-text text-muted small">Upload your Latest Utility Bill, Valid Rental Agreement, or Passport Copy</p>
                            <input
                              type="file"
                              accept="image/*,application/pdf"
                              onChange={(e) => setAddressProofFile(e.target.files[0])}
                              className="form-control"
                            />
                            {userData.kycDocuments.addressProof && (
                              <div className="mt-2">
                                <span className="text-success">Uploaded: {userData.kycDocuments.addressProof}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <button type="submit" className="btn btn-primary">Submit KYC Documents</button>
                  </form>
                  <div className="alert alert-warning mt-3">
                    <small>
                      <strong>Note:</strong> Please ensure that the documents are clear and all details are visible.
                      Verification may take up to 24-48 hours after submission.
                    </small>
                  </div>
                </div>
              )}


              {/* Activate Card Tab - Updated with Redux */}
              {activeTab === "activate" && (
                <div>
                  <h4 className="mb-4">Activate Card</h4>

                  {/* Show current card status if available */}
                  {currentCard && (
                    <div className="alert alert-info mb-4">
                      <h6>Card Status:</h6>
                      <p>
                        <strong>Barcode:</strong> {currentCard.barcode}
                      </p>
                      <p>
                        <strong>Status:</strong>
                        <span
                          className={`badge ms-2 ${currentCard.status === "active"
                            ? "bg-success"
                            : currentCard.status === "sold"
                              ? "bg-warning"
                              : "bg-secondary"
                            }`}
                        >
                          {currentCard.status}
                        </span>
                      </p>
                      {currentCard.msisdn && (
                        <p>
                          <strong>MSISDN:</strong> {currentCard.msisdn}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Error display */}
                  {cardError && (
                    <div className="alert alert-danger mb-3">
                      {cardError.message || cardError}
                    </div>
                  )}

                  <div className="mb-3">
                    <label htmlFor="barcode" className="form-label">
                      Barcode Number
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="barcode"
                      value={barcode}
                      onChange={handleBarcodeChange}
                      placeholder="Enter your card's barcode number"
                      disabled={cardLoading || activationSuccess}
                    />
                  </div>

                  {/* Step 1: Checkout Complete */}
                  {/* Step 1: Checkout Complete */}
                  {(!currentCard ||
                    (currentCard && currentCard.status !== "sold")) &&
                    !otpSent &&
                    !activationSuccess && (
                      <button
                        className="btn btn-primary mb-3"
                        disabled={!barcode || barcode.length < 8 || cardLoading}
                        onClick={handleCheckoutComplete}
                      >
                        {cardLoading ? "Processing..." : "Complete Checkout"}
                      </button>
                    )}

                  {/* Step 2: Request OTP */}
                  {currentCard &&
                    currentCard.status === "sold" &&
                    !otpSent &&
                    !activationSuccess && (
                      <button
                        className="btn btn-primary mb-3"
                        disabled={cardLoading}
                        onClick={handleRequestOtp}
                      >
                        {cardLoading ? "Sending..." : "Send OTP"}
                      </button>
                    )}
                  {/* Step 3: Enter OTP and Activate */}
                  {otpSent && !activationSuccess && (
                    <>
                      <div className="mb-3">
                        <label htmlFor="otp" className="form-label">
                          Enter 6-digit OTP
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="otp"
                          value={otp}
                          onChange={handleOtpChange}
                          maxLength={6}
                          placeholder="Enter OTP"
                          disabled={cardLoading}
                        />
                      </div>
                      <button
                        className="btn btn-success"
                        disabled={otp.length !== 6 || cardLoading}
                        onClick={handleActivateCard}
                      >
                        {cardLoading ? "Activating..." : "Verify & Activate"}
                      </button>
                    </>
                  )}

                  {/* Success message */}
                  {activationSuccess && (
                    <div className="alert alert-success mt-4" role="alert">
                      <h5>Card Activated Successfully!</h5>
                      {/* {currentCard && (
                        <div>
                          <p><strong>Barcode:</strong> {currentCard.barcode}</p>
                          <p><strong>MSISDN:</strong> {currentCard.msisdn}</p>
                          <p><strong>Status:</strong> {currentCard.status}</p>
                        </div>
                      )} */}
                    </div>
                  )}

                  {/* Reset button */}
                  {/* {(otpSent || activationSuccess) && (
                            <button
                              className="btn btn-outline-secondary mt-3"
                              onClick={() => {
                                setBarcode("");
                                setOtp("");
                                dispatch(clearCardState());
                              }}
                            >
                              Start Over
                            </button>
                          )} */}
                </div>
              )}
              {/* Order History Tab */}
              {activeTab === "orders" && (
                <div>
                  <h4 className="mb-4">Order History</h4>

                  {ordersLoading && (
                    <div className="alert alert-info mb-3">
                      Loading your orders...
                    </div>
                  )}

                  {ordersError && (
                    <div className="alert alert-danger mb-3">
                      {ordersError.message || ordersError}
                    </div>
                  )}

                  {myOrders && myOrders.length > 0 ? (
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead className="table-light">
                          <tr>
                            <th>Order ID</th>
                            <th>Date</th>
                            <th>Product</th>
                            <th>Plan</th>
                            <th>Amount</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {myOrders.map((order) => (
                            <tr key={order._id}>
                              <td>
                                <strong>
                                  {order.orderNumber || order._id}
                                </strong>
                              </td>
                              <td>
                                {new Date(order.createdAt).toLocaleDateString()}
                              </td>
                              <td>
                                {order.checkout &&
                                  order.checkout.items &&
                                  order.checkout.items.length > 0
                                  ? order.checkout.items
                                    .map((item) => item.productId)
                                    .join(", ")
                                  : "-"}
                              </td>
                              <td>
                                {order.shippingAddress
                                  ? order.shippingAddress.label ||
                                  order.shippingAddress._id
                                  : "-"}
                              </td>
                              <td>₹{order.total || order.amount || "-"}</td>
                              <td>
                                <span
                                  className={`badge ${order.status === "delivered"
                                    ? "bg-success"
                                    : order.status === "processing"
                                      ? "bg-warning"
                                      : "bg-primary"
                                    }`}
                                >
                                  {order.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    !ordersLoading && (
                      <div className="text-center py-5">
                        <FaHistory className="text-muted mb-3" size={40} />
                        <h5>No Orders Yet</h5>
                        <p className="text-muted">
                          You haven't placed any orders yet.
                        </p>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
