import React, { useState } from "react";
import "../style/x_app.css";
import rech from "../image/rech.png";
import { useNavigate } from "react-router-dom";
const faqData = [
    {
        q: "How to recharge your Rogers prepaid number online?",
        a: (
            <>
                To recharge your prepaid Rogers number online, open this{" "}
                <a
                    href="/recharge"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    link
                </a>
                . After that, simply enter your prepaid mobile number, follow the simple steps to make the payment and successfully complete the recharging process.
            </>
        )
    },
    {
        q: "What if I miss the monthly prepaid recharge due date? Will there be any penalty charges?",
        a: (
            <>
                <p>There is no penalty in case there is a delay in doing the prepaid mobile recharge. The new recharge validity cycle will start from the next recharge date.
                </p> We recommend that you{" "}
                <a
                    href="/recharge"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    recharging online
                </a>{" "}
                in advance to continue enjoying uninterrupted services. Plans recharged in advance shall remain in the queue, without losing the benefits of the current plan.
            </>
        )
    },
    {
        q: "What are some popular Rogers prepaid recharge plans?",
        a: (
            <>
                To find out more about popular Rogers prepaid recharge plans, please open this{" "}
                <a
                    href="/plans"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    link
                </a>
                .
            </>
        )
    },
    {
        q: "How to convert a prepaid number to a postpaid number?",
        a: (
            <>
                Please visit the nearest{" "}
                Rogers store
                to convert your existing Rogers prepaid connection to postpaid.
            </>
        )
    },
    {
        q: "How do I get free delivery of a new SIM card?",
        a: (
            <>
                You can request a Rogers prepaid SIM home delivery by placing the request on the{" "}
                <a href="/products" target="_blank" rel="noopener noreferrer">
                    Get Rogers SIM
                </a>{" "}
                page.
            </>
        )
    }
];

const faqwifi = [
    {
        q: "How to recharge prepaid RogersFiber?",
        a: (
            <>
                <p>Recharging your RogersFiber online is simple and easy. Follow these steps:</p>
                <h4>Using MyRogers:</h4>
                <ul>
                    <li>Open the MyRogers app.</li>
                    <li>Log in with your RogersFiber Service ID or Registered Mobile Number (RMN) and OTP.</li>
                    <li>Click on <b>'Recharge'</b>.</li>
                    <li>Select a plan and click on <b>'Buy'</b> (To view details of the plan, click on 'View details').</li>
                    <li>You will receive a confirmation SMS and email on your registered mobile number and email ID.</li>
                </ul>

                <h4>Using Rogers Website:</h4>
                <ul>
                    <li>Go to <a href="/" className="text-danger" target="_blank" rel="noopener noreferrer">www.rogers.com</a></li>
                    <li>Select <b>'Recharge'</b> in the top right corner and choose <b>'RogersFiber'</b>.</li>
                    <li>Enter your Service ID, RMN, or Landline Number.</li>
                    <li>Click on <b>'Submit'</b>.</li>
                    <li>Select a plan and click on <b>'Buy'</b> (To view details of the plan, click on 'View details').</li>
                    <li>You will receive a confirmation SMS and email on your registered mobile number and email ID.</li>
                </ul>
            </>
        )
    },
    {
        q: "What are some popular RogersFiber prepaid recharge plans?",
        a: (
            <>
                <p>RogersFiber offers several broadband plans tailored to different needs:</p>
                <ul>
                    <li>The ₹399 plan provides speeds up to 30 Mbps with unlimited data and voice calls.</li>
                    <li>The ₹699 plan offers 100 Mbps speed with similar benefits.</li>
                    <li>The ₹999 plan boosts speeds to 150 Mbps and includes a subscription to 14 popular OTT apps along with unlimited data and voice calls.</li>
                </ul>
                <p>
                    These plans cater to a range of internet usage and entertainment preferences.
                    For more details,{" "}
                    <a href="/" className="text-danger" target="_blank" rel="noopener noreferrer">click here</a>{" "}
                    or check the MyRogers app.
                </p>
            </>
        )
    },
    {
        q: "Can I get a RogersFiber service with voice-only service?",
        a: (
            <>
                <p>
                    Voice service is available as an add-on feature with RogersFiber.
                    However, you cannot avail of voice-only service without subscribing to RogersFiber broadband services.
                </p>
            </>
        )
    },
    {
        q: "Do you have both prepaid and postpaid options in RogersFiber services?",
        a: (
            <>
                <p>Yes, RogersFiber offers both prepaid and postpaid plans.</p>
            </>
        )
    },
    {
        q: "What is the current plan/offer in RogersFiber?",
        a: (
            <>
                <p>
                    RogersFiber offers ultra-high-speed internet up to 1 Gbps, accompanied by access to RogersTV+
                    and over 16 premium OTT apps. Additionally, RogersFiber users get access to TV-to-TV video calling,
                    Rogers Security, Home Networking, and many more features.
                </p>
                <p>
                    For detailed information on RogersFiber recharge plans and current offers,{" "}
                    <a href="/" className="text-danger" target="_blank" rel="noopener noreferrer">please click here</a>.
                </p>
            </>
        )
    },
    {
        q: "Do I have to pay a security deposit for RogersFiber services?",
        a: (
            <>
                <p>
                    Yes, you have to pay a security deposit for the Rogers Home Gateway, but don't worry—it is refundable.
                </p>
                <h4>Here’s more details about it:</h4>
                <ul>
                    <li><b>Refundable nature:</b> The security deposit ensures that the Rogers Home Gateway is returned when you discontinue RogersFiber Broadband services.</li>
                    <li><b>Condition of return:</b> To receive the security deposit refund, you must return both the internet box and the set-top box in good working condition.</li>
                    <li><b>Refund process:</b> Refunds are processed through National Electronic Funds Transfer (NEFT) and may take up to 60 days from the date of your surrender.</li>
                </ul>
                <p>
                    This deposit helps ensure that equipment is returned, maintaining the service quality
                    and availability for all RogersFiber customers.
                </p>
            </>
        )
    }
];



