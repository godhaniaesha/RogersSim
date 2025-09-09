import React, { useState } from "react";
import { FaChevronRight, FaGooglePay } from "react-icons/fa";
import { Modal, Button, Form, Accordion } from "react-bootstrap";
import { SiPhonepe } from "react-icons/si";
import { FaCcVisa } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import '../style/z_app.css';

const plans = [
    {
        price: "₹799",
        validity: "84 Days",
        data: "126 GB",
        highSpeed: "1.5 GB/day",
        voice: "Unlimited",
        sms: "100 SMS/Day",
        benefits: "3 GB/Day",
    },
    {
        price: "₹999",
        validity: "56 Days",
        data: "112 GB",
        highSpeed: "2 GB/day",
        voice: "Unlimited",
        sms: "100 SMS/Day",
        benefits: "3 GB/Day",
    },
    {
        price: "₹799",
        validity: "84 Days",
        data: "126 GB",
        highSpeed: "1.5 GB/day",
        voice: "Unlimited",
        sms: "100 SMS/Day",
        benefits: "3 GB/Day",
    },
    {
        price: "₹799",
        validity: "84 Days",
        data: "126 GB",
        highSpeed: "1.5 GB/day",
        voice: "Unlimited",
        sms: "100 SMS/Day",
        benefits: "3 GB/Day",
    },
];

