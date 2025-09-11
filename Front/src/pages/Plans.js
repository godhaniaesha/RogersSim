import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllPlans,
  fetchPlanById,
} from "../store/slices/planSlice"; // adjust path if needed

import {
  FaBolt,
  FaChevronRight,
  FaHeadset,
  FaUndoAlt,
  FaUsers,
} from "react-icons/fa";
import { Modal, Button, Form } from "react-bootstrap";
import { FaPlus, FaMinus, FaCheckCircle } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../style/z_app.css";

function Plans() {
  const dispatch = useDispatch();
  const { plans, selectedPlan, loading, error } = useSelector(
    (state) => state.plan
  );

  

  const [show, setShow] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [isFiber, setIsFiber] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [localSelectedPlan, setLocalSelectedPlan] = useState(null);

  useEffect(() => {
    // fetch all plans on load
    dispatch(fetchAllPlans());
  }, [dispatch]);

  const handlePaymentShow = () => setShowPayment(true);
  const handlePaymentClose = () => setShowPayment(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedMethod) {
      alert("Please select a UPI payment method before proceeding.");
      return;
    }
    alert(`Payment method selected: ${selectedMethod}`);

    setShowPayment(false);
    setShowSuccess(true);
  };

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const handleShow = (plan) => {
    setLocalSelectedPlan(plan);
    // optional: if you want to fetch plan details from API
    dispatch(fetchPlanById(plan._id || plan.id));
    setShow(true);
  };

  const handleClose = () => setShow(false);

  // Group plans dynamically by category (assuming your API returns category field)
  // Example: { title: 'Mobile Plans', plans: [ ... ] }
  const groupedPlans = Array.isArray(plans)
    ? plans.reduce((acc, plan) => {
        const cat = plan.category || (isFiber ? "Fiber Plans" : "Mobile Plans");
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(plan);
        return acc;
      }, {})
    : {};

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
                <label
                  htmlFor="z_switch_checkbox"
                  className="z_switch_label"
                >
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
                  isFiber ? "z_fiber_item border-bottom" : "z_plans_item border-bottom"
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
                      <div key={i} className="col-lg-3 col-md-4 col-sm-6 col-12">
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
                              <small className="text-muted">Validity</small> <br />
                              <span className="fw-bold">{plan.validity}</span>
                            </p>
                            {isFiber ? (
                              <>
                                <p className="mb-1">
                                  <small className="text-muted">Speed</small> <br />
                                  <span className="fw-bold">{plan.speed}</span>
                                </p>
                              </>
                            ) : (
                              <p className="mb-1">
                                <small className="text-muted">Data</small> <br />
                                <span className="fw-bold">{plan.data}</span>
                              </p>
                            )}
                          </div>

                          <button
                            className="z_prd_btn w-100"
                            onClick={handlePaymentShow}
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

          {/* Modal Plan Details */}
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
                            <td>{(localSelectedPlan || selectedPlan).benefits}</td>
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
                  <Button className="w-100 rounded-pill" variant="primary">
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
              <h6 className="mb-0 ">
                Payment <br />
                <small>Amount payable: ₹799.00</small>
              </h6>
              <button
                className="btn btn-sm btn-light rounded-pill px-3"
                onClick={handlePaymentClose}
              >
                <MdClose />
              </button>
            </div>

            <Modal.Body className="z_payment_body">
              <Form onSubmit={handleSubmit}>
                <div className="text-center mt-2">
                  <h4>UPI Payment Options</h4>
                </div>

                {/* Google Pay */}
                <div
                  className={`z_payment_card d-flex align-items-center justify-content-between p-3 mb-2 rounded-3 shadow-sm ${
                    selectedMethod === "Google Pay" ? "active" : ""
                  }`}
                  onClick={() => setSelectedMethod("Google Pay")}
                  style={{ cursor: "pointer" }}
                >
                  <div className="d-flex align-items-center gap-2">
                    <img
                      src="https://cdn.shopify.com/s/files/1/0452/5984/9880/files/Google-Pay-Logo-01.png?v=1719301940"
                      alt="Google Pay"
                      width="40"
                      height="40"
                    />
                    <span className="fw-semibold">Google Pay</span>
                  </div>
                  <Form.Check
                    type="radio"
                    name="payment"
                    value="Google Pay"
                    checked={selectedMethod === "Google Pay"}
                    onChange={(e) => setSelectedMethod(e.target.value)}
                    required
                  />
                </div>
                {selectedMethod === "Google Pay" && (
                  <div className="mb-3">
                    <Form.Label>Google Pay UPI ID</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="example@okicici"
                      required
                    />
                  </div>
                )}

                {/* Paytm */}
                <div
                  className={`z_payment_card d-flex align-items-center justify-content-between p-3 mb-2 rounded-3 shadow-sm ${
                    selectedMethod === "Paytm" ? "active" : ""
                  }`}
                  onClick={() => setSelectedMethod("Paytm")}
                  style={{ cursor: "pointer" }}
                >
                  <div className="d-flex align-items-center gap-2">
                    <img
                      src="https://miro.medium.com/v2/resize:fit:1358/1*-Uuj69x4V4BH9Ioba1vT5Q.png"
                      alt="Paytm"
                      width="40"
                      height="40"
                    />
                    <span className="fw-semibold">Paytm</span>
                  </div>
                  <Form.Check
                    type="radio"
                    name="payment"
                    value="Paytm"
                    checked={selectedMethod === "Paytm"}
                    onChange={(e) => setSelectedMethod(e.target.value)}
                    required
                  />
                </div>
                {selectedMethod === "Paytm" && (
                  <div className="mb-3">
                    <Form.Label>Paytm Mobile Number</Form.Label>
                    <Form.Control
                      type="tel"
                      placeholder="Enter Paytm number"
                      required
                    />
                  </div>
                )}

                {/* Other UPI */}
                <div
                  className={`z_payment_card d-flex align-items-center justify-content-between p-3 mb-2 rounded-3 shadow-sm ${
                    selectedMethod === "Other UPI" ? "active" : ""
                  }`}
                  onClick={() => setSelectedMethod("Other UPI")}
                  style={{ cursor: "pointer" }}
                >
                  <div className="d-flex align-items-center gap-2">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/f/f0/UPI-Logo-vector.svg"
                      alt="UPI"
                      width="40"
                      height="40"
                    />
                    <span className="fw-semibold">Other UPI</span>
                  </div>
                  <Form.Check
                    type="radio"
                    name="payment"
                    value="Other UPI"
                    checked={selectedMethod === "Other UPI"}
                    onChange={(e) => setSelectedMethod(e.target.value)}
                    required
                  />
                </div>
                {selectedMethod === "Other UPI" && (
                  <div className="mb-3">
                    <Form.Label>Enter UPI ID</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="yourname@upi"
                      required
                    />
                  </div>
                )}

                <Button type="submit" className="w-100 z_prd_btn">
                  Proceed to Pay
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
