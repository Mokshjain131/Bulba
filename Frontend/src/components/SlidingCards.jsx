import React, { useEffect, useRef } from "react";
import '../styles/features.css';

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
        <div id="Features">
            <div className="FeatureContainer">
                {/* Left Side Features */}
                <div id="feature1" className="cardL" ref={(el) => (cardsRef.current[0] = el)}>
                    <div className="cardtitle">AI-Powered Idea Validation</div>
                    <div className="cardtext">Get instant feedback on your startup idea with AI-driven market analysis, competitor insights, and customer demand assessment.</div>
                </div>

                <div id="feature2" className="cardL" ref={(el) => (cardsRef.current[1] = el)}>
                    <div className="cardtitle">Smart Business Strategy</div>
                    <div className="cardtext">Leverage AI-generated strategic advice tailored to your industry, helping you navigate product development, business models, and growth strategies.</div>
                </div>
            </div>

            <br /><br />

            <div className="FeatureContainer">
                {/* Right Side Features */}
                <div id="feature4" className="cardR" ref={(el) => (cardsRef.current[3] = el)}>
                    <div className="cardtitle">AI-Powered Market Research</div>
                    <div className="cardtext">Gain data-driven insights into market trends, customer preferences, and competitor analysis to refine your business strategy.</div>
                </div>

                <div id="feature5" className="cardR" ref={(el) => (cardsRef.current[4] = el)}>
                    <div className="cardtitle">Fundraising & Investor Insights</div>
                    <div className="cardtext">AI helps refine your pitch, generate business plans, and connect with relevant investors.</div>
                </div>

                <div id="feature6" className="cardR" ref={(el) => (cardsRef.current[5] = el)}>
                    <div className="cardtitle">Marketing & Growth Playbook</div>
                    <div className="cardtext">AI suggests data-driven marketing strategies, content plans, and customer engagement tactics.</div>
                </div>
            </div>
        </div>
    );
};

export default SlidingCards;
