import React, { useEffect } from "react";
import "../styles/testimonial.css";

const Testimonial = () => {
  useEffect(() => {
    const carousel = document.querySelector(".carousel");

    const rotateCarousel = () => {
      const cards = document.querySelectorAll(".card");

      // Apply transitions and adjust positions for each card
      const firstCard = cards[0];
      const secondCard = cards[1];
      const thirdCard = cards[2];

      firstCard.style.transform = "translateY(100px) scale(0.85)";
      firstCard.style.opacity = "0.5";
      firstCard.style.zIndex = "2";

      secondCard.style.transform = "translateY(-100px) scale(0.85)";
      secondCard.style.opacity = "0.5";
      secondCard.style.zIndex = "1";

      thirdCard.style.transform = "translateY(0px) scale(1)";
      thirdCard.style.opacity = "1";
      thirdCard.style.zIndex = "3";

      // After the transition, move the first card to the end of the stack
      setTimeout(() => {
        carousel.appendChild(firstCard);
        // Re-select the updated cards
        const updatedCards = document.querySelectorAll(".card");
        updatedCards[0].style.transform = "translateY(100px) scale(0.85)";
        updatedCards[0].style.opacity = "0.5";
        updatedCards[0].style.zIndex = "2";
        updatedCards[1].style.transform = "translateY(0px) scale(1)";
        updatedCards[1].style.opacity = "1";
        updatedCards[1].style.zIndex = "3";
        updatedCards[2].style.transform = "translateY(-100px) scale(0.85)";
        updatedCards[2].style.opacity = "0.5";
        updatedCards[2].style.zIndex = "1";
      }, 1000); // Delay before reordering (increased for smoother feel)

    };

    // Set interval to auto-rotate every 1.5 seconds
    const intervalId = setInterval(rotateCarousel, 1500);

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, []);

  return (
    <div className="testimonialwrapper">
    <div className="testimonials-section">
      <div className="testimonials-title">Testimonials</div>
      <div className="carousel-container">
        <div className="carousel">
          <div className="card">"Amazing experience!"</div>
          <div className="card">"Best service ever!"</div>
          <div className="card">"Would recommend 100%"</div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Testimonial;
