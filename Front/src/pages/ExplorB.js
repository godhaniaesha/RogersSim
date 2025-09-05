import React from "react";
import "../style/x_app.css";

export default function ExplorB() {
  return (
    <section className="explorb-section x_exp container">
      {/* Section Heading */}
      <div className="section-title">
        <h2 className="section-heading">
          Exploring options in international roaming?
        </h2>
        <p className="section-description">
          Check out Jio’s international roaming plans, packed with benefits.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="feature-cards">
        <div className="card">
          <div className="icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 19a1.002 1.002 0 01-.71-.29l-5-5a1.004 1.004 0 111.42-1.42L9 16.59l10.29-10.3a1.004 1.004 0 111.42 1.42l-11 11A1 1 0 019 19z" />
            </svg>
          </div>
          <h3 className="card-title">One-click activation</h3>
        </div>

        <div className="card">
          <div className="icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 17a1 1 0 001-1V6a1 1 0 00-2 0v10a1 1 0 001 1zm-4 0a1 1 0 001-1v-6a1 1 0 00-2 0v6a1 1 0 001 1zm-4 0a1 1 0 001-1v-4a1 1 0 10-2 0v4a1 1 0 001 1zm12-6a1 1 0 00-1 1v4a1 1 0 002 0v-4a1 1 0 00-1-1zm0 8H5V4a1 1 0 00-2 0v16a1 1 0 001 1h16a1 1 0 000-2z" />
            </svg>
          </div>
          <h3 className="card-title">Track usage in real-time</h3>
        </div>

        <div className="card">
          <div className="icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm-1 17.93A8 8 0 014 12a8.12 8.12 0 01.21-1.79L9 15v1a1 1 0 001 1h1v2.93zm7.72-3.61A1 1 0 0018 16h-3v-3a1 1 0 00-1-1H9v-2h2a1 1 0 001-1V7h3V4.59A8 8 0 0120 12a7.91 7.91 0 01-1.28 4.32z" />
            </svg>
          </div>
          <h3 className="card-title">Coverage in 160+ countries</h3>
        </div>

        <div className="card">
          <div className="icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M7.92 5h8.16l.8-1.53A1 1 0 0016 2h-2a1 1 0 00-.68.27L12.5 3l-.82-.76A1 1 0 0011 2H8a1 1 0 00-.88 1.47L7.92 5zm8.26 2H7.82A9.9 9.9 0 004 15c0 .07.09 7 8 7s8-6.93 8-7a9.9 9.9 0 00-3.82-8zm-1.68 6a3 3 0 01-1.11 2.33l1.56.78A1 1 0 0114.5 18a.93.93 0 01-.45-.11l-4-2A1 1 0 0110.5 14h1a1 1 0 100-2h-2a1 1 0 110-2h5a1 1 0 110 2h-.18c.117.32.177.659.18 1z" />
            </svg>
          </div>
          <h3 className="card-title">Low PayGo rates</h3>
        </div>
      </div>
    </section>
  );
}
