import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { loginStart, loginSuccess, loginFailure, clearError, loginUser, sendOtp, verifyOtp, resetPassword } from "../../store/slices/authSlice";
import authService from "../../services/authService";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import '../../style/theme.css';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, isAuthenticated } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [showConfirmPasswordField, setShowConfirmPasswordField] = useState(false);

  const [mobileNumber, setMobileNumber] = useState("");

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const loginSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Email is required"),
    password: Yup.string().required("Password is required").min(8, "Password must be at least 8 characters"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const resultAction = await dispatch(loginUser(values));

      if (loginUser.fulfilled.match(resultAction)) {
        console.log("Login success:", resultAction.payload);
        toast.success("Login successful!");
        navigate("/");
      } else {
        console.log("Login error:", resultAction.payload);
        toast.error(resultAction.payload || "Login failed");
      }
    } catch (error) {
      toast.error(error.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  // Forgot Password → Mobile OTP
  const handleForgotSubmit = async (values, { setSubmitting }) => {
    try {
      // ⬇️ dispatch karo
      await dispatch(sendOtp(values.mobile)).unwrap();

      toast.success(`OTP sent to ${values.mobile}`);
      setMobileNumber(values.mobile);
      setShowForgotModal(false);
      setShowOtpModal(true); // show OTP modal
    } catch (error) {
      toast.error(error.message || "Failed to send OTP");
    } finally {
      setSubmitting(false);
    }
  };


  // OTP verification
  const otpSchema = Yup.object({
    otp: Yup.string().matches(/^[0-9]{6}$/, "OTP must be 6 digits").required("OTP is required"),
  });

  const handleOtpSubmit = async (values, { setSubmitting }) => {
    try {
      // ⬇️ dispatch karo
      await dispatch(verifyOtp({ mobile: mobileNumber, otp: values.otp })).unwrap();

      toast.success("OTP verified! You can now reset your password.");
      setShowOtpModal(false);
      setShowResetModal(true); // show reset password modal
    } catch (error) {
      toast.error(error.message || "Invalid OTP");
    } finally {
      setSubmitting(false);
    }
  };

  // Reset Password
  const resetSchema = Yup.object({
    password: Yup.string().required("Password is required").min(8, "Password must be at least 8 characters"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const handleResetSubmit = async (values, { setSubmitting }) => {
    try {
      await dispatch(resetPassword({
        newPassword: values.password,   // ✅ backend expects newPassword
        confirmPassword: values.confirmPassword
      }));

      toast.success("Password reset successful!");
      setShowResetModal(false);
      navigate("/login"); // redirect to login after reset
    } catch (error) {
      toast.error(error.message || "Failed to reset password");
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <div className="container py-5">
      {/* Login Form */}
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card border-0 shadow">
            <div className="card-body p-4 p-md-5">
              <h2 className="text-center mb-4 fw-bold" style={{ color: "#ac2020" }}>Login to Rogers</h2>

              <Formik initialValues={{ email: "", password: "" }} validationSchema={loginSchema} onSubmit={handleSubmit}>
                {({ isSubmitting }) => (
                  <Form>
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">Email Address</label>
                      <Field type="email" name="email" className="form-control" placeholder="Enter your email" />
                      <ErrorMessage name="email" component="div" className="text-danger mt-1 small" />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">Password</label>
                      <div className="input-group">
                        <Field type={showPassword ? "text" : "password"} name="password" className="form-control" placeholder="Enter your password" />
                        <button type="button" className="btn btn-outline-danger" onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                      <ErrorMessage name="password" component="div" className="text-danger mt-1 small" />
                    </div>

                    <div className="text-end mt-2">
                      <button type="button" className="btn btn-link p-0" style={{ color: '#e70000' }} onClick={() => setShowForgotModal(true)}>
                        Forgot Password?
                      </button>
                    </div>

                    <div className="d-grid mt-4">
                      <button type="submit" className="btn btn-primary btn-lg" disabled={isSubmitting || loading}>
                        {isSubmitting || loading ? "Logging in..." : "Login"}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>

              <div className="text-center mt-4">
                <p className="mb-0">
                  Don't have an account?{" "}
                  <Link to="/signup" style={{ color: '#e70000' }}>Sign Up</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setShowForgotModal(false)}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content p-4" onClick={(e) => e.stopPropagation()}>
              <h5 className="modal-title mb-3">Forgot Password</h5>
              <Formik initialValues={{ mobile: "" }} validationSchema={Yup.object({
                mobile: Yup.string().matches(/^[0-9]{10}$/, "Mobile number must be 10 digits").required("Mobile number is required"),
              })} onSubmit={handleForgotSubmit}>
                {({ isSubmitting }) => (
                  <Form>
                    <div className="mb-3">
                      <label htmlFor="mobile" className="form-label">Mobile Number</label>
                      <div className="input-group">
                        <span className="input-group-text">+91</span>
                        <Field type="text" name="mobile" className="form-control" placeholder="Enter 10-digit mobile number" />
                      </div>
                      <ErrorMessage name="mobile" component="div" className="text-danger mt-1 small" />
                    </div>
                    <div className="d-flex justify-content-end">
                      <button type="button" className="btn x_btn_can me-2" onClick={() => setShowForgotModal(false)}>Cancel</button>
                      <button type="submit" className="btn btn-primary" disabled={isSubmitting}>{isSubmitting ? "Sending..." : "Send OTP"}</button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      )}

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setShowOtpModal(false)}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content p-4" onClick={(e) => e.stopPropagation()}>
              <h5 className="modal-title mb-3">Verify OTP</h5>
              <Formik initialValues={{ otp: "" }} validationSchema={otpSchema} onSubmit={handleOtpSubmit}>
                {({ isSubmitting }) => (
                  <Form>
                    <div className="mb-3">
                      <label htmlFor="otp" className="form-label">Enter OTP sent to +91 {mobileNumber}</label>
                      <Field type="text" name="otp" className="form-control" placeholder="Enter 6-digit OTP" />
                      <ErrorMessage name="otp" component="div" className="text-danger mt-1 small" />
                    </div>
                    <div className="d-flex justify-content-end">
                      <button type="button" className="btn x_btn_can me-2" onClick={() => setShowOtpModal(false)}>Cancel</button>
                      <button type="submit" className="btn btn-primary" disabled={isSubmitting}>{isSubmitting ? "Verifying..." : "Verify OTP"}</button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showResetModal && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setShowResetModal(false)}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content p-4" onClick={(e) => e.stopPropagation()}>
              <h5 className="modal-title mb-3">Reset Password</h5>

              <Formik
                initialValues={{ password: "", confirmPassword: "" }}
                validationSchema={resetSchema}
                onSubmit={handleResetSubmit}
              >
                {({ isSubmitting }) => (
                  <Form>
                    {/* New Password */}
                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">New Password</label>
                      <div className="input-group">
                        <Field
                          type={showPasswordField ? "text" : "password"}
                          name="password"
                          className="form-control"
                          placeholder="Enter new password"
                        />
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => setShowPasswordField(!showPasswordField)}
                        >
                          {showPasswordField ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                      <ErrorMessage name="password" component="div" className="text-danger mt-1 small" />
                    </div>

                    {/* Confirm Password */}
                    <div className="mb-3">
                      <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                      <div className="input-group">
                        <Field
                          type={showConfirmPasswordField ? "text" : "password"}
                          name="confirmPassword"
                          className="form-control"
                          placeholder="Confirm new password"
                        />
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => setShowConfirmPasswordField(!showConfirmPasswordField)}
                        >
                          {showConfirmPasswordField ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                      <ErrorMessage name="confirmPassword" component="div" className="text-danger mt-1 small" />
                    </div>

                    <div className="d-flex justify-content-end">
                      <button type="button" className="btn x_btn_can me-2" onClick={() => setShowResetModal(false)}>Cancel</button>
                      <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                        {isSubmitting ? "Resetting..." : "Reset Password"}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;