import React, { useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';

export default function Hero() {
  return (
    <div className="x_hero">
      <div className="hero-container">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={0}
          slidesPerView={1}
          navigation={{
            nextEl: '.swiper-button-nex',
            prevEl: '.swiper-button-pre',
          }}
          pagination={{ clickable: true }}
        //   autoplay={{
        //     delay: 5000,
        //     disableOnInteraction: false,
        //   }}
          loop={true}
          className="hero-swiper"
        >
          {/* Slide 1 - JioHome */}
          <SwiperSlide>
            <div className="slide-content slide-1">
              <div className="slide-text">
                <h2>Get ready for non-stop entertainment</h2>
                <p>Book a JioHome with your True 5G number for extra benefits. T&C apply.</p>
                <button className="book-button">Book JioHome</button>
              </div>
              <div className="slide-image">
                <div className="tv-display">
                  <div className="tv-header">
                    <span>Unlimited WiFi</span>
                    <div className="search-bar">
                      <span>Press</span>
                      <span className="mic-icon">🎤</span>
                      <span>to dictate search</span>
                    </div>
                    <div className="tv-icons">
                      <span>🏠</span>
                      <span>⚙️</span>
                      <span>🔍</span>
                      <span>⭐</span>
                      <span>📱</span>
                      <span>🔔</span>
                      <span>8:32</span>
                    </div>
                  </div>
                  <div className="content-row">
                    <div className="movie-poster">Movie 1</div>
                    <div className="movie-poster">Movie 2</div>
                    <div className="movie-poster">Movie 3</div>
                    <div className="movie-poster">Movie 4</div>
                    <div className="movie-poster">Movie 5</div>
                  </div>
                  <div className="app-section">
                    <div className="app-count">
                      <h3>15+</h3>
                      <p>OTT Apps</p>
                    </div>
                    <div className="app-icons">
                      <span className="app-icon">📺</span>
                      <span className="app-icon">🎬</span>
                      <span className="app-icon">🎮</span>
                    </div>
                  </div>
                  <div className="channels-section">
                    <div className="channels-count">
                      <h3>800+</h3>
                      <p>Digital TV Channels</p>
                    </div>
                    <div className="channel-logos">
                      <span className="channel-logo">📺</span>
                      <span className="channel-logo">🎬</span>
                      <span className="channel-logo">🎮</span>
                    </div>
                  </div>
                </div>
                <p className="installation-text">Free installation worth ₹1000</p>
              </div>
            </div>
          </SwiperSlide>
          
          {/* Slide 2 */}
          <SwiperSlide>
            <div className="slide-content slide-2">
              <div className="slide-text">
                <h2>Experience True 5G</h2>
                <p>Upgrade to the fastest network with nationwide coverage</p>
                <button className="book-button">Explore Plans</button>
              </div>
              <div className="slide-image">
                <div className="network-image"></div>
              </div>
            </div>
          </SwiperSlide>
          
          {/* Slide 3 */}
          <SwiperSlide>
            <div className="slide-content slide-3">
              <div className="slide-text">
                <h2>Premium SIM Cards</h2>
                <p>Choose from our wide range of SIM options</p>
                <button className="book-button">Shop Now</button>
              </div>
              {/* <div className="slide-image">
                <div className="sim-image"></div>
              </div> */}
            </div>
          </SwiperSlide>
        </Swiper>
        
        {/* Custom Navigation Buttons */}
        <div className="swiper-button-pre">
          <FaArrowLeft />
        </div>
        <div className="swiper-button-nex">
          <FaArrowRight />
        </div>
        
        {/* Slide Indicator */}
        {/* <div className="slide-indicator">
          <span className="current">1</span>
          <span>/</span>
          <span className="total">3</span>
        </div> */}
      </div>
    </div>
  )
}
