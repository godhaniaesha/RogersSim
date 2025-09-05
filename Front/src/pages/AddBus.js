import React, { useEffect } from 'react';
import "../style/x_app.css"

export default function AddBus() {
  useEffect(() => {
    const container = document.getElementById('marqueeContainer');
    const track = document.getElementById('marqueeTrack');

    function initMarqueeSlider() {
      if (track && track.children.length > 0) {
        track.setAttribute('role', 'list');
        track.setAttribute('aria-label', 'Trusted by these companies');
        Array.from(track.children).forEach((slide) => {
          slide.setAttribute('role', 'listitem');
          slide.setAttribute('tabindex', '0');
        });

        // Clone the logos to loop infinitely
        const slides = [...track.children];
        slides.forEach(slide => {
          const clone = slide.cloneNode(true);
          track.appendChild(clone);
        });

        container.addEventListener('mouseenter', () => {
          track.style.animationPlayState = 'paused';
        });

        container.addEventListener('mouseleave', () => {
          track.style.animationPlayState = 'running';
        });

        let touchTimeout;
        container.addEventListener('touchstart', () => {
          track.style.animationPlayState = 'paused';
          clearTimeout(touchTimeout);
        });
        container.addEventListener('touchend', () => {
          touchTimeout = setTimeout(() => {
            track.style.animationPlayState = 'running';
          }, 6000);
        });
      }
    }

    if (window.innerWidth >= 640) {
      initMarqueeSlider();
    }
  }, []);

  const logos = [
    'https://assets.airtel.in/static-assets/cms/b2b/widgets/partner-logo/BSES.png',
    'https://assets.airtel.in/static-assets/cms/b2b/widgets/partner-logo/FutureGenerali.png',
    'https://assets.airtel.in/static-assets/cms/b2b/widgets/partner-logo/Havells.png',
    'https://assets.airtel.in/static-assets/cms/b2b/widgets/partner-logo/Hero_MotoCorp.png',
    'https://assets.airtel.in/static-assets/cms/b2b/widgets/partner-logo/India_Post_Payments_Bank.png',
    'https://assets.airtel.in/static-assets/cms/b2b/widgets/partner-logo/Mahindra-Electric.png'
  ];

  return (
    <section className="social_proof_logo text-center light-blue-bg">
      <div className="container">
        <h2 className="text-center">
          <p className="p1">
            <span className='str'>1 million+</span> businesses trust Airtel Business
          </p>
        </h2>

        <div className="marquee-container" id="marqueeContainer">
          <div className="logoslider" id="marqueeTrack">
            {logos.concat(logos).map((src, index) => (
              <div className="logo_wrap" key={index}>
                <img src={src} alt={`Logo ${index}`} width="100%" height="100%" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
