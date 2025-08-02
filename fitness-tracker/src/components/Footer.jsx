import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#2b1d0f] text-white py-10 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        {/* Brand Info */}
        <div>
          <h2 className="text-2xl font-bold text-[#f2c94c] mb-3">FitTrack</h2>
          <p className="text-sm text-gray-300">
            Your all-in-one fitness companion. Track, train, and transform your life.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-[#f2c94c] mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#banner" className="hover:text-[#f2c94c] transition-all duration-300">
                Home
              </a>
            </li>
            <li>
              <a href="#about" className="hover:text-[#f2c94c] transition-all duration-300">
                About Us
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:text-[#f2c94c] transition-all duration-300">
                Contact
              </a>
            </li>
            <li>
              <a href="#slider" className="hover:text-[#f2c94c] transition-all duration-300">
                Features
              </a>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold text-[#f2c94c] mb-3">Follow Us</h3>
          <div className="flex justify-center md:justify-start gap-4 text-xl">
            <a href="#" className="hover:text-[#f2c94c] transition-all duration-300">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="hover:text-[#f2c94c] transition-all duration-300">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" className="hover:text-[#f2c94c] transition-all duration-300">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="hover:text-[#f2c94c] transition-all duration-300">
              <i className="fab fa-youtube"></i>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-8 text-center text-sm text-gray-400">
        &copy; {new Date().getFullYear()} FitTrack. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
  