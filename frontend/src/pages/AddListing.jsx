// src/pages/AddListing.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function AddListing() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "", category: "", description: "", price: "", expiry: "",
  });
  const [image, setImage]     = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Check login
    const stored = localStorage.getItem("swapnsaveUser");
    if (!stored) { navigate("/login"); return; }

    try {
      setLoading(true);

      // Use FormData to send both text fields AND image file
      const formData = new FormData();
      formData.append("title",       form.title);
      formData.append("category",    form.category);
      formData.append("description", form.description);
      formData.append("price",       form.price || 0);
      formData.append("expiry",      form.expiry);
      if (image) formData.append("image", image);

      await API.post("/coupons", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Listing created successfully!");
      navigate("/browse");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create listing.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="col-md-6 mx-auto p-5 rounded shadow" style={{ background: "linear-gradient(to bottom, #C7B8EA, #87CEEB)" }}>
      <h2 className="mb-4 text-center">Add New Coupon / Ticket</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-3" name="title"
          placeholder="Title" onChange={handleChange} required
        />
        <select className="form-control mb-3" name="category" onChange={handleChange} required>
          <option value="">Select Category</option>
          <option>Movie</option>
          <option>Travel</option>
          <option>Event</option>
          <option>Food</option>
          <option>Other</option>
        </select>
        <textarea
          className="form-control mb-3" name="description"
          placeholder="Description" rows={3} onChange={handleChange} required
        />
        <input
          className="form-control mb-3" name="price"
          placeholder="Price in ₹ (leave 0 for free)" type="number" onChange={handleChange}
        />
        <label className="form-label">Expiry Date</label>
        <input
          className="form-control mb-3" type="date" name="expiry"
          onChange={handleChange} required
        />
        <label className="form-label">Upload Image (optional)</label>
        <input
          className="form-control mb-3" type="file" accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <button type="submit" className="btn btn-success w-100" disabled={loading}>
          {loading ? "Submitting..." : "Submit Listing"}
        </button>
      </form>
    </div>
  );
}

export default AddListing;