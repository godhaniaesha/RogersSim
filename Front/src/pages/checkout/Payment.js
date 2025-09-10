import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCreditCard, FaLock } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import cartService from '../../services/cartService';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const paymentDetails = location.state;
  
  // State for payment form
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [processing, setProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Get auth state from Redux
  const { isAuthenticated } = useSelector(state => state.auth);
  
  // Redirect to login if not authenticated
  useEffect(() => {
  //   if (!isAuthenticated) {
  //     navigate('/login');
  //   }
    
    // Redirect to checkout if no payment details
    if (!paymentDetails) {
      toast.error('Payment details not found');
      navigate('/checkout');
    }
  }, [isAuthenticated, paymentDetails, navigate]);
  
  // Format card number with spaces
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };
  
  // Format expiry date
  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (v.length >= 3) {
      return `${v.substring(0, 2)}/${v.substring(2)}`;
    }
    
    return value;
  };
  
  // Handle payment submission
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setPaymentError('');
    
    // Validate card details
    if (cardNumber.replace(/\s/g, '').length !== 16) {
      setPaymentError('Invalid card number');
      setProcessing(false);
      return;
    }
    
    if (expiryDate.length !== 5) {
      setPaymentError('Invalid expiry date');
      setProcessing(false);
      return;
    }
    
    if (cvv.length !== 3) {
      setPaymentError('Invalid CVV');
      setProcessing(false);
      return;
    }
    
    try {
      // Process payment via API
      const paymentResult = await cartService.processPayment({
        orderId: paymentDetails.orderId,
        cardDetails: {
          cardNumber: cardNumber.replace(/\s/g, ''),
          cardName,
          expiryDate,
          cvv
        },
        amount: paymentDetails.amount,
        paymentMethod: paymentDetails.paymentMethod,
        emiDetails: paymentDetails.emiDetails
      });
      
      // Clear cart after successful payment
      await cartService.clearCart();
      
      // Navigate to order confirmation
      navigate('/order-confirmation', { 
        state: { 
          paymentResult,
          orderDetails: {
            orderId: paymentDetails.orderId,
            items: paymentDetails.items,
            address: paymentDetails.address,
            paymentMethod: paymentDetails.paymentMethod,
            emiDetails: paymentDetails.emiDetails
          }
        } 
      });
    } catch (err) {
      setPaymentError(err.message || 'Payment processing failed');
      toast.error(err.message || 'Payment processing failed');
      setProcessing(false);
    }
  };
  
  return (
    <Container className="py-4">
      <h1 className="mb-4">Payment</h1>
      
      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Loading payment details...</p>
        </div>
      ) : !paymentDetails ? (
        <Alert variant="danger">
          Payment details not found. Please return to checkout.
          <Button 
            variant="primary" 
            className="ms-3"
            onClick={() => navigate('/checkout')}
          >
            Return to Checkout
          </Button>
        </Alert>
      ) : (
        <Row>
          <Col md={8}>
            <Card className="mb-4 shadow-sm">
              <Card.Header className="bg-white">
                <h5 className="mb-0">Payment Details</h5>
              </Card.Header>
              <Card.Body>
                {paymentError && (
                  <Alert variant="danger">{paymentError}</Alert>
                )}
                
                <Form onSubmit={handlePaymentSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Card Number</Form.Label>
                    <Form.Control
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      required
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Cardholder Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="John Doe"
                      required
                    />
                  </Form.Group>
                  
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Expiry Date</Form.Label>
                        <Form.Control
                          type="text"
                          value={expiryDate}
                          onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                          placeholder="MM/YY"
                          maxLength={5}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>CVV</Form.Label>
                        <Form.Control
                          type="password"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, ''))}
                          placeholder="123"
                          maxLength={3}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <div className="d-grid gap-2">
                    <Button 
                      variant="primary" 
                      type="submit" 
                      disabled={processing}
                    >
                      {processing ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                          />
                          {' Processing...'}
                        </>
                      ) : (
                        <>Pay {paymentDetails.paymentMethod === 'emi' ? 
                          `₹${paymentDetails.emiDetails?.advancePayment.toFixed(2)} (Advance)` : 
                          `₹${paymentDetails.amount?.toFixed(2)}`
                        }</>
                      )}
                    </Button>
                  </div>
                </Form>
                
                <div className="mt-4 text-center text-muted">
                  <small>
                    <FaLock className="me-1" />
                    Your payment information is secure. We use encryption to protect your data.
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={4}>
            <Card className="shadow-sm">
              <Card.Header className="bg-white">
                <h5 className="mb-0">Order Summary</h5>
              </Card.Header>
              <Card.Body>
                <p><strong>Payment Method:</strong> {paymentDetails.paymentMethod === 'emi' ? 'EMI' : 'Full Payment'}</p>
                
                {paymentDetails.paymentMethod === 'emi' && paymentDetails.emiDetails && (
                  <div className="mb-3">
                    <h6>EMI Details</h6>
                    <p className="mb-1">Duration: {paymentDetails.emiDetails.duration} months</p>
                    <p className="mb-1">Processing Fee: ₹{paymentDetails.emiDetails.processingFee.toFixed(2)}</p>
                    <p className="mb-1">Advance Payment: ₹{paymentDetails.emiDetails.advancePayment.toFixed(2)}</p>
                    <p className="mb-1">Monthly Installment: ₹{paymentDetails.emiDetails.monthlyInstallment.toFixed(2)}</p>
                    <p className="mb-1">Total Payable: ₹{paymentDetails.emiDetails.totalPayable.toFixed(2)}</p>
                  </div>
                )}
                
                <hr />
                
                <div className="d-flex justify-content-between">
                  <span>Total Amount:</span>
                  <span className="fw-bold">
                    ₹{paymentDetails.paymentMethod === 'emi' ? 
                      paymentDetails.emiDetails?.advancePayment.toFixed(2) : 
                      paymentDetails.amount?.toFixed(2)
                    }
                  </span>
                </div>
                
                {paymentDetails.paymentMethod === 'emi' && (
                  <div className="mt-2 text-muted">
                    <small>* Remaining amount will be collected in {paymentDetails.emiDetails?.duration} monthly installments</small>
                  </div>
                )}
              </Card.Body>
            </Card>
            
            <Button 
              variant="outline-secondary" 
              className="mt-3 w-100"
              onClick={() => navigate('/checkout')}
            >
              Back to Checkout
            </Button>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Payment;