import React, { useEffect, useRef } from "react";
import '../styles/index.css';

const IndexTitleSliding = () => {
    const titleRef = useRef(null);
    const cardRef = useRef(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (titleRef.current) {
                titleRef.current.classList.add("slide-in");
            }
            if (cardRef.current) {
                cardRef.current.classList.add("slide-in");
            }
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="index-hero-section">
            <div className="index-hero-content">
                <div className="index-title-area" ref={titleRef}>
                    <h1 className="index-main-title">Realty Lingo</h1>
                    <p className="index-subtitle">Transforming client interactions with intelligent conversation analysis</p>
                </div>
                
                <div className="index-card-area">
                    <div className="index-feature-card-hero" ref={cardRef}>
                        <h3>Smart Communication Assistant</h3>
                        <p>Connect with clients in multiple languages, capture key preferences, and get real-time insights to close more deals.</p>
                        <div className="index-cta-buttons">
                            <a href="/chat" className="index-cta-button index-primary">Start Now</a>
                            <a href="/features" className="index-cta-button index-secondary">Learn More</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IndexTitleSliding;
