import React, { useState } from "react";
import { Accordion, Container, Row, Col, Form } from "react-bootstrap";
import "../style/d_style.css";

export default function FAQ() {
  const [searchTerm, setSearchTerm] = useState("");

  // All FAQ items
  const faqs = [
    {
      question: "How can I activate my card?",
      answer:
        "To activate your card, log in to your profile, go to Card Activation, and follow the OTP verification process.",
    },
    {
      question: "Can I track my order after checkout?",
      answer:
        "Yes, once your order is confirmed, you can track its status under the Orders section in your account.",
    },
    {
      question: "What should I do if I forget my password?",
      answer:
        "Use the Forgot Password option on the login page to reset your password via your registered email or mobile number.",
    },
    {
      question: "How do I contact customer support?",
      answer:
        "You can reach us via the Help Center page, email us at support@example.com, or call our toll-free number 1800-123-456.",
    },
    {
      question: "What payment methods are supported?",
      answer:
        "We support UPI, Credit/Debit Cards, Net Banking, and popular wallets for secure payments.",
    },
    {
      question: "Can I get a refund for a cancelled order?",
      answer:
        "Yes, refunds are processed within 5-7 business days to your original payment method.",
    },
    {
      question: "Is KYC mandatory for all users?",
      answer:
        "Yes, KYC verification is mandatory to comply with regulatory guidelines and to enjoy uninterrupted services.",
    },
    {
      question: "Can I use my account on multiple devices?",
      answer:
        "Yes, you can log in on multiple devices, but simultaneous usage may be limited for security reasons.",
    },
  ];

  // Filtered FAQs based on search term
  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="d_faq-wrapper">
      {/* Header Section */}
      <div className="d_faq-header py-md-5 py-sm-4 py-3 text-center">
        <Container>
          <h2 className="d_faq-title">Frequently Asked Questions</h2>
          <p className="d_faq-subtitle">
            Find answers to common questions. Still need help? Contact our
            support team.
          </p>
          <Form className="d_faq-search mx-auto mt-4" style={{ maxWidth: "500px" }}>
            <Form.Control
              type="text"
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Form>
        </Container>
      </div>

      {/* FAQ Section */}
      <Container className="py-md-5 py-sm-4 py-3">
        <Row className="justify-content-center">
          <Col lg={8}>
            {filteredFaqs.length > 0 ? (
              <Accordion defaultActiveKey="0" className="d_faq-accordion">
                {filteredFaqs.map((faq, index) => (
                  <Accordion.Item eventKey={index.toString()} key={index}>
                    <Accordion.Header>{faq.question}</Accordion.Header>
                    <Accordion.Body>{faq.answer}</Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            ) : (
              <p className="text-center text-muted">No results found for "{searchTerm}"</p>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}
