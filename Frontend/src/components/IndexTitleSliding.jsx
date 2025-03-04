import React, { useEffect, useRef } from "react";
import '../styles/index.css';

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
                <div id="IndexTitleOpener">
                Real Estate 
                AI
                </div>
                <div id="Index-feature1" className="Index-cardL" ref={(el) => (cardsRef.current[1] = el)}>
                    <div className="Index-cardtitle">Smart Business Strategy</div>
                    <div className="Index-cardtext">Leverage AI-generated strategic advice tailored to your industry, helping you navigate product development, business models, and growth strategies.</div>
                </div>
            </div>

            <br /><br />
        </div>
    );
};

export default IndexTitleSliding;
