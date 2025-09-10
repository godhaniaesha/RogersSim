import React from "react";
import "../style/x_app.css";

export default function Privacy() {
  return (
    <section className="x_info py-5">
      <div className="container">


        <div className="x_info__card p-4 mt-2">
          <header className="x_info__hero text-center mb-3">
            <h1 className="x_info__title">Privacy Policy</h1>
            <p className="x_info__subtitle">Your data, protected and respected.</p>
          </header>
          <div className="px-3 py-3">
            {/* Overview */}
            <h2 className="x_info__h2">1. Overview</h2>
            <p>
              We are committed to protecting your privacy and ensuring transparency in how we handle your personal information.
              This Privacy Policy outlines the types of data we collect, how we use it, the choices you have, and how we keep
              it secure. It applies to all users who access or interact with our website, mobile apps, and services.
            </p>
            <p>
              By using our platform, you consent to the practices described in this policy. If you do not agree with any part of
              it, you should discontinue the use of our services. This policy complies with data protection regulations such as
              the General Data Protection Regulation (GDPR), California Consumer Privacy Act (CCPA), and other applicable laws.
            </p>
            <p>
              We believe in keeping data collection minimal and purposeful. Our guiding principles are:
            </p>
            <ul className="x_info__list">
              <li>We collect only the information we truly need to provide and improve our services.</li>
              <li>We never sell your personal data to third parties.</li>
              <li>We strive for full transparency and give you control over your data.</li>
              <li>We secure your data using industry-standard practices and technologies.</li>
            </ul>
            <p>
              Whether you’re browsing, shopping, or creating an account, your trust is important to us. This document is
              intended to help you understand what data we collect, why we collect it, and how we handle it with care.
            </p>

            {/* What Information We Collect */}
            <h2 className="x_info__h2">2. Information We Collect</h2>
            <ul className="x_info__list">
              <li><strong>Identity Data:</strong> Name, email address, phone number, and other identifying details.</li>
              <li><strong>Account Data:</strong> Login details, purchase history, preferences, and saved addresses.</li>
              <li><strong>Payment Info:</strong> Securely processed by PCI‑compliant payment providers. We never store full card numbers.</li>
              <li><strong>Technical Data:</strong> Device type, IP address, browser type, operating system, and cookies.</li>
              <li><strong>Usage Data:</strong> Pages viewed, features used, time on site, crash logs.</li>
              <li><strong>Support Communications:</strong> Chat history, emails, and help desk messages.</li>
            </ul>

            {/* How We Use Your Data */}
            <h2 className="x_info__h2">3. How We Use Your Data</h2>
            <ul className="x_info__list">
              <li>To create and manage your account</li>
              <li>To process orders, payments, and deliveries</li>
              <li>To personalize user experience and provide relevant content</li>
              <li>To send order updates, billing alerts, or important notifications</li>
              <li>To improve our services and develop new features</li>
              <li>To prevent fraud, enforce our policies, and ensure platform integrity</li>
            </ul>

            {/* Cookies & Tracking */}
            <h2 className="x_info__h2">4. Cookies & Tracking</h2>
            <ul className="x_info__list">
              <li>We use cookies to enhance functionality, remember preferences, and analyze usage patterns.</li>
              <li>Cookies may include session IDs, device info, referral sources, and analytics tags.</li>
              <li>You can disable cookies in your browser settings, but some features may not work as expected.</li>
            </ul>

            {/* Data Sharing */}
            <h2 className="x_info__h2">5. Data Sharing & Disclosure</h2>
            <ul className="x_info__list">
              <li>We do <strong>not</strong> sell your data to third parties.</li>
              <li>We may share data with trusted partners like payment processors, shipping providers, and analytics tools—only as needed.</li>
              <li>All third-party partners must meet strict data protection standards.</li>
              <li>We may disclose information when required by law or for legal compliance.</li>
            </ul>

            {/* Retention & Security */}
            <h2 className="x_info__h2">6. Data Retention & Security</h2>
            <ul className="x_info__list">
              <li>We retain data only as long as necessary for business, legal, or security purposes.</li>
              <li>All data is encrypted in transit and, where possible, at rest.</li>
              <li>We use firewalls, access control, and regular audits to protect your data.</li>
              <li>Role-based access ensures that only authorized staff can view personal data.</li>
            </ul>

            {/* Your Rights */}
            <h2 className="x_info__h2">7. Your Rights & Choices</h2>
            <ul className="x_info__list">
              <li>Access and review your personal information anytime via your account dashboard.</li>
              <li>Request correction of inaccurate or incomplete data.</li>
              <li>Request deletion of your data (subject to legal limitations).</li>
              <li>Download a copy of your data in structured format.</li>
              <li>Unsubscribe from non-essential emails via footer links or account settings.</li>
              <li>If you're a resident of the EU, you have additional rights under GDPR.</li>
            </ul>

            {/* Children's Privacy */}
            <h2 className="x_info__h2">8. Children's Privacy</h2>
            <p>
              Our services are not intended for users under the age of 13 (or 16 where applicable by law).
              We do not knowingly collect personal data from children. If you believe a child has provided us
              with data, please contact us immediately.
            </p>

            {/* International Data Transfers */}
            <h2 className="x_info__h2">9. International Transfers</h2>
            <p>
              Your information may be processed in countries outside of your own. In such cases, we ensure that
              appropriate safeguards are in place, such as standard contractual clauses or data transfer agreements.
            </p>

            {/* Updates to this Policy */}
            <h2 className="x_info__h2">10. Updates to this Policy</h2>
            <ul className="x_info__list">
              <li>We may update this Privacy Policy periodically to reflect changes in law or services.</li>
              <li>You will be notified of major changes via email or in-app messages.</li>
              <li>Continued use of our services indicates your agreement to the updated terms.</li>
            </ul>

            {/* Contact */}
            <h2 className="x_info__h2">11. Contact Us</h2>
            <p className="mb-0">
              If you have any questions, concerns, or requests regarding this Privacy Policy, please contact us at:
              <br />
              <strong>Email:</strong> privacy@rogers.com<br />
              <strong>Phone:</strong> +91-9876543210<br />
              <strong>Address:</strong> Rogers Privacy Office, 123 Internet Lane, Mumbai, Maharashtra 400001, India
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}


