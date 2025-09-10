import React from "react";
import "../style/x_app.css";

export default function Privacy() {
  return (
    <section className="x_info py-md-5 py-3 bg-light">
      <div className="container">
        <div className="x_info__card shadow-lg rounded-4 p-md-4 p-3 p-md-5 bg-white">
          {/* Header */}
          <header className="x_info__hero text-center mb-4 ">
            <h1 className="x_info__title fw-bold display-5 text-danger">
              Privacy Policy
            </h1>
            <p className="x_info__subtitle text-muted fs-5">
              Your data, protected and respected.
            </p>
          </header>

          {/* Body */}
          <div className="x_info__body">
            {/* Overview */}
            <section className="mb-4 ">
              <h2 className="x_info__h2 h4 fw-bold text-dark border-bottom pb-2 mb-3">
                1. Overview
              </h2>
              <p>
                We are committed to protecting your privacy and ensuring
                transparency in how we handle your personal information. This
                Privacy Policy outlines the types of data we collect, how we use
                it, the choices you have, and how we keep it secure.
              </p>
              <p>
                By using our platform, you consent to the practices described in
                this policy. If you do not agree with any part of it, you should
                discontinue the use of our services.
              </p>
              <ul className="x_info__list ps-3">
                <li>We collect only the information we truly need.</li>
                <li>We never sell your personal data to third parties.</li>
                <li>We give you full control over your data.</li>
                <li>
                  We secure your data using industry-standard practices and
                  technologies.
                </li>
              </ul>
            </section>

            {/* Information We Collect */}
            <section className="mb-4 ">
              <h2 className="x_info__h2 h4 fw-bold text-dark border-bottom pb-2 mb-3">
                2. Information We Collect
              </h2>
              <ul className="x_info__list ps-3">
                <li>
                  <strong>Identity Data:</strong> Name, email address, phone
                  number.
                </li>
                <li>
                  <strong>Account Data:</strong> Login details, purchase history,
                  preferences.
                </li>
                <li>
                  <strong>Payment Info:</strong> Securely processed, never stored
                  fully.
                </li>
                <li>
                  <strong>Technical Data:</strong> Device type, IP, browser type,
                  OS.
                </li>
                <li>
                  <strong>Usage Data:</strong> Pages viewed, features used, time
                  on site.
                </li>
                <li>
                  <strong>Support:</strong> Chat history, emails, help desk
                  messages.
                </li>
              </ul>
            </section>

            {/* How We Use Your Data */}
            <section className="mb-4 ">
              <h2 className="x_info__h2 h4 fw-bold text-dark border-bottom pb-2 mb-3">
                3. How We Use Your Data
              </h2>
              <ul className="x_info__list ps-3">
                <li>To create and manage your account</li>
                <li>To process orders, payments, and deliveries</li>
                <li>To personalize user experience</li>
                <li>To send order updates & notifications</li>
                <li>To improve services and develop features</li>
                <li>To prevent fraud and ensure platform integrity</li>
              </ul>
            </section>

            {/* Cookies */}
            <section className="mb-4 ">
              <h2 className="x_info__h2 h4 fw-bold text-dark border-bottom pb-2 mb-3">
                4. Cookies & Tracking
              </h2>
              <p>
                We use cookies to enhance functionality, remember preferences,
                and analyze usage. You can disable cookies in your browser, but
                some features may not work properly.
              </p>
            </section>

            {/* Data Sharing */}
            <section className="mb-4 ">
              <h2 className="x_info__h2 h4 fw-bold text-dark border-bottom pb-2 mb-3">
                5. Data Sharing & Disclosure
              </h2>
              <ul className="x_info__list ps-3">
                <li>We never sell your data to third parties.</li>
                <li>
                  Data may be shared with trusted partners (payments, shipping,
                  analytics).
                </li>
                <li>All partners must follow strict data protection standards.</li>
                <li>We may disclose data if required by law.</li>
              </ul>
            </section>

            {/* Security */}
            <section className="mb-4 ">
              <h2 className="x_info__h2 h4 fw-bold text-dark border-bottom pb-2 mb-3">
                6. Data Retention & Security
              </h2>
              <ul className="x_info__list ps-3">
                <li>Data retained only as long as necessary.</li>
                <li>Encrypted in transit and at rest.</li>
                <li>Firewalls, audits, and access control in place.</li>
                <li>Only authorized staff can view sensitive data.</li>
              </ul>
            </section>

            {/* Rights */}
            <section className="mb-4 ">
              <h2 className="x_info__h2 h4 fw-bold text-dark border-bottom pb-2 mb-3">
                7. Your Rights & Choices
              </h2>
              <ul className="x_info__list ps-3">
                <li>Access and review your information anytime.</li>
                <li>Request corrections or deletions.</li>
                <li>Download a copy of your data.</li>
                <li>Unsubscribe from emails.</li>
                <li>GDPR rights for EU residents.</li>
              </ul>
            </section>

            {/* Children */}
            <section className="mb-4 ">
              <h2 className="x_info__h2 h4 fw-bold text-dark border-bottom pb-2 mb-3">
                8. Children’s Privacy
              </h2>
              <p>
                Our services are not intended for children under 13 (or 16
                depending on local law). We do not knowingly collect children’s
                data.
              </p>
            </section>

            {/* International */}
            <section className="mb-4 ">
              <h2 className="x_info__h2 h4 fw-bold text-dark border-bottom pb-2 mb-3">
                9. International Transfers
              </h2>
              <p>
                Your information may be processed outside your country. Safeguards
                like contractual clauses ensure data protection.
              </p>
            </section>

            {/* Updates */}
            <section className="mb-4 ">
              <h2 className="x_info__h2 h4 fw-bold text-dark border-bottom pb-2 mb-3">
                10. Updates to this Policy
              </h2>
              <p>
                This Privacy Policy may be updated periodically. Major updates
                will be communicated via email or in-app notifications.
              </p>
            </section>

            {/* Contact */}
            <section>
              <h2 className="x_info__h2 h4 fw-bold text-dark border-bottom pb-2 mb-3">
                11. Contact Us
              </h2>
              <p className="mb-1">
                If you have any questions, contact us at:
              </p>
              <p className="mb-0">
                <strong>Email:</strong> privacy@rogers.com <br />
                <strong>Phone:</strong> +91-9876543210 <br />
                <strong>Address:</strong> Rogers Privacy Office, 123 Internet
                Lane, Mumbai, Maharashtra 400001, India
              </p>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
}
