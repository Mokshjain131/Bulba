import React, { useState } from "react";
import "../styles/investorInputSection.css";

function InvestorInputSection({ onPitchGenerated, onReviewReceived, onInvestorMatches }) {
  const [businessIdea, setBusinessIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [pitch, setPitch] = useState(null);
  const [review, setReview] = useState(null);
  const [investorMatches, setInvestorMatches] = useState(null);
  const [inputPitch, setInputPitch] = useState("");

  const generatePitch = async () => {
    if (!businessIdea) {
      console.log("Business idea is empty.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('https://pterodactyl-backend.onrender.com/pitch/generate/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          business_info: businessIdea,
        }),
      });

      const data = await response.json();
      console.log("Response from backend:", data); // Log the response

      if (data.success) {
        // Remove '*' characters using regex
        const cleanedPitch = data.pitch.replace(/\*/g, '');
        setPitch(cleanedPitch);
        onPitchGenerated(cleanedPitch); // Notify parent component
      } else {
        console.error("Failed to generate pitch:", data); // Log failure
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const reviewPitch = async () => {
    if (!inputPitch) return;

    try {
      setLoading(true);
      const response = await fetch('https://pterodactyl-backend.onrender.com/pitch/review/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pitch_content: inputPitch,
          business_info: businessIdea,
        }),
      });

      const data = await response.json();
      console.log("Response from backend:", data); // Log the response

      if (data.success) {
        // Remove '*' characters using regex
        const cleanedReview = data.review.replace(/\*/g, '');
        setReview(cleanedReview);
        onReviewReceived(cleanedReview); // Notify parent component
      } else {
        console.error("Failed to review pitch:", data); // Log failure
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const findInvestors = async () => {
    if (!inputPitch) return;

    try {
      setLoading(true);
      const response = await fetch('https://pterodactyl-backend.onrender.com/match_investors/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pitch_content: inputPitch,
          business_info: businessIdea,
        }),
      });

      const data = await response.json();
      console.log("Response from backend:", data); // Log the response

      if (data.success) {
        // Remove '*' characters using regex
        const cleanedMatches = data.matching_criteria.replace(/\*/g, '');
        setInvestorMatches(cleanedMatches);
        onInvestorMatches(cleanedMatches); // Notify parent component
      } else {
        console.error("Failed to find investors:", data); // Log failure
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="investor-input-container">
      <h4 id="InvestorTitleText">Generating Pitch</h4>
      <div className="input-section">
        <input
          type="text"
          placeholder="Enter your business idea"
          value={businessIdea}
          onChange={(e) => setBusinessIdea(e.target.value)}
          className="business-input"
        />
        <button
          onClick={generatePitch}
          disabled={loading || !businessIdea}
          className="generate-pitch-button"
        >
          {loading ? 'Generating...' : 'Generate Pitch'}
        </button>
      </div>
      <div className="ai-pitch-section">
        {pitch && <p>{pitch}</p>}
      </div>
      <h4 id="InvestorTitleText">Evaluating Pitch</h4>
      <div className="input-pitch-section">
        <div id="inputpitchtext">
        <textarea
          type="text"
          placeholder="Enter your pitch for review and matching"
          value={inputPitch}
          onChange={(e) => setInputPitch(e.target.value)}
          className="input-pitch"
        />
        </div>
        <div className="action-buttons">
          <button
            onClick={reviewPitch}
            disabled={loading || !inputPitch}
            className="review-pitch-button"
          >
            {loading ? 'Reviewing...' : 'Get Expert Review'}
          </button>
          <button
            onClick={findInvestors}
            disabled={loading || !inputPitch}
            className="find-investors-button"
          >
            {loading ? 'Finding...' : 'Find Investors'}
          </button>
        </div>
      </div>
      <div id="PitchReviewFlexer">
        <div className="pitch-review">
          {review && <p>{review}</p>}
        </div>
        <div className="investor-matching">
          {investorMatches && <p>{investorMatches}</p>}
        </div>
      </div>
    </div>
  );
}

export default InvestorInputSection;
