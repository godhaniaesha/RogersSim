import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCreditCard, FaLock, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get payment details from location state
  const paymentDetails = location.state || {
    paymentMethod: 'full',
    amount: 547,
    emiDetails: null
  };
  
  // States
  const [paymentStatus, setPaymentStatus] = useState('pending'); // pending, processing, success, failed
  const [orderId, setOrderId] = useState('');
  
  // Card validation schema
  const cardSchema = Yup.object().shape({
    cardNumber: Yup.string()
      .required('Card number is required')
      .matches(/^[0-9]{16}$/, 'Card number must be 16 digits'),
    cardName: Yup.string().required('Name on card is required'),
    expiryMonth: Yup.string().required('Expiry month is required'),
    expiryYear: Yup.string().required('Expiry year is required'),
    cvv: Yup.string()
      .required('CVV is required')
      .matches(/^[0-9]{3,4}$/, 'CVV must be 3 or 4 digits')
  });
  
  // Generate months and years for expiry date
  const months = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    return { value: month.toString().padStart(2, '0'), label: month.toString().padStart(2, '0') };
  });
  
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => {
    const year = currentYear + i;
    return { value: year.toString(), label: year.toString() };
  });
  
  // Process payment
  const processPayment = (values) => {
    setPaymentStatus('processing');
    
    // Simulate payment processing
    setTimeout(() => {
      // Generate random order ID
      const newOrderId = 'ORD' + Math.floor(100000 + Math.random() * 900000);
      setOrderId(newOrderId);
      setPaymentStatus('success');
      
      // In a real app, this would call an API to process payment
      console.log('Payment processed:', {
        ...values,
        amount: paymentDetails.amount,
        paymentMethod: paymentDetails.paymentMethod,
        emiDetails: paymentDetails.emiDetails,
        orderId: newOrderId
      });
    }, 2000);
  };
  
  // Navigate to order confirmation after successful payment
  useEffect(() => {
    if (paymentStatus === 'success' && orderId) {
      const timer = setTimeout(() => {
        navigate('/order-confirmation', { 
          state: { 
            orderId,
            amount: paymentDetails.amount,
            paymentMethod: paymentDetails.paymentMethod,
            emiDetails: paymentDetails.emiDetails
          } 
        });
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [paymentStatus, orderId, navigate, paymentDetails]);
  
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          {paymentStatus === 'pending' || paymentStatus === 'processing' ? (
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white py-3">
                <h4 className="mb-0 d-flex align-items-center">
                  <FaCreditCard className="me-2" /> Payment
                </h4>
              </div>
              <div className="card-body">
                <div className="alert alert-info d-flex align-items-center" role="alert">
                  <FaLock className="me-2" />
                  <div>
                    <strong>Secure Payment:</strong> Your payment information is encrypted and secure.
                  </div>
                </div>
                
                <div className="mb-4">
                  <h5>Payment Summary</h5>
                  <div className="card bg-light border-0">
                    <div className="card-body">
                      <div className="d-flex justify-content-between mb-2">
                        <span>Payment Type:</span>
                        <span>{paymentDetails.paymentMethod === 'full' ? 'Full Payment' : 'EMI Payment (Advance)'}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Amount:</span>
                        <span className="fw-bold">₹{paymentDetails.amount}</span>
                      </div>
                      {paymentDetails.emiDetails && (
                        <div className="d-flex justify-content-between">
                          <span>EMI Plan:</span>
                          <span>₹{paymentDetails.emiDetails.emiPerMonth} x {paymentDetails.emiDetails.totalMonths} months</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {paymentStatus === 'processing' ? (
                  <div className="text-center py-5">
                    <FaSpinner className="fa-spin text-primary mb-3" size={40} />
                    <h4>Processing Payment</h4>
                    <p className="text-muted">Please wait while we process your payment...</p>
                  </div>
                ) : (
                  <Formik
                    initialValues={{
                      cardNumber: '',
                      cardName: '',
                      expiryMonth: '',
                      expiryYear: '',
                      cvv: ''
                    }}
                    validationSchema={cardSchema}
                    onSubmit={processPayment}
                  >
                    {({ isSubmitting }) => (
                      <Form>
                        <div className="mb-3">
                          <label htmlFor="cardNumber" className="form-label">Card Number</label>
                          <Field 
                            name="cardNumber" 
                            type="text" 
                            className="form-control" 
                            placeholder="1234 5678 9012 3456" 
                            maxLength="16"
                          />
                          <ErrorMessage name="cardNumber" component="div" className="text-danger small" />
                        </div>
                        
                        <div className="mb-3">
                          <label htmlFor="cardName" className="form-label">Name on Card</label>
                          <Field 
                            name="cardName" 
                            type="text" 
                            className="form-control" 
                            placeholder="John Doe"
                          />
                          <ErrorMessage name="cardName" component="div" className="text-danger small" />
                        </div>
                        
                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <label className="form-label">Expiry Date</label>
                            <div className="d-flex gap-2">
                              <div className="flex-grow-1">
                                <Field name="expiryMonth" as="select" className="form-select">
                                  <option value="">Month</option>
                                  {months.map(month => (
                                    <option key={month.value} value={month.value}>{month.label}</option>
                                  ))}
                                </Field>
                                <ErrorMessage name="expiryMonth" component="div" className="text-danger small" />
                              </div>
                              <div className="flex-grow-1">
                                <Field name="expiryYear" as="select" className="form-select">
                                  <option value="">Year</option>
                                  {years.map(year => (
                                    <option key={year.value} value={year.value}>{year.label}</option>
                                  ))}
                                </Field>
                                <ErrorMessage name="expiryYear" component="div" className="text-danger small" />
                              </div>
                            </div>
                          </div>
                          
                          <div className="col-md-6 mb-3">
                            <label htmlFor="cvv" className="form-label">CVV</label>
                            <Field 
                              name="cvv" 
                              type="password" 
                              className="form-control" 
                              placeholder="123" 
                              maxLength="4"
                            />
                            <ErrorMessage name="cvv" component="div" className="text-danger small" />
                          </div>
                        </div>
                        
                        <button 
                          type="submit" 
                          className="btn btn-primary w-100 py-2 mt-3" 
                          disabled={isSubmitting}
                        >
                          Pay ₹{paymentDetails.amount}
                        </button>
                      </Form>
                    )}
                  </Formik>
                )}
              </div>
            </div>
          ) : paymentStatus === 'success' ? (
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center py-5">
                <FaCheckCircle className="text-success mb-3" size={60} />
                <h2>Payment Successful!</h2>
                <p className="text-muted mb-4">Your payment has been processed successfully.</p>
                <div className="mb-4">
                  <h5>Order ID: {orderId}</h5>
                  <p className="text-muted">Redirecting to order confirmation...</p>
                </div>
                <div className="spinner-border spinner-border-sm text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center py-5">
                <div className="text-danger mb-3" style={{ fontSize: '60px' }}>✕</div>
                <h2>Payment Failed</h2>
                <p className="text-muted mb-4">There was an issue processing your payment. Please try again.</p>
                <button 
                  className="btn btn-primary" 
                  onClick={() => setPaymentStatus('pending')}
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payment;