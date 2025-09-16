import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FaGoogle, FaEnvelope, FaMobile } from 'react-icons/fa';

const Login = () => {
  const [loginMethod, setLoginMethod] = useState('email'); // 'email', 'mobile', 'google'
  
  // Validation schemas for different login methods
  const emailSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters')
  });

  const mobileSchema = Yup.object({
    mobile: Yup.string()
      .matches(/^[0-9]{10}$/, 'Mobile number must be 10 digits')
      .required('Mobile number is required'),
    otp: Yup.string()
      .matches(/^[0-9]{6}$/, 'OTP must be 6 digits')
      .required('OTP is required')
  });

  // Handle form submission
  const handleSubmit = (values, { setSubmitting }) => {
    console.log('Login values:', values);
    // Here you would typically make an API call to authenticate the user
    setTimeout(() => {
      alert('Login successful!');
      setSubmitting(false);
    }, 1000);
  };

  // Handle Google login
  const handleGoogleLogin = () => {
    console.log('Google login clicked');
    // Implement Google OAuth login
    alert('Google login functionality will be implemented here');
  };

  // Handle OTP request
  const [otpSent, setOtpSent] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');

  const requestOtp = () => {
    if (mobileNumber.match(/^[0-9]{10}$/)) {
      console.log('Requesting OTP for:', mobileNumber);
      // Here you would make an API call to send OTP
      setOtpSent(true);
      alert(`OTP sent to ${mobileNumber}`);
    } else {
      alert('Please enter a valid 10-digit mobile number');
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4 p-md-5">
              <h2 className="text-center mb-4 fw-bold text-primary-custom">Login to Rogers</h2>
              
              {/* Login Method Tabs */}
              <div className="nav nav-pills nav-justified mb-4">
                <button 
                  className={`nav-link ${loginMethod === 'email' ? 'active bg-primary-custom' : ''}`}
                  onClick={() => setLoginMethod('email')}
                >
                  <FaEnvelope className="me-2" /> Email
                </button>
                <button 
                  className={`nav-link ${loginMethod === 'mobile' ? 'active bg-primary-custom' : ''}`}
                  onClick={() => setLoginMethod('mobile')}
                >
                  <FaMobile className="me-2" /> Mobile
                </button>
                <button 
                  className={`nav-link ${loginMethod === 'google' ? 'active bg-primary-custom' : ''}`}
                  onClick={() => setLoginMethod('google')}
                >
                  <FaGoogle className="me-2" /> Google
                </button>
              </div>

              {/* Email Login Form */}
              {loginMethod === 'email' && (
                <Formik
                  initialValues={{ email: '', password: '' }}
                  validationSchema={emailSchema}
                  onSubmit={handleSubmit}
                >
                  {({ isSubmitting }) => (
                    <Form>
                      <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email Address</label>
                        <Field 
                          type="email" 
                          name="email" 
                          className="form-control" 
                          placeholder="Enter your email"
                        />
                        <ErrorMessage name="email" component="div" className="text-danger mt-1 small" />
                      </div>
                      
                      <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <Field 
                          type="password" 
                          name="password" 
                          className="form-control" 
                          placeholder="Enter your password"
                        />
                        <ErrorMessage name="password" component="div" className="text-danger mt-1 small" />
                      </div>
                      
                      <div className="mb-3 form-check">
                        <Field type="checkbox" name="rememberMe" className="form-check-input" id="rememberMe" />
                        <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
                      </div>
                      
                      <div className="d-grid">
                        <button 
                          type="submit" 
                          className="btn btn-primary btn-lg" 
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? 'Logging in...' : 'Login'}
                        </button>
                      </div>
                      
                      <div className="text-center mt-3">
                        <Link to="/forgot-password" className="text-decoration-none">Forgot Password?</Link>
                      </div>
                    </Form>
                  )}
                </Formik>
              )}

              {/* Mobile OTP Login Form */}
              {loginMethod === 'mobile' && (
                <div>
                  {!otpSent ? (
                    <div>
                      <div className="mb-3">
                        <label htmlFor="mobile" className="form-label">Mobile Number</label>
                        <div className="input-group">
                          <span className="input-group-text">+91</span>
                          <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Enter 10-digit mobile number"
                            value={mobileNumber}
                            onChange={(e) => setMobileNumber(e.target.value)}
                          />
                        </div>
                        {mobileNumber && !mobileNumber.match(/^[0-9]{10}$/) && (
                          <div className="text-danger mt-1 small">Please enter a valid 10-digit mobile number</div>
                        )}
                      </div>
                      
                      <div className="d-grid">
                        <button 
                          type="button" 
                          className="btn btn-primary btn-lg" 
                          onClick={requestOtp}
                        >
                          Request OTP
                        </button>
                      </div>
                    </div>
                  ) : (
                    <Formik
                      initialValues={{ mobile: mobileNumber, otp: '' }}
                      validationSchema={mobileSchema}
                      onSubmit={handleSubmit}
                    >
                      {({ isSubmitting }) => (
                        <Form>
                          <div className="mb-3">
                            <label htmlFor="mobile" className="form-label">Mobile Number</label>
                            <div className="input-group">
                              <span className="input-group-text">+91</span>
                              <Field 
                                type="text" 
                                name="mobile" 
                                className="form-control" 
                                disabled
                              />
                            </div>
                            <ErrorMessage name="mobile" component="div" className="text-danger mt-1 small" />
                          </div>
                          
                          <div className="mb-3">
                            <label htmlFor="otp" className="form-label">One-Time Password</label>
                            <Field 
                              type="text" 
                              name="otp" 
                              className="form-control" 
                              placeholder="Enter 6-digit OTP"
                            />
                            <ErrorMessage name="otp" component="div" className="text-danger mt-1 small" />
                            <div className="d-flex justify-content-between mt-2">
                              <small className="text-muted">OTP sent to +91 {mobileNumber}</small>
                              <button 
                                type="button" 
                                className="btn btn-link p-0 small" 
                                onClick={requestOtp}
                              >
                                Resend OTP
                              </button>
                            </div>
                          </div>
                          
                          <div className="d-grid">
                            <button 
                              type="submit" 
                              className="btn btn-primary btn-lg" 
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? 'Verifying...' : 'Verify & Login'}
                            </button>
                          </div>
                          
                          <div className="text-center mt-3">
                            <button 
                              type="button" 
                              className="btn btn-link text-decoration-none p-0" 
                              onClick={() => setOtpSent(false)}
                            >
                              Change Mobile Number
                            </button>
                          </div>
                        </Form>
                      )}
                    </Formik>
                  )}
                </div>
              )}

              {/* Google Login Button */}
              {loginMethod === 'google' && (
                <div className="text-center py-3">
                  <p className="mb-4">Click the button below to login with your Google account</p>
                  <button 
                    type="button" 
                    className="btn btn-outline-dark btn-lg w-100" 
                    onClick={handleGoogleLogin}
                  >
                    <FaGoogle className="me-2" /> Login with Google
                  </button>
                </div>
              )}
              
              <div className="text-center mt-4">
                <p className="mb-0">Don't have an account? <Link to="/signup" className="text-primary-custom">Sign Up</Link></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;