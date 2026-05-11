// src/pages/Signup.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function Signup() {
  const [user, setUser]       = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!user.name || !user.email || !user.password) { setError("All fields are required!"); return; }

    try {
      setLoading(true);
      const { data } = await API.post("/auth/signup", user);
      // Store full response (contains token + user)
      localStorage.setItem("swapnsaveUser", JSON.stringify(data));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Try again.");
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
              <h3 className="text-center mb-3">Create an Account</h3>
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Name:</label>
                  <input type="text" className="form-control" value={user.name}
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                    placeholder="Enter your name" required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email:</label>
                  <input type="email" className="form-control" value={user.email}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                    placeholder="Enter your email" required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password:</label>
                  <input type="password" className="form-control" value={user.password}
                    onChange={(e) => setUser({ ...user, password: e.target.value })}
                    placeholder="Enter a password" required />
                </div>
                <button className="btn btn-success w-100" type="submit" disabled={loading}>
                  {loading ? "Creating account..." : "Signup"}
                </button>
              </form>
              <p className="text-center mt-3">
                Already have an account? <a href="/login" className="text-decoration-none">Login here</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;