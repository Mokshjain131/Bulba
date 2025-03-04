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
          <h2>This is an AI Bot</h2>
          <p>It provides guidance, strategic insights, and smart business advice.</p>
        </div>

        {/* Card Section */}
        <div className="card-container">
          <div className="flip-card">
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <h4>AI-Powered Assistance</h4><br/>
                <p>Struggling to build your startup alone? We've got your back.</p>
              </div>
              <div className="flip-card-back">
                <h4>Chat with Your AI Advisor</h4><br/>
                <p>Instant guidance, smart strategies, and growth insights.</p>
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
