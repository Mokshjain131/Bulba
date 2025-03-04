import React from "react";
import { Link } from "react-router-dom";
import "../styles/flippingcard.css";

const FlippingCard = () => {
  return (
    <div className="full-width-section">
      <div className="strip"></div>
      <div className="content-container">
        {/* Text Section */}
        <div className="text-section">
          <h2>Your Deal Closer!</h2>
          <p>Imagine having a personal assistant that understands every client, speaks their language, 
            and never forgets a detail. Our AI-powered Real Estate Chatbot is your 24/7 multilingual companion, 
            helping you break language barriers, capture key client preferences, and ensure no opportunity slips through the cracks. 
            Whether you're negotiating, following up, or seeking instant insights, this chatbot makes every conversation smarter, faster, 
            and more effective—so you can focus on closing deals, not chasing details!</p>
        </div>

        {/* Card Section */}
        <div className="card-container">
          <div className="flip-card">
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <h4>Conversations made smarter</h4><br/>
                <p>—your AI assistant is just a tap away!</p>
              </div>
              <div className="flip-card-back">
                <p>Your multilingual real estate partner is ready. Let’s chat!</p>
                <Link to="/chat">
                  <button className="flip-button">Start Chat</button>
                </Link>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FlippingCard;
