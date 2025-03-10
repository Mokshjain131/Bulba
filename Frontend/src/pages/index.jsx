import React, { useState, useEffect } from "react";
import IndexNavbar from "../components/indexnavbar";
import Footer from "../components/footer";
import Testimonial from "../components/testimonial";
import FlippingCard from "../components/FlippingCard";
import IndexTitleSliding from "../components/IndexTitleSliding";
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
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <>
    <div className="index-page">
    <div id="Index-Feature-Nav">
      <IndexNavbar />
      <div className="background-dots">{generateDots()}</div>
      <IndexTitleSliding />
      </div>
      <main>
        <section className={`features-preview ${isVisible ? "visible" : ""}`}>
          <h2>How AI Empowers Your Journey</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Seamless Multilingual Communication</h3>
              <p>AI enables smooth conversations across Hindi, Marathi, Telugu, 
                English, and more, ensuring nothing gets lost in translation.</p>
            </div>
            <div className="feature-card">
              <h3>Smart Conversation Insights</h3>
              <p>AI captures and analyzes key client preferences, 
                helping agents understand buyer needs instantly.</p>
            </div>
            <div className="feature-card">
              <h3>Real-Time Assistance</h3>
              <p>AI suggests responses, provides market insights, 
                and enhances negotiation strategies on the go.</p>
            </div>
          </div>
        </section>

        <FlippingCard />

        <Testimonial />
      </main>
      
    </div>
    <Footer />
    </>
  );
}

export default Index;
