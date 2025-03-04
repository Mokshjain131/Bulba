import React, { useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import '../styles/contact.css';

function Contact() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
  };

  return (
    <div className="contact-page">
      <Navbar />
      <main>
        <section className="contact-hero">
          <h1>Get in Touch</h1>
          <p>Have questions? We&apos;re here to help you succeed.</p>
        </section>

        <section className="contact-content">
          <div className="container">
            <div className="contact-grid">
              <div className="contact-form-container">
                <h2>Find Us</h2>
                <center>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.969905363581!2d72.83472147520622!3d19.108976132102352!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c9b888ae67fd%3A0xe0b9538d623ac5d2!2sMukesh%20Patel%20School%20of%20Technology%20Management%20%26%20Engineering%2C%20Mumbai!5e0!3m2!1sen!2sin!4v1739656725307!5m2!1sen!2sin"
                  width="540"
                  height="400"
                  style={{
                    border: "0",
                    borderRadius: "8px",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3), 0px 6px 20px rgba(255, 255, 255, 0.1)"
                  }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
                </center>
              </div>

              <div className="contact-info">
                <h2>Contact Information</h2>
                <div className="info-items">
                  <div className="info-item">
                    <div>
                      <h3>Email</h3>
                      <p>support@startupai.com</p>
                    </div>
                  </div>
                  
                  <div className="info-item">
                    <div>
                      <h3>Phone</h3>
                      <p>(555) 123-4567</p>
                    </div>
                  </div>
                  
                  <div className="info-item">
                    <div>
                      <h3>Hours</h3>
                      <p>Monday - Friday: 9AM - 6PM</p>
                      <p>Weekend: 10AM - 4PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default Contact;