export default function Recharge() {
    const [mode, setMode] = useState("rogershome");
    const [openIndex, setOpenIndex] = useState(0); // first panel open by default
    const [number, setNumber] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const value = e.target.value;

        // ✅ allow only numbers
        if (!/^\d*$/.test(value)) return;

        // ✅ update state
        setNumber(value);

        // ✅ validation check
        if (value.length > 10) {
            setError("Number cannot be more than 10 digits");
        } else if (value.length < 10 && value.length > 0) {
            setError("Number must be 10 digits");
        } else {
            setError("");
        }
    };

const handleSubmit = (e) => {
  e.preventDefault();

  // pass the mode in location state
  navigate('/plans', { state: { mode } });
};


    const toggle = (i) => {
        setOpenIndex(prev => (prev === i ? -1 : i));
    };
    return (
        <section className="x_rech py-5">
            <div className="container">
                <div className="row g-4 align-items-center">
                    <div className="col-lg-6">
                        <div className="rech_card p-4 shadow bg-white rounded-3">
                            <div className="text-center mb-3">
                                <div className="rech_icon mb-2"><span className="rech_icon_span">₹</span></div>
                                <h2 className="mb-2">
                                    {mode === "rogershome" ? "Fiber Recharge" : "Mobile Recharge"}
                                </h2>
                                <p className="text-muted mb-0">
                                    Enter your details to find the best prepaid plans.
                                </p>
                            </div>

                            <div className="rech_toggle d-flex gap-2 mb-3" >
                                <button
                                    className={`toggle_btn ${mode === "mobile" ? "active" : ""}`}
                                    onClick={() => setMode("mobile")}
                                    type="button"
                                >
                                    Mobile
                                </button>
                                <button
                                    className={`toggle_btn ${mode === "rogershome" ? "active" : ""}`}
                                    onClick={() => setMode("rogershome")}
                                    type="button"
                                >
                                    Fiber
                                </button>
                            </div>
                            <div style={{borderBottom: "1px solid #ddd" , marginBottom:"10px"}}></div>

                            {/* <div className="mb-4">
                                <label className="form-label small text-muted mb-1">
                                    {mode === "rogershome" ? "Fiber Number" : "Mobile Number"}
                                </label>
                                <input
                                    type="text"
                                    className="form-control form-control-lg rech_input"
                                    placeholder={
                                        mode === "rogershome" ? "Enter RogersFiber number" : "Enter mobile number"
                                    }
                                />
                            </div>

                            <button type="button" className="btn x_rech_btn w-100 py-2 fw-semibold">
                                Continue
                            </button> */}

                            <form >
                                {/* <div className="mb-4">
                                    <label className="form-label small text-muted mb-1">
                                        {mode === "rogershome" ? "Fiber Number" : "Mobile Number"}
                                    </label>
                                    <input
                                        type="text"
                                        value={number}
                                        onChange={handleChange}
                                        maxLength={10} // ✅ restrict typing more than 10 digits
                                        className={`form-control form-control-lg rech_input ${error ? "is-invalid" : ""}`}
                                        placeholder={
                                            mode === "rogershome" ? "Enter RogersFiber number" : "Enter mobile number"
                                        }
                                    />
                                    {error && <div className="invalid-feedback">{error}</div>}
                                </div> */}
                                <button type="submit" className="btn x_rech_btn w-100 py-2 fw-semibold" onClick={handleSubmit}>Continue</button>
                            </form>
                        </div>
                    </div>

                    <div className="col-lg-6">
                        <div className="rech_hero d-flex flex-column flex-md-row align-items-center gap-4">
                            {/* <div className="rech_hero_text">
                <h1 className="display-6 fw-bold mb-2">
                  Plans to redefine your digital life
                </h1>
                <p className="text-muted mb-4">
                  Find a RogersFiber plan that suits your digital aspirations.
                </p>
                <div className="d-flex flex-wrap gap-3">
                  <span className="rech_chip">Data sachets</span>
                  <span className="rech_chip">Budget plans</span>
                  <span className="rech_chip">OTT bundled plans</span>
                  <span className="rech_chip">ISD plans</span>
                </div>
              </div> */}
                            <div className="rech_hero_img m-auto">
                                <img src={rech} className="rech_img_1 rounded-4"></img>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="mt-4">
                    {mode === "rogershome" ? (
                        <section className="X_jds_footerContent">
                            <div className="X_inner">
                                <h2 className="X_heading">Home Recharge Online</h2>

                                <div className="X_body">
                                    <p>
                                        RogersHome offers a superior internet experience to enhance your digital life. Whether
                                        you want to surf the web, study, stream, play games, or work, RogersHome provides the
                                        ultimate broadband experience.
                                    </p>

                                    <p>
                                        Take your digital life to the next level and recharge with one of the RogersHome
                                        broadband plans. To recharge your RogersHome, simply enter your RogersHome number and
                                        click on ‘Continue’. Your RogersHome number can be any of the below-mentioned
                                        details:
                                    </p>

                                    <ul className="X_list">
                                        <li>Registered Mobile Number</li>
                                        <li>RogersHome Voice Number or Fixed Landline Number</li>
                                        <li>Account Number or Service ID (12-digit)</li>
                                    </ul>

                                    <p>
                                        After entering the number and proceeding, you will find various plans applicable
                                        to your number. Choose the plan that best meets your needs. Some popular plans are:
                                    </p>

                                    <ul className="X_plans">
                                        <li>
                                            <strong>Rs. 999 Plan:</strong> Valid for 30 days, this plan offers unlimited data at
                                            150 Mbps speed. It includes free subscriptions to Amazon, Disney+ Hotstar, and
                                            14 more apps.
                                        </li>
                                        <li>
                                            <strong>Rs. 1499 Plan:</strong> Valid for 30 days, this plan offers unlimited data at
                                            300 Mbps speed. It includes free subscriptions to Netflix (Basic), Amazon,
                                            Disney+ Hotstar, and 14 more apps.
                                        </li>
                                    </ul>

                                    <h3 className="X_subheading">Why should you recharge RogersHome?</h3>

                                    <p>The RogersHome broadband service is based on fibre optic technology, which offers:</p>

                                    <ul className="X_features">
                                        <li>
                                            <strong>Faster, reliable &amp; uninterrupted Wi-Fi service:</strong> Enjoy
                                            high-speed internet without interruptions.
                                        </li>
                                        <li>
                                            <strong>Access to premium OTT apps:</strong> Get free subscriptions to popular
                                            streaming services.
                                        </li>
                                        <li>
                                            <strong>Additional features:</strong> Benefit from features such as TV-to-TV
                                            calling, RogersSecurity, Home Networking, and more.
                                        </li>
                                    </ul>

                                    <p className="X_last">
                                        Moreover, RogersHome's <a href="/plans" className="text-danger" target="_blank" rel="noreferrer">broadband recharge plans</a> are affordable and provide
                                        great value for your money. They are designed to meet all your digital needs and
                                        enhance your digital life.
                                    </p>
                                </div>
                            </div>
                        </section>
                    ) : (
                        <section className="X_jds_footerContent">
                            <div className="X_inner">
                                <h2 className="X_heading">Online Mobile Recharge</h2>

                                <div className="X_body">
                                    <div className="x-paragraph">
                                        <p>
                                            To recharge your Rogers number, all you need to do is enter your mobile
                                            phone number and click on continue. You can browse through the
                                            different categories of plan that we offer and select a plan that
                                            best suits your need.
                                        </p>
                                    </div>

                                    <div className="x-paragraph">
                                        <p>
                                            Rogers’s mobile prepaid plans offer best value and come in an affordable
                                            range for all Indians. These plans not just provide high-speed
                                            internet, but also come bundled with a plethora of benefits. Users
                                            can choose from a wide range of prepaid plans for online recharge
                                            including OTT plans, annual plans, International Roaming Plans,
                                            In-flight packs, and a lot more.
                                        </p>
                                    </div>

                                    <div className="x-paragraph">
                                        <p>
                                            Watch live sports on your phone with our OTT plans or stay connected
                                            with your loved ones when you are traveling abroad with International
                                            Roaming or make phone calls at 36,000 ft with In-Flight plans; there
                                            is a Rogers plan for your every calling and data need. You can explore
                                            our{" "}
                                            <a
                                                href="/plans"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="x-link"
                                            >
                                                prepaid recharge plans
                                            </a>
                                            .
                                        </p>
                                    </div>

                                    <div className="x-paragraph x-last">
                                        <p>
                                            Rogers prepaid plans provide complementary access to Rogers apps like
                                            RogersTV, RogersCinema, RogersNews and many more. You can watch 700+ live
                                            channels, 10,000+ movies, listen to over 5Cr songs and catch up on
                                            latest news through these apps.
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </section>
                    )}
                </div>


                <div >
                    {mode === "rogershome" ? (
                        <section className="X_faqContainer j-container">
                            <h2 className="j-heading j-text-heading-l X_heading">FAQ on RogersFiber recharges online</h2>

                            <div className="X_accordion j-accordion" role="tablist" aria-multiselectable="false">
                                {faqwifi.map((item, i) => {
                                    const isOpen = i === openIndex;
                                    return (
                                        <div
                                            key={i}
                                            className={`X_panel j-accordion-panel ${isOpen ? "active" : ""}`}
                                            role="presentation"
                                        >
                                            <div
                                                className={`X_panelHeader j-accordion-panel__header-trigger ${isOpen ? "active" : ""}`}
                                                tabIndex={0}
                                                role="tab"
                                                aria-expanded={isOpen}
                                                onClick={() => toggle(i)}
                                                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") toggle(i); }}
                                            >
                                                <div className="j-accordion-panel__header j-text-list-title j-listBlock align-middle">
                                                    <div className="j-listBlock__main">
                                                        <div className="j-listBlock__block-root">
                                                            <div className="j-listBlock__block j-listBlock__block-titleBlock">
                                                                <div className="j-listBlock__block-text">
                                                                    <h3 className="j-text j-text-body-s-bold X_question">{item.q}</h3>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="j-listBlock__suffix">
                                                            <button
                                                                className={`X_toggleBtn j-button j-button-size__medium tertiary icon-primary icon-only as-span ${isOpen ? "active" : ""}`}
                                                                aria-label={isOpen ? "Collapse" : "Expand"}
                                                            >
                                                                <span className={`X_chev ${isOpen ? "open" : ""}`} aria-hidden="true">
                                                                    {/* simple chevron icon */}
                                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                        <path d="M16 15a.998.998 0 01-.71-.29L12 11.41l-3.29 3.3a1.004 1.004 0 01-1.42-1.42l4-4a.999.999 0 011.42 0l4 4A1.001 1.001 0 0116 15z" fill="currentColor" />
                                                                    </svg>
                                                                </span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div
                                                className="X_panelInner j-accordion-panel__inner"
                                                aria-hidden={!isOpen}
                                                style={{ maxHeight: isOpen ? "1000px" : 0 }}
                                            >
                                                <div className="j-accordion-panel-content j-text-body-xs">
                                                    <div className="X_accContent CustomFAQ_accContent__2cAVh">
                                                        <div>{item.a}</div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="j-Divider_hr_container">
                                                <div className="j-Divider_hr_container__hr" role="separator" />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    ) : (
                        <section className="X_faqContainer j-container">
                            <h2 className="j-heading j-text-heading-l X_heading">FAQ on Rogers recharges online</h2>

                            <div className="X_accordion j-accordion" role="tablist" aria-multiselectable="false">
                                {faqData.map((item, i) => {
                                    const isOpen = i === openIndex;
                                    return (
                                        <div
                                            key={i}
                                            className={`X_panel j-accordion-panel ${isOpen ? "active" : ""}`}
                                            role="presentation"
                                        >
                                            <div className={`X_panelHeader j-accordion-panel__header-trigger ${isOpen ? "active" : ""}`}
                                                tabIndex={0}
                                                role="tab"
                                                aria-expanded={isOpen}
                                                onClick={() => toggle(i)}
                                                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") toggle(i); }}
                                            >
                                                <div className="j-accordion-panel__header j-text-list-title j-listBlock align-middle">
                                                    <div className="j-listBlock__main">
                                                        <div className="j-listBlock__block-root">
                                                            <div className="j-listBlock__block j-listBlock__block-titleBlock">
                                                                <div className="j-listBlock__block-text">
                                                                    <h3 className="j-text j-text-body-s-bold X_question">{item.q}</h3>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="j-listBlock__suffix">
                                                            <button
                                                                className={`X_toggleBtn j-button j-button-size__medium tertiary icon-primary icon-only as-span ${isOpen ? "active" : ""}`}
                                                                aria-label={isOpen ? "Collapse" : "Expand"}
                                                            >
                                                                <span className={`X_chev ${isOpen ? "open" : ""}`} aria-hidden="true">
                                                                    {/* simple chevron icon */}
                                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                        <path d="M16 15a.998.998 0 01-.71-.29L12 11.41l-3.29 3.3a1.004 1.004 0 01-1.42-1.42l4-4a.999.999 0 011.42 0l4 4A1.001 1.001 0 0116 15z" fill="currentColor" />
                                                                    </svg>
                                                                </span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div
                                                className="X_panelInner j-accordion-panel__inner"
                                                aria-hidden={!isOpen}
                                                style={{ maxHeight: isOpen ? "1000px" : 0 }}
                                            >
                                                <div className="j-accordion-panel-content j-text-body-xs">
                                                    <div className="X_accContent CustomFAQ_accContent__2cAVh">
                                                        <div>{item.a}</div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="j-Divider_hr_container">
                                                <div className="j-Divider_hr_container__hr" role="separator" />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    )}



                </div>


            </div>
        </section>
    );
}


