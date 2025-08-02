import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const Gallery = () => {
  const images = [
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80",
  ];

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []); 

  return (
    <section id="gallery" className="gallery-section" data-aos="fade-up">
      <h2 className="gallery-title">Fitness Gallery</h2>
      <p className="gallery-subtitle">Strong looks better with sweat.</p>
      <div className="gallery-grid">
        {images.map((src, index) => (
          <div className="gallery-item" key={index} data-aos="zoom-in">
            <img src={src} alt={`Fitness ${index + 1}`} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Gallery;
