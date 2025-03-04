import React, { useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import Testimonial from "../components/testimonial";
import FlippingCard from "../components/FlippingCard";
import '../styles/index.css';

function Index() {
  return (
    <div className="home">
      <Navbar />
      <main>
        <section className="hero">
          <div className="hero-content">
            <h1>Your AI Co-Founder: Smart Support for Solo Entrepreneurs</h1>
            <p>Validate your business ideas, get strategic advice, and connect with investors—all powered by AI.</p>
            <div className="cta-buttons">
              <a href="/chat" className="cta-button primary">Start Now</a>
              <a href="/features" className="cta-button secondary">See How It Works</a>
            </div>
          </div>
        </section>
        
        <section className="features-preview">
          <h2>How AI Empowers Your Journey</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Idea Validation</h3>
              <p>AI-powered market analysis and feasibility testing</p>
            </div>
            <div className="feature-card">
              <h3>Strategic Planning</h3>
              <p>Get data-driven insights for business growth</p>
            </div>
            <div className="feature-card">
              <h3>Investor Connect</h3>
              <p>AI-assisted pitch deck creation and investor matching</p>
            </div>
          </div>
        </section>

        <FlippingCard />
        
        <Testimonial />
      </main>
      <Footer />
    </div>
  );
}

export default Index;




