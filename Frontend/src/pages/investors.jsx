import React, { useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import '../styles/investors.css';
import InvestorInputSection from "../components/InvestorInputSection";

function Investors() {
  const [pitch, setPitch] = useState(null);
  const [review, setReview] = useState(null);
  const [investorMatches, setInvestorMatches] = useState(null);

  const handlePitchGenerated = (generatedPitch) => {
    setPitch(generatedPitch);
  };

  const handleReviewReceived = (receivedReview) => {
    setReview(receivedReview);
  };

  const handleInvestorMatches = (matches) => {
    setInvestorMatches(matches);
  };

  const services = [
    { id: 1, title: "Pitch Deck Review", description: "AI analyzes your pitch deck and provides detailed feedback to make it more compelling." },
    { id: 2, title: "Investor Matching", description: "Get matched with potential investors based on your industry, stage, and funding needs." },
    { id: 3, title: "Pitch Deck Generator", description: "Create a professional pitch deck with AI-powered suggestions and templates." }
  ];

  return (
    <div className="investors-page">
      <Navbar />
      <main>
        <section className="investors-hero">
          <h1>Fundraising & Investor Support</h1>
          <p>AI-powered tools to help you secure funding and connect with the right investors</p>
        </section>
        <InvestorInputSection
          onPitchGenerated={handlePitchGenerated}
          onReviewReceived={handleReviewReceived}
          onInvestorMatches={handleInvestorMatches}
        />
      </main>
      <Footer />
    </div>
  );
}

export default Investors;
