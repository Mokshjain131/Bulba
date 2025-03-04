import React, { useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import '../styles/features.css';
import { useEffect, useRef } from "react";

const featuresLeft = [
    {
        title: "AI-Powered Idea Validation",
        text: "Get instant feedback on your startup idea with AI-driven market analysis, competitor insights, and customer demand assessment."
    },
    {
        title: "Smart Business Strategy",
        text: "Leverage AI-generated strategic advice tailored to your industry, helping you navigate product development, business models, and growth strategies."
    },
    {
        title: "Product Development Support",
        text: "From MVP planning to feature prioritization, AI assists with technical decision-making, no-code/low-code solutions, and development roadmaps."
    }
];

const featuresRight = [
    { title: "AI-Powered Market Research", text: "Gain data-driven insights into market trends, customer preferences, and competitor analysis to refine your business strategy." },
    { title: "Fundraising & Investor Insights", text: "AI helps refine your pitch, generate business plans, and connect with relevant investors." },
    { title: "Marketing & Growth Playbook", text: "AI suggests data-driven marketing strategies, content plans, and customer engagement tactics." }
];

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
                {featuresLeft.map((feature, index) => (
                    <div key={index} className="cardL" ref={(el) => (cardsRef.current[index] = el)}>
                        <div className="cardtitle">{feature.title}</div>
                        <div className="cardtext">{feature.text}</div>
                    </div>
                ))}
            </div>

            <br /><br />

            <div className="FeatureContainer">
                {featuresRight.map((feature, index) => (
                    <div key={index} className="cardR" ref={(el) => (cardsRef.current[index + featuresLeft.length] = el)}>
                        <div className="cardtitle">{feature.title}</div>
                        <div className="cardtext">{feature.text}</div>
                    </div>
                ))}
            </div>
        </div>
        <Footer />
      </div>
    );
};

export default SlidingCards;
