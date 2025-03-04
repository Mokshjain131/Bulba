import React from "react";
import { useState, useEffect } from "react";
import "../styles/testimonial.css";


const Testimonial = () => {
    const [index, setIndex] = useState(0);
    const slides = [
        { title: "\"Absolutely brilliant. A true masterpiece of modern AI.\"", sub: "The Times" },
        { title: "\"This sets a new standard for online experiences.\"", sub: "Forbes" },
        { title: "\"Sleek, intuitive, and game-changing.\"", sub: "TechCrunch" },
        { title: "\"A seamless blend of beauty and functionality.\"", sub: "The Wall Street Journal" }
    ];


    const moveSlide = (offset) => {
        setIndex((prevIndex) => (prevIndex + offset + slides.length) % slides.length);
    };


    useEffect(() => {
        const interval = setInterval(() => moveSlide(1), 3000);
        return () => clearInterval(interval);
    }, []);


    return (
        <div id="CarouselParent">
            <div id="CarouselTestimonial"><h3>What They Say</h3></div>
            <div className="CarouselWrapper">
                <button className="CarouselBtn Prev" onClick={() => moveSlide(-1)}>&#10094;</button>
                <div className="CarouselContainer">
                    <div className="CarouselTrack" style={{ transform: `translateX(-${index * 100}%)` }}>
                        {slides.map((slide, i) => (
                            <div className="CarouselSlide" key={i}>
                                <div className="CarouselTitle">{slide.title}</div>
                                <div className="CarouselSub">{slide.sub}</div>
                            </div>
                        ))}
                    </div>
                </div>
                <button className="CarouselBtn Next" onClick={() => moveSlide(1)}>&#10095;</button>
            </div>
        </div>
    );
};


export default Testimonial;
