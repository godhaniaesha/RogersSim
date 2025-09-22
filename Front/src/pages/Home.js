import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllPlans, fetchPlanById } from '../store/slices/planSlice';
import { fetchUserProfile } from '../store/slices/userSlice';
import { FaArrowRight, FaMobileAlt, FaSimCard, FaWifi, FaCheckCircle } from 'react-icons/fa';
import { Modal, Button, Form } from 'react-bootstrap';
import { MdClose } from 'react-icons/md';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import { loadStripe } from '@stripe/stripe-js';
import AddBus from './AddBus';
import AdAbout from './AdAbout';
import ExplorB from './ExplorB';
import Hero from './Hero';
import NewHero from './NewHero';
import TestSlider from './TestSlider';
import '../style/theme.css'

// Initialize Stripe
const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_KEY ||
  "pk_test_51R8wmeQ0DPGsMRTSHTci2XmwYmaDLRqeSSRS2hNUCU3xU7ikSAvXzSI555Rxpyf9SsTIgI83PXvaaQE3pJAlkMaM00g9BdsrOB"
);

export default function Home() {
  // State for modals and payment
  const [show, setShow] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");

  // Mock data for banners
  const banners = [
    {
      id: 1,
      title: 'New SIM @ ₹199',
      description: 'Get started with our affordable prepaid plans',
      buttonText: 'Buy Now',
      buttonLink: '/products?type=prepaid',
      bgClass: 'bg-primary-custom'
    },
    {
      id: 2,
      title: 'Port-in Special Offer',
      description: 'Switch to Rogers and get 50% off on your first recharge',
      buttonText: 'Port Now',
      buttonLink: '/products?type=port',
      bgClass: 'bg-light-custom'
    },
    {
      id: 3,
      title: 'Unlimited Data Plans',
      description: 'Stream, browse, and game without limits',
      buttonText: 'Explore',
      buttonLink: '/products?type=unlimited',
      bgClass: 'bg-light-custom'
    }
  ];

  // Mock data for SIM categories
  const simCategories = [
    {
      id: 1,
      name: 'Prepaid',
      icon: <FaMobileAlt className="fs-1 mb-3 text-primary-custom" />,
      description: 'Pay as you go with flexible recharge options',
      link: '/products?type=prepaid'
    },
    {
      id: 2,
      name: 'Postpaid',
      icon: <FaSimCard className="fs-1 mb-3 text-primary-custom" />,
      description: 'Premium plans with monthly billing and benefits',
      link: '/products?type=postpaid'
    },
    {
      id: 3,
      name: 'Data Only',
      icon: <FaWifi className="fs-1 mb-3 text-primary-custom" />,
      description: 'High-speed data for your tablet or hotspot',
      link: '/products?type=data'
    },
    {
      id: 4,
      name: 'eSIM',
      icon: <FaSimCard className="fs-1 mb-3 text-primary-custom" />,
      description: 'Digital SIM support for compatible devices',
      link: '/products?type=esim'
    }
  ];

  // Function to convert validity into days
  const convertValidityToDays = (validity) => {
    switch (validity) {
      case "1_day":
        return 1;
      case "1_month":
        return 30;   // approx 30 days
      case "3_months":
        return 90;   // 3 × 30
      case "6_months":
        return 180;  // 6 × 30
      case "1_year":
        return 365;
      case "2_years":
        return 730;  // 2 × 365
      default:
        return 0; // fallback
    }
  };


  // Redux: fetch plans
  const dispatch = useDispatch();
  const { plans, selectedPlan: planDetails, loading, error } = useSelector(state => state.plan);
  const { profile: userProfile } = useSelector((state) => state.user || {});

  // Get user ID from token
  const token = localStorage.getItem("token");
  let userId = null;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      userId = decoded.id || decoded._id;
    } catch (err) {
      console.error("Invalid token:", err);
    }
  }

  useEffect(() => {
    dispatch(fetchAllPlans());
    dispatch(fetchUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (userProfile?.phone) {
      setPhoneNumber(userProfile.phone);
    }
  }, [userProfile]);

  // Detect Stripe redirect success and record the payment on backend
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const success = params.get('success');
    const sessionId = params.get('session_id');
    if (success === 'true' && sessionId) {
      fetch('http://localhost:5000/api/payments/record-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId }),
      })
        .then(async (res) => {
          if (!res.ok) throw new Error(await res.text());
          return res.json();
        })
        .then(() => {
          setShowSuccess(true);
          // Clean URL
          const url = new URL(window.location.href);
          url.searchParams.delete('success');
          url.searchParams.delete('session_id');
          window.history.replaceState({}, '', url.toString());
        })
        .catch((err) => {
          console.error('Record payment failed:', err);
          toast.error('Unable to record payment. Please contact support.');
        });
    }
  }, []);

  // Handler functions
  const handleShow = (plan) => {
    setSelectedPlan(plan);
    dispatch(fetchPlanById(plan._id || plan.id));
    setShow(true);
  };

  const handleClose = () => setShow(false);

  const handleRechargeClick = (plan) => {
    setSelectedPlan(plan);
    setShowPayment(true);
  };

  const handlePaymentClose = () => setShowPayment(false);

  const handleProceedToStripe = async () => {
    // Validate phone number
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      toast.error("Please enter a valid 10-digit phone number.");
      return;
    }

    if (!selectedPlan) return;

    const amount = Math.round(selectedPlan.price * 100); // paise
    try {
      const res = await fetch(
        "http://localhost:5000/api/payments/create-checkout-session",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount,
            planId: selectedPlan._id,
            phone: phoneNumber,
            userId: userId,
          }),
        }
      );
      if (!res.ok) throw new Error(await res.text());
      const { sessionId } = await res.json();
      const stripe = await stripePromise;
      await stripe.redirectToCheckout({ sessionId });
    } catch (err) {
      console.error("Stripe checkout error:", err);
      toast.error("Payment could not be started: " + err.message);
    }
  };
  return (
    <div className="home-page">

      {/* Rest of the home page content */}
      <div >
        {/* Hero Banner Carousel */}
        {/* <Hero /> */}
        <NewHero></NewHero>

        {/* SIM Categories Section */}
        <section className="py-md-5 py-4 bg-light-custom">
          <div className="container">
            <h2 className="text-center mb-md-5 mb-4 fw-bold">Choose Your SIM Type</h2>
            <div className="row g-4">
              {simCategories.map(category => (
                <div key={category.id} className="col-md-6 col-lg-3">
                  <div className="card h-100 border-0 shadow">
                    <div className="card-body text-center p-4">
                      {category.icon}
                      <h4 className="card-title">{category.name}</h4>
                      <p className="card-text text-muted">{category.description}</p>
                      <Link to={category.link} className="btn btn-outline-primary mt-3">
                        Explore <FaArrowRight className="ms-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Exploring banner */}
        <ExplorB></ExplorB>

        {/* Add for About redirect */}
        <AdAbout></AdAbout>

       

        {/* Popular Plans Section (Dynamic) */}
        <section className="py-md-5 py-4 mb-3">
          <div className="container">
            <h2 className="text-center mb-md-5 mb-2 fw-bold">Popular Plans</h2>
            {loading ? (
              <div className="text-center py-5">Loading plans...</div>
            ) : error ? (
              <div className="text-center text-danger py-5">{error}</div>
            ) : (
              <div className="row g-4">
                {plans && plans.length > 0 ? (
                  plans.slice(0, 3).map(plan => (
                    <div key={plan._id || plan.id} className="col-md-4">
                      <div className="card h-100 border-0 shadow">
                        <div className="card-header bg-white border-0 pt-md-4 pt-3 pb-0">
                          <h3 className="text-center fw-bold">{plan.name}</h3>
                          <div className="text-center">
                            <span className="h1 fw-bold text-primary-custom">₹{plan.price}</span>
                            <span className="text-muted">/{convertValidityToDays(plan.validity)} days</span>
                          </div>
                        </div>
                        <div className="card-body">
                          <ul className="list-unstyled">
                            <li className="mb-2"><strong>Data:</strong> {plan.dataLimit}</li>
                            <li className="mb-2"><strong>Speed:</strong> {plan.speed}</li>
                            <li className="mb-2"><strong>Description:</strong> {plan.description}</li>
                            {plan.features && plan.features.length > 0 && (
                              <li className="mb-3">
                                <strong>Features:</strong>
                                <ul className="mt-2">
                                  {plan.features.map((feature, index) => (
                                    <li key={index}>{feature}</li>
                                  ))}
                                </ul>
                              </li>
                            )}
                          </ul>
                        </div>
                        <div className="card-footer bg-white border-0 pb-4">
                          <button
                            className="btn btn-primary w-100"
                            onClick={() => handleShow(plan)}
                          >
                            Select Plan
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-5">No plans available.</div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Add for 1 million+ */}
        <AddBus></AddBus>

        {/* Buy SIM CTA Section */}
        {/* <section className="py-md-5 py-3 bg-primary-custom">
          <div className="container text-center">
            <h2 className="text-white mb-4">Ready to Experience Rogers Network?</h2>
            <p className="lead text-white mb-4">Get started with a new SIM card or port your existing number today!</p>
            <Link to="/products" className="btn btn-light btn-lg px-md-5 px-3">
              <span className="fs-md-5 fs-6">Buy SIM Now</span> <FaArrowRight className="ms-2" style={{ fontSize: "16px" }} />
            </Link>
          </div>
        </section> */}
         <section className="py-md-5 py-3 bg-primary-custom">
          <div className="container text-center">
            <h2 className="text-white mb-4">Upgrade to Lightning-Fast Fiber Internet</h2>
            <p className="lead text-white mb-4">
              Enjoy ultra-fast speeds, seamless streaming, and reliable connectivity for your home or business.
            </p>
            <Link to="/plans" className="btn btn-light btn-lg px-md-5 px-3">
              <span className="fs-md-5 fs-6">Choose Your Plan</span>{" "}
              <FaArrowRight className="ms-2" style={{ fontSize: "16px" }} />
            </Link>
          </div>
        </section>


        {/* Plan Details Modal */}
        <Modal show={show} onHide={handleClose} centered size="md">
          {(selectedPlan || planDetails) && (
            <>
              <Modal.Header closeButton className="border-0">
                <h4 className="fw-bold mb-0">
                  ₹{(selectedPlan || planDetails).price}
                </h4>
              </Modal.Header>
              <Modal.Body>
                <h6 className="fw-bold mb-3 text-danger">Plan Details</h6>
                <table className="table table-borderless mb-0">
                  <tbody>
                    <tr>
                      <td><strong>Plan Name:</strong></td>
                      <td>{(selectedPlan || planDetails).name}</td>
                    </tr>
                    <tr>
                      <td><strong>Validity:</strong></td>
                      <td>{(selectedPlan || planDetails).validity}</td>
                    </tr>
                    <tr>
                      <td><strong>Data:</strong></td>
                      <td>{(selectedPlan || planDetails).dataLimit || (selectedPlan || planDetails).data}</td>
                    </tr>
                    <tr>
                      <td><strong>Speed:</strong></td>
                      <td>{(selectedPlan || planDetails).speed}</td>
                    </tr>
                    <tr>
                      <td><strong>Description:</strong></td>
                      <td>{(selectedPlan || planDetails).description}</td>
                    </tr>
                    {(selectedPlan || planDetails).features && (selectedPlan || planDetails).features.length > 0 && (
                      <tr>
                        <td><strong>Features:</strong></td>
                        <td>
                          <ul className="mb-0 z_resp_ul">
                            {(selectedPlan || planDetails).features.map((feature, index) => (
                              <li key={index}>{feature}</li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </Modal.Body>
              <Modal.Footer className="border-0">
                <Button
                  className="w-100 rounded-pill"
                  variant="primary"
                  onClick={() => {
                    setShow(false);
                    setShowPayment(true);
                  }}
                >
                  Proceed to Payment
                </Button>
              </Modal.Footer>
            </>
          )}
        </Modal>

        {/* Payment Modal */}
        <Modal
          show={showPayment}
          onHide={handlePaymentClose}
          centered
          size="md"
        >
          <div className="d-flex justify-content-between align-items-center px-3 py-2 border-bottom">
            <h6 className="mb-0">
              Payment <br />
              <small>
                Amount payable: ₹{selectedPlan?.price || 0}.00
              </small>
            </h6>
            <button
              className="btn btn-sm btn-light rounded-pill px-3"
              onClick={handlePaymentClose}
            >
              <MdClose />
            </button>
          </div>

          <Modal.Body>
            <Form>
              <div className="mb-3">
                <Form.Label>Mobile / Recharge Number</Form.Label>
                <Form.Control
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => {
                    // Allow only numbers
                    const onlyNums = e.target.value.replace(/\D/g, "");
                    setPhoneNumber(onlyNums);
                  }}
                  placeholder="Enter 10-digit phone number"
                  maxLength={10}
                  required
                  isInvalid={
                    phoneNumber.length > 0 && phoneNumber.length !== 10
                  }
                />
                <Form.Control.Feedback type="invalid">
                  Please enter a valid 10-digit phone number.
                </Form.Control.Feedback>
              </div>

              <Button
                type="button"
                className="w-100 btn-primary mt-3"
                onClick={handleProceedToStripe}
              >
                Continue to Pay (Stripe)
              </Button>
            </Form>
          </Modal.Body>
        </Modal>

        {/* Success Modal */}
        <Modal
          show={showSuccess}
          onHide={() => setShowSuccess(false)}
          centered
          size="sm"
          contentClassName="text-center p-4 rounded-4"
        >
          <div className="d-flex justify-content-center">
            <FaCheckCircle size={80} color="#28a745" className="mb-3" />
          </div>
          <h4 className="fw-bold mb-2">Success!</h4>
          <p className="text-muted mb-4">
            Your payment has been processed successfully!
          </p>
          <Button
            variant="light"
            className="text-dark fw-semibold shadow-sm px-4"
            onClick={() => setShowSuccess(false)}
          >
            Okay
          </Button>
        </Modal>
      </div>
    </div>
  );
}


