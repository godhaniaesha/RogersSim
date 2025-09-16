import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPlans, fetchPlanById } from "../store/slices/planSlice"; // adjust path if needed
import { fetchUserProfile } from "../store/slices/userSlice";
import {  toast } from "react-toastify";
import {
  FaBolt,
  FaChevronRight,
  FaHeadset,
  FaUndoAlt,
  FaUsers,
  FaPlus,
  FaMinus,
  FaCheckCircle,
} from "react-icons/fa";
import { Modal, Button, Form } from "react-bootstrap";
import { MdClose } from "react-icons/md";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../style/z_app.css";
import { jwtDecode } from "jwt-decode";
import { loadStripe } from "@stripe/stripe-js";

// initialise Stripe with your public key
const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_KEY ||
    "pk_test_51R8wmeQ0DPGsMRTSHTci2XmwYmaDLRqeSSRS2hNUCU3xU7ikSAvXzSI555Rxpyf9SsTIgI83PXvaaQE3pJAlkMaM00g9BdsrOB"
);

function Plans() {
  const dispatch = useDispatch();
  const { plans, selectedPlan, loading, error } = useSelector(
    (state) => state.plan
  );
  const { profile: userProfile } = useSelector((state) => state.user || {});
  
  const token = localStorage.getItem("token"); // token store karyo hoy to
  let userId = null;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      userId = decoded.id || decoded._id; // JWT payload ma je key hoy te use karo
      console.log(userId,"===");      
    } catch (err) {
      console.error("Invalid token:", err);
    }
  }
  const [show, setShow] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFiber, setIsFiber] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [localSelectedPlan, setLocalSelectedPlan] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");

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

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const handleShow = (plan) => {
    setLocalSelectedPlan(plan);
    dispatch(fetchPlanById(plan._id || plan.id));
    setShow(true);
  };

  const handleClose = () => setShow(false);

  const handleRechargeClick = (plan) => {
    setLocalSelectedPlan(plan);
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

  if (!localSelectedPlan) return;

  const amount = Math.round(localSelectedPlan.price * 100); // paise
  try {
    const res = await fetch(
      "http://localhost:5000/api/payments/create-checkout-session",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          planId: localSelectedPlan._id,
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
    alert("Payment could not be started: " + err.message);
  }
};

  // filter and group plans
  const filteredPlans = Array.isArray(plans)
    ? plans.filter((p) =>
        isFiber
          ? p.planType?.toLowerCase() === "fiber"
          : p.planType?.toLowerCase() === "mobile"
      )
    : [];

  const groupedPlans = filteredPlans.reduce((acc, plan) => {
    const cat = plan.category || (isFiber ? "Fiber Plans" : "Mobile Plans");
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(plan);
    return acc;
  }, {});
  const planCategories = Object.keys(groupedPlans).map((key) => ({
    title: key,
    plans: groupedPlans[key],
  }));

  return (
    <>
      <section className="z_addOns_section py-5">
        <div className="container">
          <div className="z_merge_div d-flex justify-content-between align-items-center">
            <div>
              <h3 className="text-center mb-0 fw-bold">Choose Your Plan</h3>
            </div>
            <div className="d-flex justify-content-center">
              <div className="z_switch_container">
                <input
                  type="checkbox"
                  id="z_switch_checkbox"
                  className="d-none"
                  checked={isFiber}
                  onChange={() => setIsFiber(!isFiber)}
                />
                <label htmlFor="z_switch_checkbox" className="z_switch_label">
                  <span className={!isFiber ? "active" : ""}>Mobile Plans</span>
                  <span className={isFiber ? "active" : ""}>Fiber Plans</span>
                </label>
              </div>
            </div>
          </div>

          {loading && <p className="text-center">Loading plans…</p>}
          {error && <p className="text-danger text-center">{error}</p>}

          <section className="z_plans_section container my-4">
            {planCategories.map((category, index) => (
              <div
                key={index}
                className={
                  isFiber
                    ? "z_fiber_item border-bottom"
                    : "z_plans_item border-bottom"
                }
              >
                <div
                  className={
                    isFiber
                      ? "z_fiber_header d-flex justify-content-between align-items-center py-3"
                      : "z_plans_header d-flex justify-content-between align-items-center py-3"
                  }
                  onClick={() => toggleAccordion(index)}
                  style={{ cursor: "pointer" }}
                >
                  <h6 className="fw-bold mb-0">{category.title}</h6>
                  {activeIndex === index ? (
                    <FaMinus className="text-danger" />
                  ) : (
                    <FaPlus className="text-danger" />
                  )}
                </div>

                {activeIndex === index && (
                  <div
                    className={
                      isFiber
                        ? "z_fiber_body row g-3 pb-3"
                        : "z_plans_body row g-3 pb-3"
                    }
                  >
                    {category.plans.map((plan, i) => (
                      <div
                        key={i}
                        className="col-lg-3 col-md-4 col-sm-6 col-12"
                      >
                        <div
                          className={
                            isFiber
                              ? "z_fiber_card bg-light p-3 rounded-4 shadow-sm h-100"
                              : "z_plans_card bg-light p-3 rounded-4 shadow-sm h-100"
                          }
                        >
                          <div className="d-flex justify-content-between align-items-start">
                            <h4 className="fw-bold mb-0">₹{plan.price}</h4>
                            <FaChevronRight
                              className="text-danger"
                              style={{ cursor: "pointer" }}
                              onClick={() => handleShow(plan)}
                            />
                          </div>

                          <div className="mt-2">
                            <p className="mb-1">
                              <small className="text-muted">Validity</small>{" "}
                              <br />
                              <span className="fw-bold">{plan.validity}</span>
                            </p>
                            {isFiber ? (
                              <p className="mb-1">
                                <small className="text-muted">Speed</small>{" "}
                                <br />
                                <span className="fw-bold">{plan.speed}</span>
                              </p>
                            ) : (
                              <p className="mb-1">
                                <small className="text-muted">Data</small>{" "}
                                <br />
                                <span className="fw-bold">{plan.data}</span>
                              </p>
                            )}
                          </div>

                          <button
                            className="z_prd_btn w-100"
                            onClick={() => handleRechargeClick(plan)}
                          >
                            Recharge
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </section>

          {/* Plan Details Modal */}
          <Modal show={show} onHide={handleClose} centered size="md">
            {(localSelectedPlan || selectedPlan) && (
              <>
                <Modal.Header closeButton className="border-0">
                  <h4 className="fw-bold mb-0">
                    ₹{(localSelectedPlan || selectedPlan).price}
                  </h4>
                </Modal.Header>
                <Modal.Body>
                  <h6 className="fw-bold mb-3 text-danger">Plan Details</h6>
                  <table className="table z_plan_table mb-0">
                    <tbody>
                      <tr>
                        <td>Validity</td>
                        <td>{(localSelectedPlan || selectedPlan).validity}</td>
                      </tr>
                      {isFiber ? (
                        <>
                          <tr>
                            <td>Speed</td>
                            <td>{(localSelectedPlan || selectedPlan).speed}</td>
                          </tr>
                          <tr>
                            <td>Data</td>
                            <td>{(localSelectedPlan || selectedPlan).data}</td>
                          </tr>
                          <tr>
                            <td>Benefits</td>
                            <td>
                              {(localSelectedPlan || selectedPlan).benefits}
                            </td>
                          </tr>
                        </>
                      ) : (
                        <>
                          <tr>
                            <td>Data</td>
                            <td>{(localSelectedPlan || selectedPlan).data}</td>
                          </tr>
                          <tr>
                            <td>High Speed</td>
                            <td>
                              {(localSelectedPlan || selectedPlan).highSpeed}
                            </td>
                          </tr>
                          <tr>
                            <td>Voice</td>
                            <td>{(localSelectedPlan || selectedPlan).voice}</td>
                          </tr>
                        </>
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
                    Recharge
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
            dialogClassName="z_payment_modal"
          >
            <div className="z_payment_header d-flex justify-content-between align-items-center px-3 py-2">
              <h6 className="mb-0">
                Payment <br />
                <small>
                  Amount payable: ₹{localSelectedPlan?.price || 799}.00
                </small>
              </h6>
              <button
                className="btn btn-sm btn-light rounded-pill px-3"
                onClick={handlePaymentClose}
              >
                <MdClose />
              </button>
            </div>

            <Modal.Body className="z_payment_body">
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
                    maxLength={10} // limit input to 10 digits
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
                  className="w-100 z_prd_btn mt-3"
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

        {/* Why Choose Us */}
        <section className="z_benefits_section py-md-5 mt-3">
          <div className="container text-center">
            <h3 className="fw-bold mb-2">Why Choose Us?</h3>
            <p className="text-muted mb-5">
              We provide secure, reliable and lightning-fast payment services.
              With 24/7 support and a trusted user base, your convenience is our
              priority.
            </p>

            <div className="row g-4">
              <div className="col-md-3 col-sm-6">
                <div className="z_benefit_card p-4 rounded-4 shadow-sm h-100">
                  <FaBolt size={40} className="text-danger mb-3" />
                  <h6 className="fw-semibold">Fast Recharge</h6>
                  <p className="text-muted small mb-0">
                    Instantly recharge your mobile or fiber connection.
                  </p>
                </div>
              </div>
              <div className="col-md-3 col-sm-6">
                <div className="z_benefit_card p-4 rounded-4 shadow-sm h-100">
                  <FaHeadset size={40} className="text-success mb-3" />
                  <h6 className="fw-semibold">24/7 Support</h6>
                  <p className="text-muted small mb-0">
                    Our support team is available round the clock.
                  </p>
                </div>
              </div>
              <div className="col-md-3 col-sm-6">
                <div className="z_benefit_card p-4 rounded-4 shadow-sm h-100">
                  <FaUndoAlt size={40} className="text-warning mb-3" />
                  <h6 className="fw-semibold">Easy Refund</h6>
                  <p className="text-muted small mb-0">
                    Hassle-free refund in case of failed transactions.
                  </p>
                </div>
              </div>
              <div className="col-md-3 col-sm-6">
                <div className="z_benefit_card p-4 rounded-4 shadow-sm h-100">
                  <FaUsers size={40} className="text-danger mb-3" />
                  <h6 className="fw-semibold">Trusted by 10k+</h6>
                  <p className="text-muted small mb-0">
                    Thousands of happy users recharge with us daily.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
    </>
  );
}

export default Plans;
