import React from "react";
import "../style/x_app.css";

export default function About() {
  return (
    <section className="x_info py-5">
      <div className="container">
        <header className="x_info__hero text-center">
          <h1 className="x_info__title">About Rogers</h1>
          <p className="x_info__subtitle">
            We help you stay connected with fast, reliable connectivity and easy online experiences.
          </p>
        </header>

        {/* Story + Offerings */}
        <div className="row g-4 align-items-start x_info__grid mt-2">
          <div className="col-lg-6">
            <div className="x_info__card p-4 h-100">
              <h2 className="x_info__h2">Our mission</h2>
              <p>
                Deliver delightful, affordable connectivity and services with a simple digital journey. Our
                products are designed for performance, transparency, and value.
              </p>
              <ul className="x_info__list">
                <li>Customer-first design</li>
                <li>Secure and scalable platform</li>
                <li>Responsive support</li>
              </ul>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="x_info__card p-4 h-100">
              <h2 className="x_info__h2">What we offer</h2>
              <ul className="x_info__list">
                <li>Prepaid and postpaid SIM connections</li>
                <li>High-speed fiber broadband</li>
                <li>Value-packed plans with OTT benefits</li>
                <li>Seamless online purchase, recharge, and support</li>
              </ul>
              <p className="mb-0">
                Explore our latest plans under the Plans section and manage everything from your profile.
              </p>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="row g-4 mt-2">
          <div className="col-lg-4">
            <div className="x_info__card p-4 h-100 text-center">
              <h3 className="x_info__h3 mb-2">Reliability</h3>
              <p className="mb-0">99.9% uptime architecture, proactive monitoring, and redundancy at every layer.</p>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="x_info__card p-4 h-100 text-center">
              <h3 className="x_info__h3 mb-2">Simplicity</h3>
              <p className="mb-0">Clear plans, transparent pricing, and a checkout built for speed.</p>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="x_info__card p-4 h-100 text-center">
              <h3 className="x_info__h3 mb-2">Security</h3>
              <p className="mb-0">Modern encryption, strict access controls, and regular audits keep data safe.</p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="row g-4 mt-2">
          <div className="col-12">
            <div className="x_info__card p-4">
              <h2 className="x_info__h2">Our journey</h2>
              <ul className="x_info__list mb-0">
                <li><strong>2019</strong> — Started with a small team and a bold idea.</li>
                <li><strong>2021</strong> — Launched broadband and expanded to multiple cities.</li>
                <li><strong>2023</strong> — Reached 1M+ customers with industry‑leading uptime.</li>
                <li><strong>Today</strong> — Building the most loved digital-first telecom experience.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="row g-4 mt-2 align-items-stretch">
          {["AK", "MS", "RJ"].map((initials, idx) => (
            <div className="col-md-4" key={idx}>
              <div className="x_info__card p-4 h-100 text-center">
                <div
                  className="mx-auto mb-3"
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: 999,
                    background: "#f3f4f7",
                    color: "#111",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700
                  }}
                >
                  {initials}
                </div>
                <h3 className="x_info__h3 mb-1">{idx === 0 ? "Aesha K." : idx === 1 ? "Mehul S." : "Riya J."}</h3>
                <p className="mb-0">{idx === 0 ? "Founder & Product" : idx === 1 ? "Engineering" : "Customer Success"}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="x_info__band mt-5">
          <div className="x_info__stats container">
            <div className="x_info__stat"><span>99.9%</span><small>Uptime</small></div>
            <div className="x_info__stat"><span>24x7</span><small>Support</small></div>
            <div className="x_info__stat"><span>1M+</span><small>Users served</small></div>
          </div>
        </div>
      </div>
    </section>
  );
}


