import React, { useState } from "react";
import { FaBolt, FaChevronRight, FaGooglePay, FaHeadset, FaUndoAlt, FaUsers } from "react-icons/fa";
import { Modal, Button, Form, Accordion } from "react-bootstrap";
import { SiPhonepe } from "react-icons/si";
import { FaCcVisa } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { FaPlus, FaMinus } from "react-icons/fa6";
import { MdClose } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";
import paytm from '../image/paytm_offer_logo.svg'
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import '../style/z_app.css';


const plansData = [
    {
        title: "Top Trending True 5G Unlimited Plans",
        plans: [
            { price: 355, validity: "30 Days", data: "25 GB", highSpeed: "25 GB at high speed", voice: "Unlimited Calls" },
            { price: 499, validity: "28 Days", data: "2 GB/day", highSpeed: "2 GB/day at high speed", voice: "Unlimited Calls" },
            { price: 666, validity: "56 Days", data: "1.5 GB/day", highSpeed: "1.5 GB/day at high speed", voice: "Unlimited Calls" },
            { price: 999, validity: "84 Days", data: "2.5 GB/day", highSpeed: "2.5 GB/day at high speed", voice: "Unlimited Calls" },
            { price: 149, validity: "20 Days", data: "1 GB/day", highSpeed: "1 GB/day at high speed", voice: "Unlimited Calls" },
            { price: 199, validity: "23 Days", data: "1.5 GB/day", highSpeed: "1.5 GB/day at high speed", voice: "Unlimited Calls" },
            { price: 249, validity: "23 Days", data: "2 GB/day", highSpeed: "2 GB/day at high speed", voice: "Unlimited Calls" },
            { price: 299, validity: "28 Days", data: "2.5 GB/day", highSpeed: "2.5 GB/day at high speed", voice: "Unlimited Calls" },
            { price: 399, validity: "28 Days", data: "3 GB/day", highSpeed: "3 GB/day at high speed", voice: "Unlimited Calls" },
            { price: 555, validity: "55 Days", data: "2 GB/day", highSpeed: "2 GB/day at high speed", voice: "Unlimited Calls" },
            { price: 799, validity: "56 Days", data: "2.5 GB/day", highSpeed: "2.5 GB/day at high speed", voice: "Unlimited Calls" },
            { price: 1199, validity: "84 Days", data: "3 GB/day", highSpeed: "3 GB/day at high speed", voice: "Unlimited Calls" },
            { price: 1499, validity: "84 Days", data: "Unlimited 5G", highSpeed: "Truly Unlimited 5G", voice: "Unlimited Calls" },
            { price: 2999, validity: "365 Days", data: "2.5 GB/day", highSpeed: "2.5 GB/day at high speed", voice: "Unlimited Calls" },
        ],
    },
    {
        title: "2.5 GB/day Plans",
        plans: [
            { price: 399, validity: "28 Days", data: "2.5 GB/day", highSpeed: "2.5 GB/day at high speed", voice: "Unlimited Calls" },
            { price: 699, validity: "56 Days", data: "2.5 GB/day", highSpeed: "2.5 GB/day at high speed", voice: "Unlimited Calls" },
            { price: 999, validity: "84 Days", data: "2.5 GB/day", highSpeed: "2.5 GB/day at high speed", voice: "Unlimited Calls" },
            { price: 2999, validity: "365 Days", data: "2.5 GB/day", highSpeed: "2.5 GB/day at high speed", voice: "Unlimited Calls" },
        ],
    },
    {
        title: "2 GB/day Plans",
        plans: [
            { price: 299, validity: "23 Days", data: "2 GB/day", highSpeed: "2 GB/day at high speed", voice: "Unlimited Calls" },
            { price: 499, validity: "28 Days", data: "2 GB/day", highSpeed: "2 GB/day at high speed", voice: "Unlimited Calls" },
            { price: 799, validity: "56 Days", data: "2 GB/day", highSpeed: "2 GB/day at high speed", voice: "Unlimited Calls" },
            { price: 1199, validity: "84 Days", data: "2 GB/day", highSpeed: "2 GB/day at high speed", voice: "Unlimited Calls" },
        ],
    },
    {
        title: "1.5 GB/day Plans",
        plans: [
            { price: 239, validity: "23 Days", data: "1.5 GB/day", highSpeed: "1.5 GB/day at high speed", voice: "Unlimited Calls" },
            { price: 479, validity: "56 Days", data: "1.5 GB/day", highSpeed: "1.5 GB/day at high speed", voice: "Unlimited Calls" },
            { price: 666, validity: "77 Days", data: "1.5 GB/day", highSpeed: "1.5 GB/day at high speed", voice: "Unlimited Calls" },
            { price: 1999, validity: "365 Days", data: "1.5 GB/day", highSpeed: "1.5 GB/day at high speed", voice: "Unlimited Calls" },
        ],
    },
    {
        title: "3 GB/day Plans",
        plans: [
            { price: 349, validity: "23 Days", data: "3 GB/day", highSpeed: "3 GB/day at high speed", voice: "Unlimited Calls" },
            { price: 719, validity: "56 Days", data: "3 GB/day", highSpeed: "3 GB/day at high speed", voice: "Unlimited Calls" },
            { price: 999, validity: "84 Days", data: "3 GB/day", highSpeed: "3 GB/day at high speed", voice: "Unlimited Calls" },
        ],
    }
];

