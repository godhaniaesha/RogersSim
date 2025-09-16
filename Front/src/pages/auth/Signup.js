import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FaGoogle, FaEnvelope, FaMobile, FaArrowRight } from 'react-icons/fa';

const Signup = () => {
  const [signupMethod, setSignupMethod] = useState('email'); // 'email', 'mobile', 'google'
  const [step, setStep] = useState(1); // For multi-step signup process
  
  // Validation schemas for different signup methods
  const emailSchema = Yup.object({
    name: Yup.string()
      .required('Full name is required')
      .min(3, 'Name must be at least 3 characters'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      ),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm password is required'),
    termsAccepted: Yup.boolean()
      .oneOf([true], 'You must accept the terms and conditions')
  });

  const mobileSchema = Yup.object({
    name: Yup.string()
      .required('Full name is required')
      .min(3, 'Name must be at least 3 characters'),
    mobile: Yup.string()
      .matches(/^[0-9]{10}$/, 'Mobile number must be 10 digits')
      .required('Mobile number is required'),
    otp: Yup.string()
      .matches(/^[0-9]{6}$/, 'OTP must be 6 digits')
      .required('OTP is required'),
    termsAccepted: Yup.boolean()
      .oneOf([true], 'You must accept the terms and conditions')
  });

  // Handle form submission
  const handleSubmit = (values, { setSubmitting }) => {
    console.log('Signup values:', values);
    // Here you would typically make an API call to register the user
    setTimeout(() => {
      alert('Signup successful!');
      setSubmitting(false);
    }, 1000);
  };

  // Handle Google signup
  const handleGoogleSignup = () => {
    console.log('Google signup clicked');
    // Implement Google OAuth signup
    alert('Google signup functionality will be implemented here');
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
              <h2 className="text-center mb-4 fw-bold text-primary-custom">Create Account</h2>
              
              {/* Signup Method Tabs */}
              <div className="nav nav-pills nav-justified mb-4">
                <button 
                  className={`nav-link ${signupMethod === 'email' ? 'active bg-primary-custom' : ''}`}
                  onClick={() => setSignupMethod('email')}
                >
                  <FaEnvelope className="me-2" /> Email
                </button>
                <button 
                  className={`nav-link ${signupMethod === 'mobile' ? 'active bg-primary-custom' : ''}`}
                  onClick={() => setSignupMethod('mobile')}
                >
                  <FaMobile className="me-2" /> Mobile
                </button>
                <button 
                  className={`nav-link ${signupMethod === 'google' ? 'active bg-primary-custom' : ''}`}
                  onClick={() => setSignupMethod('google')}
                >
                  <FaGoogle className="me-2" /> Google
                </button>
              </div>

              {/* Email Signup Form */}
              {signupMethod === 'email' && (
                <Formik
                  initialValues={{ 
                    name: '', 
                    email: '', 
                    password: '', 
                    confirmPassword: '',
                    termsAccepted: false
                  }}
                  validationSchema={emailSchema}
                  onSubmit={handleSubmit}
                >
                  {({ isSubmitting }) => (
                    <Form>
                      <div className="mb-3">
                        <label htmlFor="name" className="form-label">Full Name</label>
                        <Field 
                          type="text" 
                          name="name" 
                          className="form-control" 
                          placeholder="Enter your full name"
                        />
                        <ErrorMessage name="name" component="div" className="text-danger mt-1 small" />
                      </div>
                      
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
                          placeholder="Create a password"
                        />
                        <ErrorMessage name="password" component="div" className="text-danger mt-1 small" />
                      </div>
                      
                      <div className="mb-3">
                        <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                        <Field 
                          type="password" 
                          name="confirmPassword" 
                          className="form-control" 
                          placeholder="Confirm your password"
                        />
                        <ErrorMessage name="confirmPassword" component="div" className="text-danger mt-1 small" />
                      </div>
                      
                      <div className="mb-3 form-check">
                        <Field type="checkbox" name="termsAccepted" className="form-check-input" id="termsAccepted" />
                        <label className="form-check-label" htmlFor="termsAccepted">
                          I agree to the <Link to="/terms" className="text-primary-custom">Terms & Conditions</Link>
                        </label>
                        <ErrorMessage name="termsAccepted" component="div" className="text-danger mt-1 small" />
                      </div>
                      
                      <div className="d-grid">
                        <button 
                          type="submit" 
                          className="btn btn-primary btn-lg" 
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? 'Creating Account...' : 'Create Account'}
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              )}

              {/* Mobile OTP Signup Form */}
              {signupMethod === 'mobile' && (
                <div>
                  {!otpSent ? (
                    <div>
                      <div className="mb-3">
                        <label htmlFor="name" className="form-label">Full Name</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder="Enter your full name"
                        />
                      </div>
                      
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
                      
                      <div className="mb-3 form-check">
                        <input type="checkbox" className="form-check-input" id="termsAcceptedMobile" />
                        <label className="form-check-label" htmlFor="termsAcceptedMobile">
                          I agree to the <Link to="/terms" className="text-primary-custom">Terms & Conditions</Link>
                        </label>
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
                      initialValues={{ 
                        name: '', 
                        mobile: mobileNumber, 
                        otp: '',
                        termsAccepted: true
                      }}
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
                              {isSubmitting ? 'Creating Account...' : 'Create Account'}
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

              {/* Google Signup Button */}
              {signupMethod === 'google' && (
                <div className="text-center py-3">
                  <p className="mb-4">Click the button below to sign up with your Google account</p>
                  <button 
                    type="button" 
                    className="btn btn-outline-dark btn-lg w-100" 
                    onClick={handleGoogleSignup}
                  >
                    <FaGoogle className="me-2" /> Sign up with Google
                  </button>
                </div>
              )}
              
              <div className="text-center mt-4">
                <p className="mb-0">Already have an account? <Link to="/login" className="text-primary-custom">Login</Link></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;