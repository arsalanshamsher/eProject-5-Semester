import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const About = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <section
      id="about"
      className="py-20 bg-[#fefcec] text-[#743a13]"
      data-aos="fade-up"
    >
      <div className="container mx-auto px-6 md:px-12 lg:px-20 flex flex-col-reverse md:flex-row items-center gap-12">
        {/* Text */}
        <div className="flex-1">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#8b4513]">
            About <span className="text-[#eca414]">FitnessTracker</span>
          </h2>
          <p className="text-lg leading-relaxed mb-4">
            FitnessTracker is your ultimate fitness companion — helping you
            track your workouts, meals, and progress with style and precision.
          </p>
          <p className="text-lg leading-relaxed">
            Built by fitness lovers, for lovers of fitness — our app gives you
            the power to stay consistent, stay strong, and celebrate your
            wins—every step of the way.
          </p>
        </div>

        {/* Image */}
        <div className="flex-1">
          <div className="overflow-hidden rounded-xl shadow-lg transform transition-transform duration-500 hover:scale-105">
            <img
              src="https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=1500&q=80"
              alt="About Fitness Tracker"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
