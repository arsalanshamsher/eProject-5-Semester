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

      // Automatically hide the success message after 1 second
      setTimeout(() => {
        setShowSuccess(false);
      }, 1000);
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <section
      id="contact"
      className="py-20 px-4 bg-[#ffff] text-[#743a13]"
      data-aos="fade-up"
    >
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-6 text-[#8b4513]">
          Get in Touch 💬
        </h2>
        <p className="text-lg mb-10">
          We'd love to hear from you! Whether you have a question, suggestion,
          or just want to say hello.
        </p>

        <form
          className="grid gap-6 text-left"
          onSubmit={handleSubmit}
          noValidate
        >
          <div>
            <input
              type="text"
              placeholder="Your Name"
              className="w-full p-4 border border-[#f2c22d] rounded-lg outline-none focus:ring-2 focus:ring-[#eca414]"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            {errors.name && (
              <p className="text-red-600 mt-1 text-sm">{errors.name}</p>
            )}
          </div>

          <div>
            <input
              type="email"
              placeholder="Your Email"
              className="w-full p-4 border border-[#f2c22d] rounded-lg outline-none focus:ring-2 focus:ring-[#eca414]"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            {errors.email && (
              <p className="text-red-600 mt-1 text-sm">{errors.email}</p>
            )}
          </div>

          <div>
            <textarea
              placeholder="Your Message"
              rows="5"
              className="w-full p-4 border border-[#f2c22d] rounded-lg outline-none focus:ring-2 focus:ring-[#eca414] resize-none"
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
            />
            {errors.message && (
              <p className="text-red-600 mt-1 text-sm">{errors.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="bg-[#eca414] text-white font-semibold py-3 px-6 rounded-full hover:bg-[#d17d0e] transition-all duration-300 w-full"
          >
            Send Message
          </button>
        </form>

        {showSuccess && (
          <div className="mt-6 p-4 rounded-lg bg-green-100 text-green-700 shadow-lg animate-fade-in">
            Thank you for reaching out! We'll get back to you soon 🚀
          </div>
        )}
      </div>
    </section>
  );
};

export default Contact;
