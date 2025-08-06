// import React from "react";
// const SignupModal = ({ isOpen, onClose }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="modal-backdrop" onClick={onClose}>
//       <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//         <button className="close-button" onClick={onClose}>×</button>
//         <h1 className="modal-title">Sign Up</h1>
//         <form className="signup-form">
//           <input type="text" placeholder="Name" required />
//           <input type="email" placeholder="Email" required />
//           <input type="password" placeholder="Password" required />
//           <button type="submit">Create Account</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default SignupModal;


import React, { useState } from "react";
import axios from "axios";

const SignupModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
      });

      // Save token or user data if returned
      const token = response.data.token;
      localStorage.setItem("token", token);

      // Close modal or redirect as needed
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>
        <h1 className="modal-title">Sign Up</h1>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <form className="signup-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupModal;
