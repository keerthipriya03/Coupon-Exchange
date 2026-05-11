// src/pages/BrowseCoupons.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

const BACKEND = "https://swapnsave-backend-natz.onrender.com";
const CATEGORIES = ["All", "Movie", "Travel", "Event", "Food", "Other"];

function BrowseCoupons() {
  const navigate = useNavigate();

  const [coupons, setCoupons]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [search, setSearch]     = useState("");
  const [category, setCategory] = useState("All");

  // Get logged-in user's ID so we hide their own listings
  const getMyId = () => {
    try {
      const stored = localStorage.getItem("swapnsaveUser");
      return stored ? JSON.parse(stored)?.user?._id : null;
    } catch { return null; }
  };
  const myId = getMyId();

  const loadCoupons = async (cat, searchText) => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();
      if (cat && cat !== "All") params.set("category", cat);
      if (searchText)           params.set("search", searchText);

      const { data } = await API.get(`/coupons?${params}`);

      // Only show OTHER users' coupons — you can't exchange with yourself
      const others = myId
        ? data.coupons.filter((c) => c.seller?._id !== myId)
        : data.coupons;

      setCoupons(others);
    } catch (err) {
      setError("Failed to load coupons. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons(category, search);
  }, [category, search]);

  const handleCategoryClick = (cat) => {
    setCategory(cat);
    setSearch("");
  };

  const handleChatClick = (sellerId) => {
    if (!localStorage.getItem("swapnsaveUser")) { navigate("/login"); return; }
    navigate(`/chat?userId=${sellerId}`);
  };

  return (
    <div className="container-fluid p-4 rounded shadow"
      style={{ background: "linear-gradient(to bottom, #C7B8EA, #87CEEB)", minHeight: "80vh" }}>

      <h2 className="text-center mb-1">🎟️ Browse Coupons</h2>
      <p className="text-center text-muted mb-4">
        Find coupons listed by other users — chat with them to exchange!
      </p>

      {/* Search Bar */}
      <div className="row justify-content-center mb-3">
        <div className="col-md-6">
          <input
            className="form-control form-control-lg"
            placeholder="🔍 Search coupons..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Category Filter Buttons */}
      <div className="d-flex justify-content-center flex-wrap gap-2 mb-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryClick(cat)}
            className={`btn ${category === cat ? "btn-dark" : "btn-outline-dark"}`}
          >
            {cat === "All"    ? "🔁 " : ""}
            {cat === "Movie"  ? "🎬 " : ""}
            {cat === "Travel" ? "✈️ " : ""}
            {cat === "Event"  ? "🎤 " : ""}
            {cat === "Food"   ? "🍔 " : ""}
            {cat === "Other"  ? "🏷️ " : ""}
            {cat}
          </button>
        ))}
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status" />
          <p className="mt-2 text-muted">Loading coupons...</p>
        </div>
      )}

      {/* Error */}
      {error && <div className="alert alert-danger text-center">{error}</div>}

      {/* No Data — shown when category has no listings */}
      {!loading && !error && coupons.length === 0 && (
        <div className="text-center my-5">
          <div style={{ fontSize: "4rem" }}>
            {category === "Movie"  && "🎬"}
            {category === "Travel" && "✈️"}
            {category === "Event"  && "🎤"}
            {category === "Food"   && "🍔"}
            {category === "Other"  && "🏷️"}
            {category === "All"    && "🎟️"}
          </div>
          <h5 className="mt-3 fw-bold">
            {search
              ? `No coupons found for "${search}"`
              : category === "All"
              ? "No coupons available yet."
              : `No ${category} coupons listed yet.`}
          </h5>
          <p className="text-muted">
            {search
              ? "Try a different search term."
              : `No one has listed a ${category} coupon yet. Be the first!`}
          </p>
          <button className="btn btn-success mt-2"
            onClick={() => navigate("/add-listing")}>
            + Add a Listing
          </button>
        </div>
      )}

      {/* Results count */}
      {!loading && coupons.length > 0 && (
        <p className="text-center text-muted mb-3">
          Showing <strong>{coupons.length}</strong> coupon{coupons.length !== 1 ? "s" : ""}
          {category !== "All" ? ` in ${category}` : ""}
          {search ? ` matching "${search}"` : ""}
        </p>
      )}

      {/* Coupon Cards */}
      <div className="row">
        {!loading && coupons.map((item) => (
          <div className="col-md-4 col-sm-6 mb-4" key={item._id}>
            <div className="card shadow-sm h-100 position-relative">

              {/* Category Badge */}
              <span className="badge bg-primary position-absolute"
                style={{ top: "10px", left: "10px", zIndex: 1 }}>
                {item.category}
              </span>

              {/* Coupon Image */}
              <img
                src={item.image ? `${BACKEND}${item.image}` : "https://via.placeholder.com/300x180?text=No+Image"}
                className="card-img-top"
                alt={item.title}
                style={{ height: "180px", objectFit: "cover" }}
              />

              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{item.title}</h5>
                <p className="text-muted small mb-2">
                  {item.description?.length > 60
                    ? item.description.slice(0, 60) + "..."
                    : item.description}
                </p>

                <p className="mb-1"><strong>👤 Seller:</strong> {item.seller?.name || "Unknown"}</p>
                <p className="mb-1">
                  <strong>💰 Price:</strong>{" "}
                  {item.price === 0
                    ? <span className="text-success fw-bold">Free / Exchange</span>
                    : <span className="fw-bold">₹{item.price}</span>}
                </p>
                <p className="mb-3 text-danger small">
                  <strong>⏰ Expires:</strong>{" "}
                  {new Date(item.expiry).toLocaleDateString("en-IN", {
                    day: "numeric", month: "short", year: "numeric",
                  })}
                </p>

                {/* Actions */}
                <div className="mt-auto d-flex gap-2">
                  <button className="btn btn-primary btn-sm flex-grow-1"
                    onClick={() => navigate(`/product/${item._id}`)}>
                    👁️ View
                  </button>
                  <button className="btn btn-outline-success btn-sm flex-grow-1"
                    onClick={() => handleChatClick(item.seller?._id)}>
                    💬 Chat with Seller
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BrowseCoupons;