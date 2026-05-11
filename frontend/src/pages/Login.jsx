// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function Login() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Please fill all fields"); return; }

    try {
      setLoading(true);
      const { data } = await API.post("/auth/login", { email, password });
      // Store full response (contains token + user)
      localStorage.setItem("swapnsaveUser", JSON.stringify(data));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow">
            <div className="card-body">
              <h3 className="text-center mb-3">Login</h3>
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label className="form-label">Email:</label>
                  <input type="email" className="form-control" value={email}
                    onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password:</label>
                  <input type="password" className="form-control" value={password}
                    onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required />
                </div>
                <button className="btn btn-primary w-100" type="submit" disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>
              <p className="text-center mt-3">
                Don't have an account? <a href="/signup" className="text-decoration-none">Signup here</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;