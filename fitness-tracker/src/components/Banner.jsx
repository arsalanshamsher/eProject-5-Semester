import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import SignupModal from "./SignupModal"; // import modal

const Banner = () => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <section id="banner" className="banner">
      <div className="overlay">
        <div className="banner-content" data-aos="fade-up">
          <h1>Track Your Fitness Journey</h1>
          <p>
            Unlock your potential with personalized workout plans, nutrition tracking, and real-time progress analytics.
          </p>
          <button className="btn-signup" onClick={() => setShowModal(true)}>
            Get Started
          </button>
        </div>
      </div>

      <SignupModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </section>
  );
};

export default Banner;
