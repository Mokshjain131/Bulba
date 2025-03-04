import React, { useEffect, useRef } from "react";
import '../styles/IndexTitleSliding.css';

const IndexTitleSliding = () => {
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
        <div id="Index-Features">
            <div className="Index-FeatureContainer">
                {/* Left Side Features */}
                <div id="Index-feature1" className="Index-cardL" ref={(el) => (cardsRef.current[0] = el)}>
                    <div className="Index-cardtitle">AI-Powered Idea Validation</div>
                    <div className="Index-cardtext">Get instant feedback on your startup idea with AI-driven market analysis, competitor insights, and customer demand assessment.</div>
                </div>

                <div id="Index-feature2" className="Index-cardL" ref={(el) => (cardsRef.current[1] = el)}>
                    <div className="Index-cardtitle">Smart Business Strategy</div>
                    <div className="Index-cardtext">Leverage AI-generated strategic advice tailored to your industry, helping you navigate product development, business models, and growth strategies.</div>
                </div>
            </div>

            <br /><br />

            <div className="Index-FeatureContainer">
                {/* Right Side Features */}
                <div id="Index-feature4" className="Index-cardR" ref={(el) => (cardsRef.current[3] = el)}>
                    <div className="Index-cardtitle">AI-Powered Market Research</div>
                    <div className="Index-cardtext">Gain data-driven insights into market trends, customer preferences, and competitor analysis to refine your business strategy.</div>
                </div>

      

                <div id="Index-feature6" className="Index-cardR" ref={(el) => (cardsRef.current[5] = el)}>
                    <div className="Index-cardtitle">Marketing & Growth Playbook</div>
                    <div className="Index-cardtext">AI suggests data-driven marketing strategies, content plans, and customer engagement tactics.</div>
                </div>
            </div>
        </div>
    );
};

export default IndexTitleSliding;
