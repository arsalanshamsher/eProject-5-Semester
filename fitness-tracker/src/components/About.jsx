import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const About = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <section id="about" className="about-section" data-aos="fade-up">
      <div className="about-container">
        {/* Text Section */}
        <div className="about-text">
          <h2>
            About <span>FitnessTracker</span>
          </h2>
          <p>
            FitnessTracker is your ultimate fitness companion — helping you
            track your workouts, meals, and progress with style and precision.
          </p>
          <p>
            Built by fitness lovers, for lovers of fitness — our app gives you
            the power to stay consistent, stay strong, and celebrate your
            wins—every step of the way.
          </p>
        </div>

        {/* Image Section */}
        <div className="about-image">
          <div className="image-wrapper">
            <img
              src="https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=1500&q=80"
              alt="About Fitness Tracker"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
