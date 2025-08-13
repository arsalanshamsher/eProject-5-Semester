// import React from "react";

// const LoginModal = ({ isOpen, onClose }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="modal-backdrop" onClick={onClose}>
//       <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//         <button className="close-button" onClick={onClose}>×</button>
//         <h1 className="modal-title">Login</h1>
//         <form className="login-form">
//           <input type="email" placeholder="Email" required />
//           <input type="password" placeholder="Password" required />
//           <button type="submit">Login</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default LoginModal;

import React, { useState } from "react";
import axios from "axios";
import { saveToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";

const LoginModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );

      // Save token to localStorage
      console.log("Login response:", response.data);

      saveToken(response.data.token); // 🔥 yehi zaroori hai
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Close modal
      onClose();
      // Redirect to dashboard
      navigate("/admin");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          ×
        </button>
        <h1 className="modal-title">Login</h1>

        <form className="login-form" onSubmit={handleLogin}>
          {error && <p style={{ color: "red" }}>{error}</p>}

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

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
