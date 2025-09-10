import React, { useState } from "react";
import "../style/x_app.css";
import { MdPhone } from "react-icons/md";
import { FaWordpress } from "react-icons/fa6";
import { IoMailUnread } from "react-icons/io5";
import { FaMapLocationDot } from "react-icons/fa6";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const onSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section className="x_info py-md-5 py-4">
      <div className="container">
        {/* Hero Section with Background */}
        <div className="text-center mb-md-5 mb-2">
          <h1 className="x_info__title">Get in Touch</h1>
          <p className="x_info__subtitle">
            Need help or have a question? We're always happy to hear from you.
          </p>
        </div>

        {/* Google Map Embed */}
        <div className="mt-md-5 mt-4">
          <h2 className="x_info__h2 mb-3">Visit Us</h2>
          <div
            className="x_info__card p-0 overflow-hidden"
            style={{ height: "350px" }}
          >
            <iframe
              title="Company Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3672.425159741426!2d72.57136221526752!3d23.027742884954074!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e84fddac5d029%3A0x9a1a285ff748e1b7!2sRiver%20View%20Park%2C%20Ahmedabad!5e0!3m2!1sen!2sin!4v1692345678901"
              width="100%"
              height="100%"
              frameBorder="0"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>
        {/* Contact & Message Section */}
        <div className="row g-4 mt-4">
          {/* Contact Info */}
          <div className="col-lg-3 col-md-4 x_info__sim-card p-4 text-center  ">
            <img
              src="/static/media/IMG_4025 (1).fa71cbdc8ef511667415.png"
              alt="Rogers Logo"
              className="sim-logo mb-3"
            />

            {/* Contact Info */}
            <ul className="list-unstyled text-start px-xl-3 px-0 py-2">
              <li className="d-flex align-items-center mb-3">
                <div>
                  <MdPhone fontSize={20} className="me-2" />
                </div>
                <span>+91 99999 99999</span>
              </li>
              <li className="d-flex align-items-center mb-3">
                <div>
                  <FaWordpress fontSize={20} className="me-2" />
                </div>
                <span>support@rogers.com</span>
              </li>
              <li className="d-flex align-items-center mb-3">
                <div>
                  <IoMailUnread fontSize={20} className="me-2" />
                </div>
                <span>www.rogers.com</span>
              </li>
              <li className="d-flex align-items-start">
                <div>
                  <FaMapLocationDot fontSize={20} className="me-2" />
                </div>
                <span>
                  River View Park, Near City Mall, Ahmedabad, Gujarat 380001
                </span>
              </li>
            </ul>
          </div>

          {/* Message Form */}
          <div className="col-lg-9 col-md-8">
            <div className="x_info__card p-4 h-100">
              <h2 className="x_info__h2 mb-3">Send Us a Message</h2>
              {sent ? (
                <div className="alert alert-success mb-0">
                  Thanks! We'll be in touch very soon.
                </div>
              ) : (
                <form onSubmit={onSubmit}>
                  <div className="x_in_block d-flex gap-3">
                    <div className="w-100 mb-3">
                      <label className="form-label">Name</label>
                      <input
                        className="form-control"
                        name="name"
                        value={form.name}
                        onChange={onChange}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div className="w-100 mb-3">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={form.email}
                        onChange={onChange}
                        placeholder="Enter your email address"
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Message</label>
                    <textarea
                      className="form-control"
                      name="message"
                      rows="4"
                      value={form.message}
                      onChange={onChange}
                      placeholder="Type your message here"
                      required
                    />
                  </div>
                  <div className="w-100 text-center">
                    <button className="btn btn-primary mx-auto w-md-25 w-75">
                      Send Message
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
