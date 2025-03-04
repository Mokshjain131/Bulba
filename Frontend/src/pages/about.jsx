import React, { useEffect, useRef } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import "../styles/about.css";

const About = () => {
  const cardsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            entry.target.style.transitionDelay = `${index * 0.15}s`;
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -50px 0px" }
    );

    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="about-page">
      <Navbar />
      
      <section className="about-content">
        <div className="dot-pattern"></div>
        
        <div className="content-intro">
          <h2>How AI Supports Your Journey</h2>
          <p>Discover how our AI solutions help founders at every stage of their startup journey</p>
        </div>
        
        <div className="cards-container">
          <div className="card-left" ref={(el) => (cardsRef.current[0] = el)}>
            <span className="card-number">01</span>
            <div className="card-title">Validation</div>
            <div className="card-text">AI analyzes market trends, evaluates industry demand, and assesses competition to help you validate your business idea. It provides insights based on real-world data, ensuring your idea is viable before investing resources.</div>
          </div>

          <div className="card-right" ref={(el) => (cardsRef.current[1] = el)}>
            <span className="card-number">02</span>
            <div className="card-title">Scaling</div>
            <div className="card-text">Once your business is established, AI assists in scaling by providing growth strategies tailored to your industry. AI-powered analytics help optimize pricing models, expand customer reach, and suggest operational efficiencies.</div>
          </div>

          <div className="card-left" ref={(el) => (cardsRef.current[2] = el)}>
            <span className="card-number">03</span>
            <div className="card-title">Fundraising</div>
            <div className="card-text">AI streamlines your fundraising journey by analyzing successful pitch decks, identifying investor preferences, and crafting compelling proposals. It connects you with potential investors by matching your startup with relevant funding opportunities.</div>
          </div>

          <div className="card-right" ref={(el) => (cardsRef.current[3] = el)}>
            <span className="card-number">04</span>
            <div className="card-title">Strategic Analysis</div>
            <div className="card-text">StartupAI provides data-driven strategic analysis to help solo founders make informed decisions. By leveraging AI-powered insights, it evaluates market trends, competitor strategies, and growth opportunities tailored to your business.</div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default About;



