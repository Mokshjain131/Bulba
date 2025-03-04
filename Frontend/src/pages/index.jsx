import React, { useState, useEffect } from "react";
import IndexNavbar from "../components/indexnavbar";
import Footer from "../components/footer";
import Testimonial from "../components/testimonial";
import FlippingCard from "../components/FlippingCard";
import IndexSlidingCards from "../components/IndexTitleSliding";
import "../styles/index.css";

function Index() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const section = document.querySelector(".features-preview");
      if (section) {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.75) {
          setIsVisible(true);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Run on mount in case it's already in view

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Function to generate random dots
  const generateDots = () => {
    const dots = [];
    for (let i = 0; i < 50; i++) {
      const style = {
        top: `${Math.random() * 100}vh`,
        left: `${Math.random() * 100}vw`,
        animationDuration: `${5 + Math.random() * 5}s`,
        animationDelay: `${Math.random() * 5}s`
      };
      dots.push(<div className="dot" style={style} key={i}></div>);
    }
    return dots;
  };

  return (
    <div className="index-page">
    <div id="Index-Feature-Nav">
      <IndexNavbar />
      <div className="background-dots">{generateDots()}</div>
      
      <IndexSlidingCards />
      </div>
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

        <section className={`features-preview ${isVisible ? "visible" : ""}`}>
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