const fiberPlansData = [
    {
        title: "Popular Fiber Plans",
        plans: [
            { price: 399, validity: "30 Days", speed: "30 Mbps", data: "Unlimited Data", benefits: "Free Router" },
            { price: 699, validity: "30 Days", speed: "100 Mbps", data: "Unlimited Data", benefits: "OTT Subscriptions" },
            { price: 999, validity: "30 Days", speed: "200 Mbps", data: "Unlimited Data", benefits: "Free Landline Calls" },
            { price: 1499, validity: "30 Days", speed: "300 Mbps", data: "Unlimited Data", benefits: "OTT + Netflix" },
        ],
    },
    {
        title: "Long Validity Fiber Plans",
        plans: [
            { price: 2999, validity: "90 Days", speed: "150 Mbps", data: "Unlimited Data", benefits: "Free Router" },
            { price: 5999, validity: "180 Days", speed: "300 Mbps", data: "Unlimited Data", benefits: "OTT Bundle" },
        ],
    },
];

function Plans() {
    const [show, setShow] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [showPayment, setShowPayment] = useState(false);
    const [activeIndex, setActiveIndex] = useState(null);
    const [isFiber, setIsFiber] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);

    const handlePaymentShow = () => setShowPayment(true);
    const handlePaymentClose = () => setShowPayment(false);

    // const [selectedUPI, setSelectedUPI] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedMethod) {
            alert("Please select a UPI payment method before proceeding.");
            return;
        }
        alert(`Payment method selected: ${selectedMethod}`);

        // ✅ Success modal open
        setShowPayment(false);
        setShowSuccess(true);
    };

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const handleShow = (plan) => {
        setSelectedPlan(plan);
        setShow(true);
    };

    const handleClose = () => setShow(false);

    const offers = [
        {
            id: 1,
            logo: "https://seeklogo.com/images/B/bhim-upi-logo-4E21E0D871-seeklogo.com.png",
            text: "Get Flat Rs.10 instant cashback on mobile prepaid recharge via BHIM Payments App. Minimum Transaction Value of Rs.299",
        },
        {
            id: 2,
            logo: "https://seeklogo.com/images/A/amazon-pay-logo-74E98D2900-seeklogo.com.png",
            text: "Get Up To Rs.25 Cashback On Minimum Transaction Value Of Rs.299 Via Amazon Pay Upi",
        },
        {
            id: 3,
            logo: "https://seeklogo.com/images/C/cred-logo-B11B1C0D6F-seeklogo.com.png",
            text: "Assured Cashback Up To Rs.250, Setup Upi Autopay On Cred Pay To Avail This Offer.",
        },
        {
            id: 4,
            logo: "https://seeklogo.com/images/P/paytm-logo-336A6F0D98-seeklogo.com.png",
            text: "Complete A Payment Of Rs.499 Or More On Jio Using Rupay Credit Card On Paytm Upi And Get Up to Rs.300 Cashback. Limited Period Offer.",
        },
        {
            id: 5,
            logo: "https://seeklogo.com/images/M/mobikwik-logo-7D2E1ED8CD-seeklogo.com.png",
            text: "Get Up To Rs.100 Cashback On Min Transaction Value Of Rs.299 Using Mobikwik Wallet.",
        },
    ];

    return (
        <>
            <section className="z_addOns_section py-5">
                <div className="container">
                    {/* Top section */}
                    <div className="z_merge_div d-flex justify-content-between align-items-center">
                        <div>
                            <h3 className="text-center mb-0 fw-bold">Choose Your Plan</h3>
                        </div>
                        {/* Switch Section */}
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

                    {/* Plans Accordion */}
                    <section className="z_plans_section container my-4">
                        {(isFiber ? fiberPlansData : plansData).map((category, index) => (
                            <div
                                key={index}
                                className={isFiber ? "z_fiber_item border-bottom" : "z_plans_item border-bottom"}
                            >
                                {/* Accordion Header */}
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
                                        <FaMinus className="text-primary" />
                                    ) : (
                                        <FaPlus className="text-primary" />
                                    )}
                                </div>

                                {/* Accordion Content */}
                                {activeIndex === index && (
                                    <div
                                        className={
                                            isFiber ? "z_fiber_body row g-3 pb-3" : "z_plans_body row g-3 pb-3"
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
                                                            className="text-primary"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={() => handleShow(plan)}
                                                        />
                                                    </div>

                                                    {/* Show Mobile or Fiber fields */}
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

                                                    <button className="z_prd_btn w-100" onClick={handlePaymentShow}>Recharge</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </section>

                    {/* Modal (Plan Details) */}
                    <Modal show={show} onHide={handleClose} centered size="md">
                        {selectedPlan && (
                            <>
                                <Modal.Header closeButton className="border-0">
                                    <h4 className="fw-bold mb-0">₹{selectedPlan.price}</h4>
                                </Modal.Header>
                                <Modal.Body>
                                    <h6 className="fw-bold mb-3 text-danger">Plan Details</h6>
                                    <table className="table z_plan_table mb-0">
                                        <tbody>
                                            <tr><td>Validity</td><td>{selectedPlan.validity}</td></tr>
                                            {isFiber ? (
                                                <>
                                                    <tr><td>Speed</td><td>{selectedPlan.speed}</td></tr>
                                                    <tr><td>Data</td><td>{selectedPlan.data}</td></tr>
                                                    <tr><td>Benefits</td><td>{selectedPlan.benefits}</td></tr>
                                                </>
                                            ) : (
                                                <>
                                                    <tr><td>Data</td><td>{selectedPlan.data}</td></tr>
                                                    <tr><td>High Speed</td><td>{selectedPlan.highSpeed}</td></tr>
                                                    <tr><td>Voice</td><td>{selectedPlan.voice}</td></tr>
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
                        {/* Header */}
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

                        {/* Body */}
                        <Modal.Body className="z_payment_body">
                            {/* Slider Section */}
                            {/* <section className="offer-slider">
                                <Swiper
                                    modules={[Pagination, Autoplay]}
                                    pagination={{ clickable: true }}
                                    spaceBetween={20}
                                    slidesPerView={1}
                                    loop={true}
                                    autoplay={{
                                        delay: 3000, // 3 seconds
                                        disableOnInteraction: false, // keep autoplay even after user swipes
                                    }}
                                >
                                    {offers.map((offer) => (
                                        <SwiperSlide key={offer.id}>
                                            <div className="offer-card">
                                                <img src={offer.logo} alt="offer-logo" className="offer-logo" />
                                                <p className="offer-text">{offer.text}</p>
                                                <a href="#" className="offer-link text-danger">T&C apply</a>
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </section> */}


                            <Form onSubmit={handleSubmit}>
                                {/* Google Pay */}
                                <div className="text-center mt-2">
                                    <h4>UPI Payment Options</h4>
                                </div>
                                <div
                                    className={`z_payment_card d-flex align-items-center justify-content-between p-3 mb-2 rounded-3 shadow-sm ${selectedMethod === "Google Pay" ? "active" : ""
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
                                    className={`z_payment_card d-flex align-items-center justify-content-between p-3 mb-2 rounded-3 shadow-sm ${selectedMethod === "Paytm" ? "active" : ""
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
                                    className={`z_payment_card d-flex align-items-center justify-content-between p-3 mb-2 rounded-3 shadow-sm ${selectedMethod === "Other UPI" ? "active" : ""
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

                                {/* Submit Button */}
                                <Button type="submit" className="w-100 z_prd_btn">
                                    Proceed to Pay
                                </Button>
                            </Form>
                        </Modal.Body>
                    </Modal>

                    {/* ✅ Success Modal */}
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

                {/* Why Choose Us Section */}
                <section className="z_benefits_section py-5 mt-4">
                    <div className="container text-center">
                        <h3 className="fw-bold mb-2">Why Choose Us?</h3>
                        <p className="text-muted mb-5">
                            We provide secure, reliable and lightning-fast payment services.
                            With 24/7 support and a trusted user base, your convenience is our priority.
                        </p>

                        <div className="row g-4">
                            <div className="col-md-3 col-sm-6">
                                <div className="z_benefit_card p-4 rounded-4 shadow-sm h-100">
                                    <FaBolt size={40} className="text-primary mb-3" />
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