function Plans() {
    const [show, setShow] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [showPayment, setShowPayment] = useState(false);

    const handlePaymentShow = () => setShowPayment(true);
    const handlePaymentClose = () => setShowPayment(false);

    const [selectedUPI, setSelectedUPI] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedUPI) {
            alert("Please select a UPI payment method before proceeding.");
            return;
        }
        alert(`Payment method selected: ${selectedUPI}`);
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
        <section className="z_addOns_section py-5">
            <div className="container">
                <h2 className="text-center mb-4 fw-bold">Choose Your Plan</h2>
                <div className="row g-4 justify-content-center">
                    {plans.map((plan, index) => (
                        <div key={index} className="col-md-3 col-sm-6">
                            <div className="z_addOns_card bg-light p-3 rounded-4 shadow-sm h-100">
                                <div className="d-flex justify-content-between align-items-start">
                                    <h3 className="fw-bold mb-0">{plan.price}</h3>
                                    <FaChevronRight
                                        className="text-primary"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => handleShow(plan)}
                                    />
                                </div>
                                <div className="d-flex gap-3">
                                    <p className="mb-1">
                                        <small className="text-muted">Validity:</small> <br />
                                        <span className="fw-bold">{plan.validity}</span>
                                    </p>
                                    <p className="mb-1">
                                        <small className="text-muted">Benefits</small> <br />
                                        <span className="fw-bold">{plan.benefits}</span>
                                    </p>
                                </div>
                                <p className="fw-semibold text-primary mb-2">{plan.highSpeed}</p>
                                <button className="z_prd_btn w-100" onClick={handlePaymentShow}>
                                    Recharge
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Modal (Plan Details) */}
                <Modal show={show} onHide={handleClose} centered size="md">
                    {selectedPlan && (
                        <>
                            <Modal.Header closeButton className="border-0">
                                <h4 className="fw-bold mb-0">{selectedPlan.price}</h4>
                            </Modal.Header>
                            <Modal.Body>
                                <h6 className="fw-bold mb-3 text-danger">Plan Details</h6>
                                <table className="table z_plan_table mb-0">
                                    <tbody>
                                        <tr><td>Pack validity</td><td>{selectedPlan.validity}</td></tr>
                                        <tr><td>Total data</td><td>{selectedPlan.data}</td></tr>
                                        <tr><td>Data at high speed</td><td>{selectedPlan.highSpeed}</td></tr>
                                        <tr><td>Voice</td><td>{selectedPlan.voice}</td></tr>
                                        <tr><td>SMS</td><td>{selectedPlan.sms}</td></tr>
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
                        <h6 className="mb-0 text-white">
                            Payment <br />
                            <small>Amount payable: ₹799.00</small>
                        </h6>
                        <button
                            className="btn btn-sm btn-light rounded-pill px-3"
                            onClick={handlePaymentClose}
                        >
                            Close
                        </button>
                    </div>

                    {/* Body */}
                    <Modal.Body className="z_payment_body">
                        {/* Slider Section */}
                        <section className="offer-slider">
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
                        </section>


                        <Form onSubmit={handleSubmit}>
                            <Accordion defaultActiveKey="0" className="mb-3">
                                <Accordion.Item eventKey="0">
                                    <Accordion.Header>UPI Payment Options</Accordion.Header>
                                    <Accordion.Body>
                                        {/* Google Pay */}
                                        <div className="z_payment_card mb-2 p-2 rounded-3 d-flex align-items-center justify-content-between shadow-sm">
                                            <div className="d-flex align-items-center gap-2">
                                                <img
                                                    src="https://cdn.shopify.com/s/files/1/0452/5984/9880/files/Google-Pay-Logo-01.png?v=1719301940"
                                                    alt="Google Pay"
                                                    width="39"
                                                    height="25"
                                                    style={{ objectFit: "cover" }}
                                                />
                                                <span className="fw-semibold">Google Pay</span>
                                            </div>
                                            <Form.Check
                                                type="radio"
                                                name="upi"
                                                value="Google Pay"
                                                checked={selectedUPI === "Google Pay"}
                                                onChange={(e) => setSelectedUPI(e.target.value)}
                                                required
                                            />
                                        </div>

                                        {/* Paytm */}
                                        <div className="z_payment_card mb-2 p-2 rounded-3 d-flex align-items-center justify-content-between shadow-sm">
                                            <div className="d-flex align-items-center gap-2">
                                                <img
                                                    src="https://miro.medium.com/v2/resize:fit:1358/1*-Uuj69x4V4BH9Ioba1vT5Q.png"
                                                    alt="Paytm"
                                                    width="28"
                                                    height="28"
                                                />
                                                <span className="fw-semibold">Paytm</span>
                                            </div>
                                            <Form.Check
                                                type="radio"
                                                name="upi"
                                                value="Paytm"
                                                checked={selectedUPI === "Paytm"}
                                                onChange={(e) => setSelectedUPI(e.target.value)}
                                                required
                                            />
                                        </div>

                                        {/* Other UPI */}
                                        <div className="z_payment_card mb-2 p-2 rounded-3 d-flex align-items-center justify-content-between shadow-sm">
                                            <div className="d-flex align-items-center gap-2">
                                                <img
                                                    src="https://upload.wikimedia.org/wikipedia/commons/f/f0/UPI-Logo-vector.svg"
                                                    alt="UPI"
                                                    width="28"
                                                    height="28"
                                                />
                                                <span className="fw-semibold">Other UPI</span>
                                            </div>
                                            <Form.Check
                                                type="radio"
                                                name="upi"
                                                value="Other UPI"
                                                checked={selectedUPI === "Other UPI"}
                                                onChange={(e) => setSelectedUPI(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>

                            {/* Submit Button */}
                            <Button type="submit" className="w-100 z_prd_btn">
                                Proceed to Pay
                            </Button>
                        </Form>

                        <hr />

                        {/* Other Options */}
                        <h6 className="fw-bold mb-2">How would you want to pay?</h6>

                        <div className="z_payment_card">
                            <div className="d-flex align-items-center justify-content-between">
                                <div>
                                    <strong>CRED Pay</strong>
                                    <p className="mb-0 small text-muted">
                                        Become a CRED member to enable this
                                    </p>
                                </div>
                                <FaChevronRight />
                            </div>
                        </div>

                        <div className="z_payment_card">
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center gap-2">
                                    <FaCcVisa size={24} color="#1a1a1a" />
                                    <span>Credit/Debit/ATM Card</span>
                                </div>
                                <FaChevronRight />
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
        </section>
    );
}

export default Plans;
