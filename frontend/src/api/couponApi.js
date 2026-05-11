// src/api/couponApi.js
import API from "./axios";

// BrowseCoupons.jsx — replaces sampleCoupons hardcoded array
export const fetchCoupons = async ({ category, search, page = 1 } = {}) => {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (search)   params.set("search", search);
  params.set("page", page);
  const { data } = await API.get(`/coupons?${params}`);
  return data; // { success, coupons, total, pages }
};

// View single coupon detail page
export const fetchCouponById = async (id) => {
  const { data } = await API.get(`/coupons/${id}`);
  return data; // { success, coupon }
};

// AddListing.jsx — replaces the alert("Listing Submitted!")
export const createCoupon = async (formData) => {
  const { data } = await API.post("/coupons", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data; // { success, coupon }
};

// Profile.jsx — fetches "My Listings" section
export const fetchMyCoupons = async () => {
  const { data } = await API.get("/coupons/my/listings");
  return data; // { success, coupons }
};

// Delete a listing from Profile page
export const deleteCoupon = async (id) => {
  const { data } = await API.delete(`/coupons/${id}`);
  return data;
};