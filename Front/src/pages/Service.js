import React from "react";
import "../style/x_app.css";

export default function Service() {
  return (
    <section className="x_info py-5">
      <div className="container">


        <div className="x_info__card p-4 mt-2">
          <header className="x_info__hero text-center mb-3">
            <h1 className="x_info__title">Terms of Service</h1>
            <p className="x_info__subtitle">Simple terms to ensure fair and secure usage.</p>
          </header>
          <div className="px-3 py-3">
            {/* Section: Your Account */}
            <h2 className="x_info__h2">1. Your Account</h2>
            <ul className="x_info__list">
              <li>You must be at least 18 years old to register for an account.</li>
              <li>Keep your login credentials secure and do not share them with others.</li>
              <li>You are responsible for all activities that occur under your account.</li>
              <li>Notify us immediately of any unauthorized use of your account.</li>
            </ul>

            {/* Section: Acceptable Use */}
            <h2 className="x_info__h2">2. Acceptable Use</h2>
            <ul className="x_info__list">
              <li>You agree not to misuse the services provided.</li>
              <li>No illegal, harmful, or offensive content or conduct is allowed.</li>
              <li>No spamming, phishing, or distribution of malware is permitted.</li>
              <li>Respect intellectual property rights and data privacy laws.</li>
            </ul>

            {/* Section: Payment & Billing */}
            <h2 className="x_info__h2">3. Billing & Cancellations</h2>
            <ul className="x_info__list">
              <li>All payments are processed securely through authorized gateways.</li>
              <li>Once activated, plans are non-refundable unless stated otherwise.</li>
              <li>You may cancel or change your subscription from your account dashboard.</li>
              <li>Failure to pay may result in suspension or termination of services.</li>
            </ul>

            {/* Section: Network Fair-Usage */}
            <h2 className="x_info__h2">4. Network Fair-Usage</h2>
            <p>
              To maintain high service quality for all users, we implement fair-usage policies. These may include:
            </p>
            <ul className="x_info__list">
              <li>Rate limiting during peak usage hours.</li>
              <li>Traffic shaping for excessive bandwidth consumption.</li>
              <li>Usage caps for selected plan types, as stated on the pricing page.</li>
            </ul>

            {/* Section: Data Privacy */}
            <h2 className="x_info__h2">5. Data Privacy</h2>
            <ul className="x_info__list">
              <li>Your data is stored securely and handled in accordance with our Privacy Policy.</li>
              <li>We do not sell or share personal data without explicit user consent.</li>
              <li>You have the right to request access or deletion of your data at any time.</li>
            </ul>

            {/* Section: Intellectual Property */}
            <h2 className="x_info__h2">6. Intellectual Property</h2>
            <ul className="x_info__list">
              <li>All content and software provided are the intellectual property of the company or its licensors.</li>
              <li>You may not copy, modify, distribute, or reverse engineer any part of the service.</li>
              <li>User-generated content remains your property, but you grant us a license to use it for service delivery.</li>
            </ul>

            {/* Section: Termination */}
            <h2 className="x_info__h2">7. Termination</h2>
            <ul className="x_info__list">
              <li>We may suspend or terminate your access for violation of these terms or applicable laws.</li>
              <li>You may terminate your account at any time through the dashboard.</li>
              <li>Upon termination, your access will be revoked, and associated data may be deleted.</li>
            </ul>

            {/* Section: Support */}
            <h2 className="x_info__h2">8. Support & Escalation</h2>
            <ul className="x_info__list">
              <li>Support is available via email, chat, and ticketing system 24×7.</li>
              <li>Response time may vary depending on issue severity and support plan.</li>
              <li>For critical issues, escalation is available upon request.</li>
            </ul>

            {/* Section: Liability */}
            <h2 className="x_info__h2">9. Limitation of Liability</h2>
            <p>
              Services are provided on an “as-is” and “as-available” basis. To the maximum extent allowed by law, we
              disclaim all warranties and shall not be liable for indirect, incidental, or consequential damages.
            </p>
            <p>
              Our total liability in connection with any claim arising from the service shall not exceed the amount
              paid by you during the current billing cycle.
            </p>

            {/* Section: Updates to Terms */}
            <h2 className="x_info__h2">10. Updates to Terms</h2>
            <ul className="x_info__list">
              <li>We may revise these terms at any time with reasonable notice.</li>
              <li>Continued use of our service indicates acceptance of the updated terms.</li>
              <li>It is your responsibility to review the terms periodically.</li>
            </ul>

            {/* Section: Contact */}
            <h2 className="x_info__h2">11. Contact</h2>
            <p>
              If you have any questions about these Terms of Service, please contact our support team at:
              <br />
              <strong>Email:</strong> support@example.com
              <br />
              <strong>Phone:</strong> +91-9876543210
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}


