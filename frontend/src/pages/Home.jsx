import React from "react";
import { useNavigate } from "react-router-dom";
import "./page.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div
      className="home-container"
      style={{
        background: "linear-gradient(to bottom, #C7B8EA, #87CEEB)",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="text-center p-5 rounded shadow bg-white bg-opacity-75">
        <h1 className="mb-4">🎟️ Welcome to CouponMarket</h1>
        <p className="lead">
          CouponMarket is your one-stop platform to buy, sell, or exchange
          coupons with ease. Discover great deals and share your own offers with
          the community.
        </p>

        {/* CTA Button */}
        <div className="mt-5">
          <button
            className="cta-btn"
            onClick={() => navigate("/add-listing")}
          >
            List Your Coupon Now 🚀
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
