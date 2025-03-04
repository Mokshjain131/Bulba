import React, { useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import '../styles/features.css';
import { useEffect, useRef } from "react";

const SlidingCards = () => {
    const cardsRef = useRef([]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        entry.target.style.transitionDelay = `${index * 0.2}s`;
                    }
                });
            },
            { threshold: 0.3 }
        );

        cardsRef.current.forEach((card) => observer.observe(card));

        return () => observer.disconnect();
    }, []);

    return (
      <div>
        <Navbar />
        <section className="about-feature">
          <h1>Unlocking Startup Potential</h1>
          <p>AI-powered solutions to guide solo founders from idea to execution.</p>
        </section>
        <div id="Features">
            <div className="FeatureContainer">
                {/* Left Side Features */}
                <div id="feature1" className="cardL" ref={(el) => (cardsRef.current[0] = el)}>
                    <div className="cardtitle">AI-Powered Multilingual Chat & Speech Recognition</div>
                    <div className="cardtext">Agents can communicate seamlessly with clients in multiple languages, including Hindi, Marathi, Telugu, and English. 
                        The assistant uses AI to detect and translate conversations in real time, ensuring smooth communication without language barriers. 
                        It can also handle mixed-language conversations, making interactions more natural and effective.</div>
                </div>

                <div id="feature2" className="cardL" ref={(el) => (cardsRef.current[1] = el)}>
                    <div className="cardtitle">Automated Conversation Insights</div>
                    <div className="cardtext">The assistant captures key details from client conversations, summarizes them, and highlights important preferences. 
                        Letting agents can quickly recall what matters most to each client without manually taking notes.</div>
                </div>
            </div>

            <br /><br />

            <div className="FeatureContainer">
                {/* Right Side Features */}
                <div id="feature4" className="cardR" ref={(el) => (cardsRef.current[3] = el)}>
                    <div className="cardtitle">Smart Follow-Up & Reminders</div>
                    <div className="cardtext">No lead goes cold with automated follow-ups. The assistant schedules reminders based on conversation history and client interest levels. 
                        Agents receive timely notifications to check in with prospects.</div>
                </div>

                <div id="feature5" className="cardR" ref={(el) => (cardsRef.current[4] = el)}>
                    <div className="cardtitle">Real-Time AI Assistance for Negotiations</div>
                    <div className="cardtext">The assistant provides real-time suggestions, such as property options based on client needs, or market trends. 
                        This helps agents handle objections and offer better deals.</div>
                </div>

                <div id="feature6" className="cardR" ref={(el) => (cardsRef.current[5] = el)}>
                    <div className="cardtitle">Seamless CRM Integration & Data Management</div>
                    <div className="cardtext">The tool integrates with existing Customer Relationship Management systems to track client interactions and manage leads efficiently. 
                        This ensures that client information is organized and accessible for future reference.</div>
                </div>
            </div>
        </div>
        <Footer />
      </div>
    );
};

export default SlidingCards;
