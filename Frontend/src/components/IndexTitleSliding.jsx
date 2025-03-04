import React, { useEffect, useRef } from "react";
import '../styles/index.css';

const IndexTitleSliding = () => {
    const cardsRef = useRef([]);
    const titleRef = useRef(null);

    useEffect(() => {
        // Animation for the title
        if (titleRef.current) {
            setTimeout(() => {
                titleRef.current.classList.add("visible");
            }, 300);
        }

        // Animation for the card
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                    }
                });
            },
            { threshold: 0.3 }
        );

        cardsRef.current.forEach((card) => {
            if (card) observer.observe(card);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <div className="hero-section">
            <div className="hero-content">
                <div className="title-area" ref={titleRef}>
                    <h1 className="main-title">Real Estate AI</h1>
                    <p className="subtitle">Transforming client interactions with intelligent conversation analysis</p>
                </div>
                
                <div className="card-area">
                    <div className="feature-card-hero" ref={(el) => (cardsRef.current[0] = el)}>
                        <h3>Smart Communication Assistant</h3>
                        <p>Connect with clients in multiple languages, capture key preferences, and get real-time insights to close more deals.</p>
                        <div className="cta-buttons">
                            <a href="/chat" className="cta-button primary">Start Now</a>
                            <a href="/features" className="cta-button secondary">Learn More</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IndexTitleSliding;
