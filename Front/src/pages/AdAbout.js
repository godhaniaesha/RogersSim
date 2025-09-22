import React from 'react';
import "../style/x_app.css";
import { useNavigate } from 'react-router-dom';

export default function AdAbout() {
  const navigate = useNavigate();
  const requestACall = () => {
    navigate('/contact');
    // Add your callback request logic here (
    // e.g. open modal, navigate, etc.)
    console.log("Let’s Talk Business clicked");
  };

  return (
    <section className="b2b_contact_section">
      <div className="contact_inner_wrapper my-3 mb-4">
        <div className="container">
          <div className="content">
            <div className="contact_left">
              <h4>
                Need <span className='str'>more information</span> about Rogers Business solutions?
              </h4>

              <button
                className="btn Click-here"
                id="lead-form-wp"
                onClick={requestACall}
              >
                Let’s Talk Business
              </button>
            </div>
          </div>
        </div>

        <figure>
          <img
            width="100%"
            height="100%"
            src="https://assets.airtel.in/static-assets/cms/b2b/widgets/image/d_Contact_Us.png"
            alt="contact us"
            className="contact_us_bg"
          />
        </figure>
      </div>
    </section>
  );
}

