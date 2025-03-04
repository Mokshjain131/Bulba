import React, { useEffect, useState } from "react";
import "../styles/testimonial.css";

const Testimonial = () => {
  const [isAnimating, setIsAnimating] = useState(false);

  const testimonials = [
    {
      content: "This AI assistant makes multilingual chats effortless! I connect with clients better and close more deals.",
      author: "- Sharon David, Senior Agent"
    },
    {
      content: "No more lost details! Every client's needs are captured, helping me personalize and win their trust.",
      author: "- Aranck Jomraj, Broker"
    },
    {
      content: "With AI-powered reminders and insights, I never miss a follow-up. It's like having a smart assistant!",
      author: "- Moksh Jain, Real Estate Consultant"
    }
  ];

  useEffect(() => {
    const carousel = document.querySelector(".carousel");
    
    const rotateCarousel = () => {
      if (isAnimating) return;
      setIsAnimating(true);
      
      const cards = document.querySelectorAll(".card");

      // Apply transitions with enhanced positioning
      cards[0].style.transform = "translateY(120px) scale(0.85) translateZ(-50px)";
      cards[0].style.opacity = "0.6";
      cards[0].style.zIndex = "2";
      cards[0].style.filter = "blur(1px)";

      cards[1].style.transform = "translateY(-120px) scale(0.85) translateZ(-50px)";
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
        updatedCards[0].style.transform = "translateY(-120px) scale(0.85) translateZ(-50px)";
        updatedCards[0].style.opacity = "0.6";
        updatedCards[0].style.zIndex = "1";
        updatedCards[0].style.filter = "blur(1px)";
        
        updatedCards[1].style.transform = "translateY(0) scale(1) translateZ(0)";
        updatedCards[1].style.opacity = "1";
        updatedCards[1].style.zIndex = "3";
        updatedCards[1].style.filter = "blur(0)";
        
        updatedCards[2].style.transform = "translateY(120px) scale(0.85) translateZ(-50px)";
        updatedCards[2].style.opacity = "0.6";
        updatedCards[2].style.zIndex = "2";
        updatedCards[2].style.filter = "blur(1px)";
        
        setIsAnimating(false);
      }, 800);
    };

    // Set interval for auto-rotation with a slightly longer delay for better readability
    const intervalId = setInterval(rotateCarousel, 4000);

    return () => clearInterval(intervalId);
  }, [isAnimating]);

  return (
    <div className="testimonialwrapper">
      <div className="testimonials-section">
        <div className="testimonials-title">What Our Users Say</div>
        <div className="carousel-container">
          <div className="carousel">
            {testimonials.map((testimonial, index) => (
              <div className="card" key={index}>
                <div className="card-content">"{testimonial.content}"</div>
                <div className="card-author">{testimonial.author}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
