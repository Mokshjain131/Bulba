import React, { useState } from "react";
import { useEffect } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import "../styles/about.css";

const About = () => {
  const [visibleCards, setVisibleCards] = useState([]);

  useEffect(() => {
    const handleScroll = () => {
      const cards = document.querySelectorAll(".support-item");
      const windowHeight = window.innerHeight;

      cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        if (rect.top < windowHeight * 0.75) {
          setVisibleCards((prev) => [...new Set([...prev, index])]);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="about-page">
      <Navbar />
      <main>
        <section className="about-hero">
          <div className="hero-content">
            <h1>Why StartupAI Exists</h1>
            <p>Empowering solo founders with AI-driven support and guidance</p>
          </div>
        </section>

        
        <section className="how-it-works">
          <h2>How AI Supports Your Journey</h2>
            <div className="support-grid">
              {[
                {
                  title: "Validation",
                  content:
                    "AI analyzes market trends, evaluates industry demand, and assesses competition to help you validate your business idea. It provides insights based on real-world data, ensuring your idea is viable before investing resources. You’ll receive risk analysis, feasibility studies, and market-fit assessments powered by AI-driven algorithms.",
                },
                {
                  title: "Scaling",
                  content:
                    "Once your business is established, AI assists in scaling by providing growth strategies tailored to your industry. AI-powered analytics help optimize pricing models, expand customer reach, and suggest operational efficiencies. Whether it’s automating workflows, improving marketing efforts, or identifying new market segments, StartupAI ensures sustainable and data-backed growth.",
                },
                {
                  title: "Fundraising",
                  content:
                    "AI streamlines your fundraising journey by analyzing successful pitch decks, identifying investor preferences, and crafting compelling proposals. It connects you with potential investors by matching your startup with relevant funding opportunities. AI also helps refine financial projections and business plans, making your pitch more persuasive and investment-ready.",
                },
                {
                  title: "Strategic Analysis",
                  content:
                    "StartupAI provides data-driven strategic analysis to help solo founders make informed decisions. By leveraging AI-powered insights, it evaluates market trends, competitor strategies, and growth opportunities tailored to your business. It also suggests optimal pricing models, positioning tactics, and expansion strategies to maximize your startup’s potential.",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className={`support-item ${visibleCards.includes(index) ? "visible" : ""} ${index % 2 === 0 ? "slide-left" : "slide-right"}`}
                >
                  <h3>{item.title}</h3>
                  <p>{item.content}</p>
                </div>
              ))}
            </div>
        
        </section>
        
      </main>
      <Footer />
    </div>
  );
};

export default About;



