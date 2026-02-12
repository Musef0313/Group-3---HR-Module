import React, { useState } from "react";
import "./Login.css";

export default function Login({ onLogin }) {
  const [uid, setUid] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (uid === "hr" && password === "hr123") {
      onLogin();
    } else {
      setError("❌ Invalid UID or Password");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>HR Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter UID"
            value={uid}
            onChange={(e) => setUid(e.target.value)}
          />
          {uid && <div className="input-popup">✔ UID looks good</div>}

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {password && (
            <div className="input-popup">🔒 Typing password securely</div>
          )}

          <button type="submit">Login</button>
        </form>
        {error && <p>{error}</p>}
      </div>
    </div>
  );
}

