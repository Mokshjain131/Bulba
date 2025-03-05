import React, { useEffect, useRef } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import "../styles/about.css";

const About = () => {
  const sectionsRef = useRef([]);

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
      { threshold: 0.2 }
    );

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="about-page">
      <Navbar />
      
      <section className="about-hero">
        <div className="about-hero-content" ref={(el) => (sectionsRef.current[0] = el)}>
          <h1>About RealtyLingo</h1>
          <p>Breaking Language Barriers in Real Estate</p>
        </div>
      </section>
      
      <section className="about-content">
        <div className="about-dot-pattern"></div>
        
        <div className="about-story-section" ref={(el) => (sectionsRef.current[1] = el)}>
          <h2>Our Story</h2>
          <p>Founded in 2005, RealtyLingo emerged from a simple observation: the real estate industry was losing valuable connections due to language barriers. Our founders, experienced in both real estate and AI technology, saw an opportunity to bridge this gap and create meaningful conversations between agents and their diverse clientele.</p>
        </div>
        
        <div className="about-mission-section" ref={(el) => (sectionsRef.current[2] = el)}>
          <h2>Our Mission</h2>
          <p>At RealtyLingo, we're committed to transforming real estate communication through innovative AI solutions. We believe that language should never be a barrier to finding the perfect home or closing a deal. Our mission is to empower real estate professionals with tools that make multilingual communication effortless and natural.</p>
        </div>
        
        <div className="about-values-section" ref={(el) => (sectionsRef.current[3] = el)}>
          <h2>Our Values</h2>
          <div className="about-values-grid">
            <div className="about-value-card">
              <h3>Innovation</h3>
              <p>We continuously push the boundaries of AI technology to create solutions that make a real difference in the real estate industry.</p>
            </div>
            
            <div className="about-value-card">
              <h3>Inclusivity</h3>
              <p>We believe in creating tools that make real estate accessible to everyone, regardless of their native language or cultural background.</p>
            </div>
            
            <div className="about-value-card">
              <h3>Excellence</h3>
              <p>We're committed to delivering the highest quality AI solutions that our clients can rely on for their most important conversations.</p>
            </div>
          </div>
        </div>
        
        <div className="about-impact-section" ref={(el) => (sectionsRef.current[4] = el)}>
          <h2>Our Impact</h2>
          <div className="about-impact-stats">
            <div className="about-stat-card">
              <span className="about-stat-number">50+</span>
              <span className="about-stat-label">Languages Supported</span>
            </div>
            <div className="about-stat-card">
              <span className="about-stat-number">1000+</span>
              <span className="about-stat-label">Real Estate Agents</span>
            </div>
            <div className="about-stat-card">
              <span className="about-stat-number">50K+</span>
              <span className="about-stat-label">Conversations Facilitated</span>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default About;



