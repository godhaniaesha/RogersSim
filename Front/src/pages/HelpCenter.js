import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import {
  FaSimCard,
  FaMoneyBillWave,
  FaWifi,
  FaUserCircle,
  FaPhoneAlt,
  FaEnvelope,
  FaQuestionCircle,
} from "react-icons/fa";
import "../style/helcenter.css";
import { useNavigate } from "react-router-dom";

export default function HelpCenter() {
    const navigate = useNavigate();

  return (
    <div className="d_help-center">
      {/* Hero Section */}
         <div className="d_help-hero">
        <Container className="text-center">
          <h1 className="d_help-title">Help Center</h1>
          <p className="d_help-subtitle">
            Find quick answers, explore topics, or reach out to our support team.
          </p>
          <Button href="#contact" className="d_btn-primary mt-3">
            <FaQuestionCircle className="me-2" /> Get Support
          </Button>
        </Container>
      </div>

      {/* Quick Links */}
      <Container className="d_section my-4">
        <Row className="justify-content-center g-4">
          {[
            {
              icon: <FaMoneyBillWave />,
              title: "Recharge",
              link: "/recharge",
              text: "Top up your mobile or data plan",
            },
            {
              icon: <FaSimCard />,
              title: "SIM & Activation",
              link: "/profile",
              text: "Get a new SIM or activate",
            },
            {
              icon: <FaWifi />,
              title: "Plans",
              link: "/plans",
              text: "View or change your plan",
            },
            {
              icon: <FaUserCircle />,
              title: "Account",
              link: "/profile",
              text: "Manage your account",
            },
            {
              icon: <FaPhoneAlt />,
              title: "Contact Support",
              link: "/contact",
              text: "Talk to our team",
            },
          ].map((item, idx) => (
            <Col lg={2} md={4} sm={6} key={idx}>
              <Card className="d_help-card text-center">
                <div className="d_help-icon">{item.icon}</div>
                <Card.Body>
                  <Card.Title className="d_card-title">{item.title}</Card.Title>
                  <Card.Text>
                    <a href={item.link} className="d_link">
                      {item.text}
                    </a>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Popular Topics */}
      <Container className="d_section my-md-5 my-2">
        <h2 className="d_section-title">Popular Topics</h2>
        <Row className="g-4">
          <Col md={4}>
            <Card className="d_help-card">
              <Card.Body>
                <Card.Title>
                  <FaQuestionCircle className="me-2" />
                  How do I recharge my SIM?
                </Card.Title>
                <Card.Text>
                  Recharge online from the{" "}
                  <a href="/plans" className="d_link">
                    Plans
                  </a>{" "}
                  page or use our mobile app.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="d_help-card">
              <Card.Body>
                <Card.Title>
                  <FaQuestionCircle className="me-2" />
                  How can I check my data balance?
                </Card.Title>
                <Card.Text>
                  Dial <b>*123#</b> or log in to your account to see your data
                  usage.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="d_help-card">
              <Card.Body>
                <Card.Title>
                  <FaQuestionCircle className="me-2" />
                  Lost your SIM card?
                </Card.Title>
                <Card.Text>
                  Contact support immediately to block your SIM and visit the
                  nearest store.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
             <Col md={4}>
            <Card className="d_help-card">
              <Card.Body>
                <Card.Title>
                  <FaQuestionCircle className="me-2" />
                  How do I recharge my SIM?
                </Card.Title>
                <Card.Text>
                  Recharge online from the{" "}
                  <a href="/plans" className="d_link">
                    Plans
                  </a>{" "}
                  page or use our mobile app.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="d_help-card">
              <Card.Body>
                <Card.Title>
                  <FaQuestionCircle className="me-2" />
                  How can I check my data balance?
                </Card.Title>
                <Card.Text>
                  Dial <b>*123#</b> or log in to your account to see your data
                  usage.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="d_help-card">
              <Card.Body>
                <Card.Title>
                  <FaQuestionCircle className="me-2" />
                  Lost your SIM card?
                </Card.Title>
                <Card.Text>
                  Contact support immediately to block your SIM and visit the
                  nearest store.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Contact Section */}
        <div className="d_help-contact" id="contact">
  <Container>
    <Row className="g-4 align-items-center">
      {/* Contact Info */}
      <Col md={7}>
        <div className="d_contact-info">
          <h3 className="d_contact-title">Still need assistance?</h3>
          <p className="d_text-light">
            Our friendly support team is available 24/7 to help you.
          </p>
          <ul className="d_help-contact-list">
            <li>
              <FaPhoneAlt className="d_contact-icon me-2" />
              <span><b>Call:</b> 1-800-ROGERS</span>
            </li>
            <li>
              <FaEnvelope className="d_contact-icon me-2" />
              <span><b>Email:</b> support@rogers.com</span>
            </li>
            <li>
              <FaQuestionCircle className="d_contact-icon me-2" />
              <span>
                <b>Live Chat:</b>{" "}
                <a href="/chat" className="d_link">Start Chat</a>
              </span>
            </li>
          </ul>
        </div>
      </Col>

      {/* CTA Box */}
      <Col md={5}>
        <div className="d_contact-cta text-center p-md-4 p-3">
          <h5 className="mb-3">Need urgent help?</h5>
          <Button className="d_btn-primary w-100"    onClick={() => navigate("/contact")} >
            <FaPhoneAlt className="me-2" /> Contact Support
          </Button>
        </div>
      </Col>
    </Row>
  </Container>
</div>

    </div>
  );
}
