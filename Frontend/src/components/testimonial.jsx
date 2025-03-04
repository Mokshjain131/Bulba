import React, { useEffect, useState } from "react";
import "../styles/testimonial.css";

const Testimonial = () => {
  const [isAnimating, setIsAnimating] = useState(false);

  const testimonials = [
    {
      content: "This AI assistant makes multilingual chats effortless! I connect with clients better and close more deals than ever before.",
      author: "- Sharon David, Senior Agent",
      number: "01"
    },
    {
      content: "No more lost details! Every client's needs are captured, helping me personalize my approach and win their trust.",
      author: "- Aranck Jomraj, Broker",
      number: "02"
    },
    {
      content: "With AI-powered reminders and insights, I never miss a follow-up. It's like having a smart assistant by my side!",
      author: "- Moksh Jain, Real Estate Consultant",
      number: "03"
    }
  ];

  useEffect(() => {
    const carousel = document.querySelector(".carousel");
    
    const rotateCarousel = () => {
      if (isAnimating) return;
      setIsAnimating(true);
      
      const cards = document.querySelectorAll(".card");

      // Apply transitions with enhanced positioning
      cards[0].style.transform = "translateY(100px) scale(0.85) translateZ(-50px)";
      cards[0].style.opacity = "0.6";
      cards[0].style.zIndex = "2";
      cards[0].style.filter = "blur(1px)";

      cards[1].style.transform = "translateY(-100px) scale(0.85) translateZ(-50px)";
      cards[1].style.opacity = "0.6";
      cards[1].style.zIndex = "1";
      cards[1].style.filter = "blur(1px)";

      cards[2].style.transform = "translateY(0) scale(1) translateZ(0)";
      cards[2].style.opacity = "1";
      cards[2].style.zIndex = "3";
      cards[2].style.filter = "blur(0)";

      // After the transition, move the first card to the end
      setTimeout(() => {
        carousel.appendChild(cards[0]);
        
        // Reset positions for the new order
        const updatedCards = document.querySelectorAll(".card");
        updatedCards[0].style.transform = "translateY(-100px) scale(0.85) translateZ(-50px)";
        updatedCards[0].style.opacity = "0.6";
        updatedCards[0].style.zIndex = "1";
        updatedCards[0].style.filter = "blur(1px)";
        
        updatedCards[1].style.transform = "translateY(0) scale(1) translateZ(0)";
        updatedCards[1].style.opacity = "1";
        updatedCards[1].style.zIndex = "3";
        updatedCards[1].style.filter = "blur(0)";
        
        updatedCards[2].style.transform = "translateY(100px) scale(0.85) translateZ(-50px)";
        updatedCards[2].style.opacity = "0.6";
        updatedCards[2].style.zIndex = "2";
        updatedCards[2].style.filter = "blur(1px)";
        
        setIsAnimating(false);
      }, 800);
    };

    // Set interval for auto-rotation with a slightly longer delay for better readability
    const intervalId = setInterval(rotateCarousel, 5000);

    return () => clearInterval(intervalId);
  }, [isAnimating]);

  // Quote icon SVG
  const QuoteIcon = () => (
    <svg className="quote-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.5 10C7.3 10 8 9.3 8 8.5C8 7.7 7.3 7 6.5 7C5.7 7 5 7.7 5 8.5C5 9.3 5.7 10 6.5 10ZM6.5 10C3.46 10 1 12.46 1 15.5V18H12V15.5C12 12.46 9.54 10 6.5 10ZM17.5 10C18.3 10 19 9.3 19 8.5C19 7.7 18.3 7 17.5 7C16.7 7 16 7.7 16 8.5C16 9.3 16.7 10 17.5 10ZM17.5 10C14.46 10 12 12.46 12 15.5V18H23V15.5C23 12.46 20.54 10 17.5 10Z" fill="currentColor"/>
    </svg>
  );

  return (
    <div className="testimonialwrapper">
      <div className="testimonials-section">
        <div className="testimonials-title">What Our Users Say</div>
        <div className="testimonials-intro">
          <p>Hear from real estate professionals who have transformed their business with our AI assistant</p>
        </div>
        <div className="carousel-container">
          <div className="carousel">
            {testimonials.map((testimonial, index) => (
              <div className="card" key={index}>
                <QuoteIcon />
                <div className="card-content">"{testimonial.content}"</div>
                <div className="card-author">{testimonial.author}</div>
                <span className="testimonial-number">{testimonial.number}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
