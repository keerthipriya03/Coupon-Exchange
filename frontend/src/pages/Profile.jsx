// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

const BACKEND = "https://swapnsave-backend-natz.onrender.com";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser]         = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("swapnsaveUser");
    if (!stored) { navigate("/login"); return; }

    const fetchData = async () => {
      try {
        const [userRes, listingsRes] = await Promise.all([
          API.get("/auth/me"),
          API.get("/coupons/my/listings"),
        ]);
        setUser(userRes.data.user);
        setListings(listingsRes.data.coupons);
      } catch (err) {
        console.error(err);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this listing?")) return;
    try {
      await API.delete(`/coupons/${id}`);
      setListings((prev) => prev.filter((c) => c._id !== id));
      alert("Listing deleted.");
    } catch (err) {
      alert("Failed to delete listing.");
    }
  };

  if (loading) return <p className="text-center mt-5">Loading profile...</p>;

  return (
    <div className="col-md-8 mx-auto text-center p-5 rounded shadow" style={{ background: "linear-gradient(to bottom, #C7B8EA, #87CEEB)" }}>
      <h2>My Profile</h2>
      <img
        src={user?.avatar ? `${BACKEND}${user.avatar}` : "https://via.placeholder.com/100"}
        className="rounded-circle my-3"
        alt="profile"
        style={{ width: "100px", height: "100px", objectFit: "cover" }}
      />
      <h5>Name: {user?.name}</h5>
      <p>Email: {user?.email}</p>
      <p>Member since: {new Date(user?.createdAt).toLocaleDateString()}</p>

      <h4 className="mt-4">My Listings ({listings.length})</h4>

      {listings.length === 0 ? (
        <p className="text-muted">You haven't added any listings yet.</p>
      ) : (
        <div className="row mt-3 text-start">
          {listings.map((c) => (
            <div className="col-md-6 mb-3" key={c._id}>
              <div className="card shadow-sm">
                <div className="card-body">
                  <h6 className="card-title">{c.title}</h6>
                  <p className="mb-1"><strong>Category:</strong> {c.category}</p>
                  <p className="mb-1"><strong>Price:</strong> {c.price === 0 ? "Free" : `₹${c.price}`}</p>
                  <p className="mb-1">
                    <strong>Status:</strong>{" "}
                    <span className={`badge bg-${c.status === "active" ? "success" : "secondary"}`}>
                      {c.status}
                    </span>
                  </p>
                  <p className="text-danger mb-2">
                    <strong>Expires:</strong> {new Date(c.expiry).toLocaleDateString()}
                  </p>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(c._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Profile;