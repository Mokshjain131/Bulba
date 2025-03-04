import React, { useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import '../styles/cofounder.css';

const CoFounder = () => {
  const features = [
    {
      id: 1,
      title: "24/7 Strategic Support",
      description: "Get instant feedback and advice on your business decisions anytime, anywhere.",
      icon: "🤖"
    },
    {
      id: 2,
      title: "Data-Driven Insights",
      description: "Access market analysis and competitive intelligence powered by AI.",
      icon: "📊"
    },
    {
      id: 3,
      title: "Task Management",
      description: "AI helps prioritize and manage your daily tasks and long-term goals.",
      icon: "✅"
    }
  ];

  const benefits = [
    {
      id: 1,
      title: "Overcome Founder Loneliness",
      description: "Have a reliable partner to bounce ideas off and share your entrepreneurial journey."
    },
    {
      id: 2,
      title: "Make Better Decisions",
      description: "Get objective, data-backed perspectives on crucial business decisions."
    },
    {
      id: 3,
      title: "Scale Efficiently",
      description: "Leverage AI to automate tasks and focus on what matters most."
    }
  ];

  return (
    <div className="cofounder-page">
      <Navbar />
      <main>
        <section className="cofounder-hero">
          <h1>Your AI Co-founder</h1>
          <p>Experience the power of having an intelligent, always-available business partner</p>
          <a href="/chat" className="cta-button">Start Collaborating</a>
        </section>

        <section className="features-section">
          <div className="container">
            <h2>How Your AI Co-founder Helps</h2>
            <div className="features-grid">
              {features.map((feature) => (
                <div key={feature.id} className="feature-card">
                  <div className="feature-icon">{feature.icon}</div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="benefits-section">
          <div className="container">
            <h2>Benefits of an AI Co-founder</h2>
            <div className="benefits-grid">
              {benefits.map((benefit) => (
                <div key={benefit.id} className="benefit-card">
                  <h3>{benefit.title}</h3>
                  <p>{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="demo-section">
          <div className="container">
            <div className="demo-content">
              <h2>See It in Action</h2>
              <p>Experience how an AI co-founder can transform your startup journey</p>
              <div className="demo-buttons">
                <a href="/chat" className="demo-button primary">Try Demo</a>
                <a href="/features" className="demo-button secondary">Learn More</a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CoFounder;
