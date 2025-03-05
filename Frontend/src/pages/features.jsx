import React, { useEffect, useRef } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import '../styles/features.css';

const SlidingCards = () => {
    const cardsRef = useRef([]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        entry.target.style.transitionDelay = `${index * 0.15}s`;
                    }
                });
            },
            { threshold: 0.2, rootMargin: "0px 0px -50px 0px" }
        );

        cardsRef.current.forEach((card) => {
            if (card) observer.observe(card);
        });

        return () => observer.disconnect();
    }, []);

    const renderIcon = (name) => {
        switch(name) {
            case "multilingual":
                return (
                    <svg className="feature-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.87 15.07L10.33 12.56L10.36 12.53C12.1 10.59 13.34 8.36 14.07 6H17V4H10V2H8V4H1V6H12.17C11.5 7.92 10.44 9.75 9 11.35C8.07 10.32 7.3 9.19 6.69 8H4.69C5.42 9.63 6.42 11.17 7.67 12.56L2.58 17.58L4 19L9 14L12.11 17.11L12.87 15.07ZM18.5 10H16.5L12 22H14L15.12 19H19.87L21 22H23L18.5 10ZM15.88 17L17.5 12.67L19.12 17H15.88Z" fill="#d4af37"/>
                    </svg>
                );
            case "insights":
                return (
                    <svg className="feature-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 21C9 21.55 9.45 22 10 22H14C14.55 22 15 21.55 15 21V20H9V21ZM12 2C8.14 2 5 5.14 5 9C5 11.38 6.19 13.47 8 14.74V17C8 17.55 8.45 18 9 18H15C15.55 18 16 17.55 16 17V14.74C17.81 13.47 19 11.38 19 9C19 5.14 15.86 2 12 2ZM14.85 13.1L14 13.7V16H10V13.7L9.15 13.1C7.8 12.16 7 10.63 7 9C7 6.24 9.24 4 12 4C14.76 4 17 6.24 17 9C17 10.63 16.2 12.16 14.85 13.1Z" fill="#d4af37"/>
                    </svg>
                );
            case "followup":
                return (
                    <svg className="feature-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 3C8.03 3 4 7.03 4 12H1L4.89 15.89L4.96 16.03L9 12H6C6 8.13 9.13 5 13 5C16.87 5 20 8.13 20 12C20 15.87 16.87 19 13 19C11.07 19 9.32 18.21 8.06 16.94L6.64 18.36C8.27 19.99 10.51 21 13 21C17.97 21 22 16.97 22 12C22 7.03 17.97 3 13 3ZM12 8V13L16.28 15.54L17 14.33L13.5 12.25V8H12Z" fill="#d4af37"/>
                    </svg>
                );
            case "negotiation":
                return (
                    <svg className="feature-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21.41 11.58L12.41 2.58C12.05 2.22 11.55 2 11 2H4C2.9 2 2 2.9 2 4V11C2 11.55 2.22 12.05 2.59 12.42L11.59 21.42C11.95 21.78 12.45 22 13 22C13.55 22 14.05 21.78 14.41 21.41L21.41 14.41C21.78 14.05 22 13.55 22 13C22 12.45 21.77 11.94 21.41 11.58ZM5.5 7C4.67 7 4 6.33 4 5.5C4 4.67 4.67 4 5.5 4C6.33 4 7 4.67 7 5.5C7 6.33 6.33 7 5.5 7Z" fill="#d4af37"/>
                    </svg>
                );
            case "crm":
                return (
                    <svg className="feature-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM9 17H7V10H9V17ZM13 17H11V7H13V17ZM17 17H15V13H17V17Z" fill="#d4af37"/>
                    </svg>
                );
            case "analytics":
                return (
                    <svg className="feature-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM9 17H7V10H9V17ZM13 17H11V7H13V17ZM17 17H15V13H17V17Z" fill="#d4af37"/>
                    </svg>
                );
            case "security":
                return (
                    <svg className="feature-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM12 11.99H19C18.47 16.11 15.72 19.78 12 20.93V12H5V6.3L12 3.19V11.99Z" fill="#d4af37"/>
                    </svg>
                );
            default:
                return null;
        }
    };

    return (
      <div>
        <Navbar />
        <section className="about-feature">
          <h1>AI-Powered Real Estate Solutions</h1>
          <p>Transforming client interactions with intelligent conversation analysis and insights</p>
        </section>
        
        <div id="Features">
            <div className="dot-pattern"></div>
            
            <div className="features-intro">
                <h2>Our Innovative Features</h2>
                <p>Discover how our AI assistant transforms the way real estate professionals connect with clients and close deals.</p>
            </div>
            
            <div className="FeatureContainer">
                <div id="feature1" className="cardL" ref={(el) => (cardsRef.current[0] = el)}>
                    {renderIcon("multilingual")}
                    <span className="feature-number">01</span>
                    <div className="cardtitle">AI-Powered Multilingual Chat & Speech Recognition</div>
                    <div className="cardtext">Communicate seamlessly with clients in multiple languages, including Hindi, Marathi, Telugu, and English. Our AI detects and translates conversations in real time, ensuring smooth communication without language barriers. It even handles mixed-language conversations, making interactions more natural and effective.</div>
                </div>
            </div>

            <div className="features-grid">
                <div id="feature2" className="cardL" ref={(el) => (cardsRef.current[1] = el)}>
                    {renderIcon("insights")}
                    <span className="feature-number">02</span>
                    <div className="cardtitle">Automated Conversation Insights</div>
                    <div className="cardtext">Our assistant captures key details from client conversations, summarizes them, and highlights important preferences. Agents can quickly recall what matters most to each client without manually taking notes.</div>
                </div>

                <div id="feature4" className="cardR" ref={(el) => (cardsRef.current[2] = el)}>
                    {renderIcon("followup")}
                    <span className="feature-number">03</span>
                    <div className="cardtitle">Smart Follow-Up & Reminders</div>
                    <div className="cardtext">No lead goes cold with automated follow-ups. The assistant schedules reminders based on conversation history and client interest levels. Agents receive timely notifications to check in with prospects.</div>
                </div>

                <div id="feature5" className="cardR" ref={(el) => (cardsRef.current[3] = el)}>
                    {renderIcon("negotiation")}
                    <span className="feature-number">04</span>
                    <div className="cardtitle">Real-Time AI Assistance for Negotiations</div>
                    <div className="cardtext">Get real-time suggestions, such as property options based on client needs, or market trends. This helps agents handle objections and offer better deals, increasing closing rates.</div>
                </div>

                <div id="feature6" className="cardR" ref={(el) => (cardsRef.current[4] = el)}>
                    {renderIcon("crm")}
                    <span className="feature-number">05</span>
                    <div className="cardtitle">Seamless CRM Integration</div>
                    <div className="cardtext">Integrate with existing Customer Relationship Management systems to track client interactions and manage leads efficiently. Client information stays organized and accessible for future reference.</div>
                </div>

                <div id="feature7" className="cardL" ref={(el) => (cardsRef.current[5] = el)}>
                    {renderIcon("analytics")}
                    <span className="feature-number">06</span>
                    <div className="cardtitle">Advanced Performance Analytics</div>
                    <div className="cardtext">Gain valuable insights into your client interactions with detailed analytics. Track conversation metrics, client engagement levels, and conversion rates to optimize your approach and improve results over time.</div>
                </div>

                <div id="feature8" className="cardR" ref={(el) => (cardsRef.current[6] = el)}>
                    {renderIcon("security")}
                    <span className="feature-number">07</span>
                    <div className="cardtitle">Enterprise-Grade Security</div>
                    <div className="cardtext">Your data is protected with end-to-end encryption and secure cloud storage. Our platform complies with industry standards to ensure client information remains confidential and protected at all times.</div>
                </div>
            </div>
        </div>
        <Footer />
      </div>
    );
};

export default SlidingCards;
