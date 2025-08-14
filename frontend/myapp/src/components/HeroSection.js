import React from 'react';

const HeroSection = () => {
  return (
    <section className="hero">
      <div className="container">
        <h1>Welcome to Shophora</h1>
        <p>Discover premium products at incredible prices</p>
        <div className="hero-buttons">
          <button className="nav-button btn-primary">
            Shop Now
          </button>
          <button className="nav-button btn-secondary">
            Today's Deals
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 