import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner, ListGroup } from 'react-bootstrap';
import { useLocation, useNavigate, Link, Form } from 'react-router-dom';
import { FaCheckCircle, FaDownload, FaCalendarAlt } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import cartService from '../../services/cartService';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { paymentResult, orderDetails } = location.state || {};
  
  // State for delivery slot selection
  const [deliverySlots, setDeliverySlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [slotLoading, setSlotLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get auth state from Redux
  const { isAuthenticated } = useSelector(state => state.auth);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // Redirect to home if no order details
    if (!paymentResult || !orderDetails) {
      toast.error('Order details not found');
      navigate('/');
      return;
    }
    
    // Fetch delivery slots
    const fetchDeliverySlots = async () => {
      try {
        setSlotLoading(true);
        const slots = await cartService.getDeliverySlots(orderDetails.orderId);
        setDeliverySlots(slots);
        if (slots.length > 0) {
          setSelectedSlot(slots[0].id);
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch delivery slots');
        toast.error(err.message || 'Failed to fetch delivery slots');
      } finally {
        setSlotLoading(false);
      }
    };
    
    fetchDeliverySlots();
  }, [isAuthenticated, paymentResult, orderDetails, navigate]);
  
  // Handle download invoice
  const handleDownloadInvoice = async () => {
    try {
      setLoading(true);
      await cartService.generateInvoice(orderDetails.orderId);
      toast.success('Invoice downloaded successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to download invoice');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle delivery slot selection
  const handleSlotSelection = async () => {
    if (!selectedSlot) {
      toast.error('Please select a delivery slot');
      return;
    }
    
    try {
      setLoading(true);
      await cartService.updateDeliverySlot(orderDetails.orderId, selectedSlot);
      toast.success('Delivery slot updated successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to update delivery slot');
    } finally {
      setLoading(false);
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  if (!paymentResult || !orderDetails) {
    return (
      <Container className="py-4">
        <Alert variant="danger">
          Order details not found. Please return to home.
          <Button 
            variant="primary" 
            className="ms-3"
            onClick={() => navigate('/')}
          >
            Return to Home
          </Button>
        </Alert>
      </Container>
    );
  }
  
  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="text-center">
            <FaCheckCircle className="text-success" size={50} />
            <h1 className="mt-3">Order Confirmed!</h1>
            <p className="lead">Thank you for your purchase. Your order has been successfully placed.</p>
          </div>
        </Col>
      </Row>
      
      <Row>
        <Col lg={8}>
          <Card className="mb-4 shadow-sm">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Order Details</h5>
            </Card.Header>
            <Card.Body>
              <Row className="mb-3">
                <Col md={6}>
                  <p className="mb-1"><strong>Order ID:</strong> {orderDetails.orderId}</p>
                  <p className="mb-1"><strong>Order Date:</strong> {formatDate(paymentResult.date)}</p>
                  <p className="mb-1"><strong>Payment Method:</strong> {orderDetails.paymentMethod === 'emi' ? 'EMI' : 'Full Payment'}</p>
                </Col>
                <Col md={6}>
                  <p className="mb-1"><strong>Transaction ID:</strong> {paymentResult.transactionId}</p>
                  <p className="mb-1"><strong>Amount Paid:</strong> ₹{paymentResult.amount.toFixed(2)}</p>
                  {orderDetails.paymentMethod === 'emi' && (
                    <p className="mb-1"><strong>EMI Duration:</strong> {orderDetails.emiDetails.duration} months</p>
                  )}
                </Col>
              </Row>
              
              <hr />
              
              <h6>Delivery Address</h6>
              <p className="mb-1">{orderDetails.address.name}</p>
              <p className="mb-1">{orderDetails.address.addressLine1}</p>
              {orderDetails.address.addressLine2 && <p className="mb-1">{orderDetails.address.addressLine2}</p>}
              <p className="mb-1">{orderDetails.address.city}, {orderDetails.address.state} {orderDetails.address.pincode}</p>
              <p className="mb-1">{orderDetails.address.phone}</p>
              
              <hr />
              
              <h6>Items</h6>
              <ListGroup variant="flush">
                {orderDetails.items && orderDetails.items.map((item, index) => (
                  <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-0">{item.name}</h6>
                      <small className="text-muted">{item.plan} {item.addons && `+ ${item.addons.length} add-ons`}</small>
                    </div>
                    <div className="text-end">
                      <p className="mb-0">₹{item.price.toFixed(2)} x {item.quantity}</p>
                      <strong>₹{item.totalPrice.toFixed(2)}</strong>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
          
          <Card className="shadow-sm">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Delivery Slot Selection</h5>
            </Card.Header>
            <Card.Body>
              {slotLoading ? (
                <div className="text-center my-3">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-2">Loading delivery slots...</p>
                </div>
              ) : error ? (
                <Alert variant="danger">{error}</Alert>
              ) : deliverySlots.length === 0 ? (
                <Alert variant="info">No delivery slots available at the moment. We'll contact you to schedule delivery.</Alert>
              ) : (
                <>
                  <p>Please select your preferred delivery slot:</p>
                  <Form>
                    {deliverySlots.map((slot) => (
                      <div key={slot.id} className="mb-3">
                        <Form.Check
                          type="radio"
                          id={`slot-${slot.id}`}
                          name="deliverySlot"
                          label={
                            <>
                              <FaCalendarAlt className="me-2" />
                              {formatDate(slot.startTime)} - {formatDate(slot.endTime)}
                            </>
                          }
                          checked={selectedSlot === slot.id}
                          onChange={() => setSelectedSlot(slot.id)}
                        />
                      </div>
                    ))}
                  </Form>
                  
                  <Button 
                    variant="primary" 
                    onClick={handleSlotSelection}
                    disabled={loading || !selectedSlot}
                  >
                    {loading ? (
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
                    ) : 'Confirm Delivery Slot'}
                  </Button>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={4}>
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Order Summary</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>₹{paymentResult.amount.toFixed(2)}</span>
              </div>
              
              {orderDetails.paymentMethod === 'emi' && (
                <>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Processing Fee:</span>
                    <span>₹{orderDetails.emiDetails.processingFee.toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Advance Payment:</span>
                    <span>₹{orderDetails.emiDetails.advancePayment.toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Remaining Amount:</span>
                    <span>₹{orderDetails.emiDetails.remainingAmount.toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Monthly Installment:</span>
                    <span>₹{orderDetails.emiDetails.monthlyInstallment.toFixed(2)}</span>
                  </div>
                </>
              )}
              
              <hr />
              
              <div className="d-flex justify-content-between">
                <span><strong>Total Paid:</strong></span>
                <span><strong>₹{paymentResult.amount.toFixed(2)}</strong></span>
              </div>
              
              {orderDetails.paymentMethod === 'emi' && (
                <div className="mt-2 text-muted">
                  <small>* Remaining amount will be collected in {orderDetails.emiDetails.duration} monthly installments</small>
                </div>
              )}
            </Card.Body>
          </Card>
          
          <div className="d-grid gap-2">
            <Button 
              variant="outline-primary" 
              onClick={handleDownloadInvoice}
              disabled={loading}
            >
              <FaDownload className="me-2" />
              {loading ? 'Downloading...' : 'Download Invoice'}
            </Button>
            
            <Link to="/profile/orders" className="btn btn-outline-secondary">
              View All Orders
            </Link>
            
            <Link to="/" className="btn btn-primary">
              Continue Shopping
            </Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default OrderConfirmation;