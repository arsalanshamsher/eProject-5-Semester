import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const Contact = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Name is required";
    if (!formData.email.trim()) {
      errs.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = "Email is invalid";
    }
    if (!formData.message.trim()) errs.message = "Message is required";
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      setShowSuccess(true);
      setFormData({ name: "", email: "", message: "" });
      setErrors({});
      setTimeout(() => {
        setShowSuccess(false);
      }, 1000);
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <section id="contact" className="contact-section" data-aos="fade-up">
      <div className="contact-container">
        <h2>Get in Touch 💬</h2>
        <p>
          We'd love to hear from you! Whether you have a question, suggestion,
          or just want to say hello.
        </p>

        <form className="contact-form" onSubmit={handleSubmit} noValidate>
          <div>
            <input
              type="text"
              placeholder="Your Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            {errors.name && <p className="error-text">{errors.name}</p>}
          </div>

          <div>
            <input
              type="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>

          <div>
            <textarea
              placeholder="Your Message"
              rows="5"
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
            />
            {errors.message && <p className="error-text">{errors.message}</p>}
          </div>

          <button type="submit">Send Message</button>
        </form>

        {showSuccess && (
          <div className="success-message animate-fade-in">
            Thank you for reaching out! We'll get back to you soon 🚀
          </div>
        )}
      </div>
    </section>
  );
};

export default Contact;
