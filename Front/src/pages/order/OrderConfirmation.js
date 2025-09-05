import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FaCheckCircle, FaDownload, FaEnvelope, FaMobile, FaCalendarAlt } from 'react-icons/fa';

const OrderConfirmation = () => {
  const location = useLocation();
  
  // Get order details from location state
  const orderDetails = location.state || {
    orderId: 'ORD123456',
    amount: 547,
    paymentMethod: 'full',
    emiDetails: null
  };
  
  // States
  const [deliverySlot, setDeliverySlot] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [smsSent, setSmsSent] = useState(false);
  
  // Available delivery slots
  const deliverySlots = [
    { id: 1, date: '2023-09-15', time: '09:00 AM - 12:00 PM' },
    { id: 2, date: '2023-09-15', time: '12:00 PM - 03:00 PM' },
    { id: 3, date: '2023-09-15', time: '03:00 PM - 06:00 PM' },
    { id: 4, date: '2023-09-16', time: '09:00 AM - 12:00 PM' },
    { id: 5, date: '2023-09-16', time: '12:00 PM - 03:00 PM' },
    { id: 6, date: '2023-09-16', time: '03:00 PM - 06:00 PM' },
  ];
  
  // Handle delivery slot selection
  const handleSlotSelect = (slotId) => {
    setDeliverySlot(slotId);
  };
  
  // Send confirmation email
  const sendEmail = () => {
    // In a real app, this would call an API to send email
    console.log('Sending confirmation email...');
    setEmailSent(true);
  };
  
  // Send confirmation SMS
  const sendSMS = () => {
    // In a real app, this would call an API to send SMS
    console.log('Sending confirmation SMS...');
    setSmsSent(true);
  };
  
  // Download invoice
  const downloadInvoice = () => {
    // In a real app, this would generate and download a PDF invoice
    console.log('Downloading invoice...');
    alert('Invoice download would start here');
  };
  
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body text-center py-5">
              <FaCheckCircle className="text-success mb-3" size={60} />
              <h1>Order Confirmed!</h1>
              <p className="lead mb-4">Thank you for your order. Your SIM card will be delivered soon.</p>
              <div className="d-flex justify-content-center">
                <div className="badge bg-primary p-2 px-3 fs-6">Order ID: {orderDetails.orderId}</div>
              </div>
            </div>
          </div>
          
          <div className="row mb-4">
            <div className="col-md-6 mb-4 mb-md-0">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-header bg-white py-3">
                  <h4 className="mb-0">Payment Details</h4>
                </div>
                <div className="card-body">
                  <div className="d-flex justify-content-between mb-2">
                    <span>Payment Method:</span>
                    <span>{orderDetails.paymentMethod === 'full' ? 'Full Payment' : 'EMI Payment'}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Amount Paid:</span>
                    <span className="fw-bold">₹{orderDetails.amount}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Payment Status:</span>
                    <span className="text-success">Completed</span>
                  </div>
                  
                  {orderDetails.paymentMethod === 'emi' && orderDetails.emiDetails && (
                    <div className="mt-3 pt-3 border-top">
                      <h6>EMI Details</h6>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Total Amount:</span>
                        <span>₹{orderDetails.emiDetails.finalPrice}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Advance Paid:</span>
                        <span>₹{orderDetails.emiDetails.advance}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Monthly EMI:</span>
                        <span>₹{orderDetails.emiDetails.emiPerMonth}</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span>Duration:</span>
                        <span>{orderDetails.emiDetails.totalMonths} months</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-3">
                    <button 
                      className="btn btn-outline-primary w-100" 
                      onClick={downloadInvoice}
                    >
                      <FaDownload className="me-2" /> Download Invoice
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-header bg-white py-3">
                  <h4 className="mb-0">Delivery Information</h4>
                </div>
                <div className="card-body">
                  <p className="mb-3">Please select a preferred delivery slot for your SIM card:</p>
                  
                  <div className="mb-3">
                    {deliverySlots.map(slot => (
                      <div 
                        key={slot.id} 
                        className={`card mb-2 ${deliverySlot === slot.id ? 'border-primary' : 'border-light'}`}
                        onClick={() => handleSlotSelect(slot.id)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="card-body py-2 px-3">
                          <div className="d-flex align-items-center">
                            <div className="form-check">
                              <input 
                                className="form-check-input" 
                                type="radio" 
                                name="deliverySlot" 
                                id={`slot-${slot.id}`}
                                checked={deliverySlot === slot.id}
                                onChange={() => handleSlotSelect(slot.id)}
                              />
                              <label className="form-check-label" htmlFor={`slot-${slot.id}`}>
                                <div className="d-flex align-items-center">
                                  <FaCalendarAlt className="text-primary me-2" />
                                  <div>
                                    <div>{new Date(slot.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</div>
                                    <div className="small text-muted">{slot.time}</div>
                                  </div>
                                </div>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="alert alert-info small">
                    <strong>Note:</strong> Our delivery partner will call you before delivery.
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white py-3">
              <h4 className="mb-0">Get Confirmation</h4>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 mb-3 mb-md-0">
                  <div className="card h-100">
                    <div className="card-body text-center py-4">
                      <FaEnvelope className="text-primary mb-3" size={30} />
                      <h5>Email Confirmation</h5>
                      <p className="text-muted small mb-3">Get your order details and invoice via email</p>
                      <button 
                        className="btn btn-primary w-100" 
                        onClick={sendEmail}
                        disabled={emailSent}
                      >
                        {emailSent ? 'Email Sent' : 'Send Email'}
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="card h-100">
                    <div className="card-body text-center py-4">
                      <FaMobile className="text-primary mb-3" size={30} />
                      <h5>SMS Confirmation</h5>
                      <p className="text-muted small mb-3">Get your order details via SMS on your mobile</p>
                      <button 
                        className="btn btn-primary w-100" 
                        onClick={sendSMS}
                        disabled={smsSent}
                      >
                        {smsSent ? 'SMS Sent' : 'Send SMS'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <Link to="/" className="btn btn-lg btn-primary">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;