import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllPlans } from '../store/slices/planSlice';
import { FaArrowRight, FaMobileAlt, FaSimCard, FaWifi } from 'react-icons/fa';
import AddBus from './AddBus';
import AdAbout from './AdAbout';
import ExplorB from './ExplorB';
import Hero from './Hero';
import NewHero from './NewHero';
import TestSlider from './TestSlider';
import '../style/theme.css'

export default function Home() {

  // Mock data for banners
  const banners = [
    {
      id: 1,
      title: 'New SIM @ ₹199',
      description: 'Get started with our affordable prepaid plans',
      buttonText: 'Buy Now',
      buttonLink: '/products?type=prepaid',
      bgClass: 'bg-primary-custom'
    },
    {
      id: 2,
      title: 'Port-in Special Offer',
      description: 'Switch to Rogers and get 50% off on your first recharge',
      buttonText: 'Port Now',
      buttonLink: '/products?type=port',
      bgClass: 'bg-light-custom'
    },
    {
      id: 3,
      title: 'Unlimited Data Plans',
      description: 'Stream, browse, and game without limits',
      buttonText: 'Explore',
      buttonLink: '/products?type=unlimited',
      bgClass: 'bg-light-custom'
    }
  ];

  // Mock data for SIM categories
  const simCategories = [
    {
      id: 1,
      name: 'Prepaid',
      icon: <FaMobileAlt className="fs-1 mb-3 text-primary-custom" />,
      description: 'Pay as you go with flexible recharge options',
      link: '/products?type=prepaid'
    },
    {
      id: 2,
      name: 'Postpaid',
      icon: <FaSimCard className="fs-1 mb-3 text-primary-custom" />,
      description: 'Premium plans with monthly billing and benefits',
      link: '/products?type=postpaid'
    },
    {
      id: 3,
      name: 'Data Only',
      icon: <FaWifi className="fs-1 mb-3 text-primary-custom" />,
      description: 'High-speed data for your tablet or hotspot',
      link: '/products?type=data'
    },
    {
      id: 4,
      name: 'eSIM',
      icon: <FaSimCard className="fs-1 mb-3 text-primary-custom" />,
      description: 'Digital SIM support for compatible devices',
      link: '/products?type=esim'
    }
  ];

  // Redux: fetch plans
  const dispatch = useDispatch();
  const { plans, loading, error } = useSelector(state => state.plan);

  useEffect(() => {
    dispatch(fetchAllPlans());
  }, [dispatch]);
  return (
    <div className="home-page">

      {/* Rest of the home page content */}
      <div >
        {/* Hero Banner Carousel */}
        {/* <Hero /> */}
        <NewHero></NewHero>
        {/* <TestSlider></TestSlider> */}
        {/* <div id="heroCarousel" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          {banners.map((banner, index) => (
            <div key={banner.id} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
              <div className={`${banner.bgClass} py-5`}>
                <div className="container py-4">
                  <div className="row align-items-center">
                    <div className="col-md-6 text-center text-md-start">
                      <h1 className={`display-4 fw-bold ${banner.bgClass === 'bg-primary-custom' ? 'text-white' : 'text-primary-custom'}`}>
                        {banner.title}
                      </h1>
                      <p className={`lead mb-4 ${banner.bgClass === 'bg-primary-custom' ? 'text-white' : 'text-dark'}`}>
                        {banner.description}
                      </p>
                      <Link to={banner.buttonLink} className={`btn ${banner.bgClass === 'bg-primary-custom' ? 'btn-light' : 'btn-primary'} btn-lg px-4`}>
                        {banner.buttonText} <FaArrowRight className="ms-2" />
                      </Link>
                    </div>
                    <div className="col-md-6 d-none d-md-block text-center">
                      <img
                        src="/logo512.png"
                        alt="Rogers SIM"
                        className="img-fluid"
                        style={{ maxHeight: '300px' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div> */}

        {/* SIM Categories Section */}
        <section className="py-md-5 py-4 bg-light-custom">
          <div className="container">
            <h2 className="text-center mb-md-5 mb-4 fw-bold">Choose Your SIM Type</h2>
            <div className="row g-4">
              {simCategories.map(category => (
                <div key={category.id} className="col-md-6 col-lg-3">
                  <div className="card h-100 border-0 shadow">
                    <div className="card-body text-ce
                    nter p-4">
                      {category.icon}
                      <h4 className="card-title">{category.name}</h4>
                      <p className="card-text text-muted">{category.description}</p>
                      <Link to={category.link} className="btn btn-outline-primary mt-3">
                        Explore <FaArrowRight className="ms-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Exploring banner */}
        <ExplorB></ExplorB>

        {/* Add for About redirect */}
        <AdAbout></AdAbout>

        {/* Popular Plans Section (Dynamic) */}
        <section className="py-md-5 py-4">
          <div className="container">
            <h2 className="text-center mb-md-5 mb-2 fw-bold">Popular Plans</h2>
            {loading ? (
              <div className="text-center py-5">Loading plans...</div>
            ) : error ? (
              <div className="text-center text-danger py-5">{error}</div>
            ) : (
              <div className="row g-4">
                {plans && plans.length > 0 ? (
                  plans.slice(0, 3).map(plan => (
                    <div key={plan._id || plan.id} className="col-md-4">
                      <div className="card h-100 border-0 shadow">
                        <div className="card-header bg-white border-0 pt-md-4 pt-3 pb-0">
                          <h3 className="text-center fw-bold">{plan.name}</h3>
                          <div className="text-center">
                            <span className="h1 fw-bold text-primary-custom">₹{plan.price}</span>
                            <span className="text-muted">/{plan.validity}</span>
                          </div>
                        </div>
                        <div className="card-body">
                          <ul className="list-unstyled">
                            <li className="mb-2"><strong>Data:</strong> {plan.dataLimit}</li>
                            <li className="mb-2"><strong>Speed:</strong> {plan.speed}</li>
                            <li className="mb-2"><strong>Description:</strong> {plan.description}</li>
                            {plan.features && plan.features.length > 0 && (
                              <li className="mb-3">
                                <strong>Features:</strong>
                                <ul className="mt-2">
                                  {plan.features.map((feature, index) => (
                                    <li key={index}>{feature}</li>
                                  ))}
                                </ul>
                              </li>
                            )}
                          </ul>
                        </div>
                        <div className="card-footer bg-white border-0 pb-4">
                          <Link to={`/products/${plan._id || plan.id}`} className="btn btn-primary w-100">
                            Select Plan
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-5">No plans available.</div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Add for 1 million+ */}
        <AddBus></AddBus>

        {/* Buy SIM CTA Section */}
        <section className="py-md-5 py-3 bg-primary-custom">
          <div className="container py-4 text-center">
            <h2 className="text-white mb-4">Ready to Experience Rogers Network?</h2>
            <p className="lead text-white mb-4">Get started with a new SIM card or port your existing number today!</p>
            <Link to="/products" className="btn btn-light btn-lg px-md-5 px-3">
              <span className="fs-md-5 fs-6">Buy SIM Now</span> <FaArrowRight className="ms-2" style={{ fontSize: "16px" }} />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}


