// src/api/couponApi.js
import API from "./axios";


export const fetchCoupons = async ({ category, search, page = 1 } = {}) => {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (search)   params.set("search", search);
  params.set("page", page);
  const { data } = await API.get(`/coupons?${params}`);
  return data; 
};

// Single coupon 
export const fetchCouponById = async (id) => {
  const { data } = await API.get(`/coupons/${id}`);
  return data; 
};


export const createCoupon = async (formData) => {
  const { data } = await API.post("/coupons", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data; 
};


export const fetchMyCoupons = async () => {
  const { data } = await API.get("/coupons/my/listings");
  return data; 
};


export const deleteCoupon = async (id) => {
  const { data } = await API.delete(`/coupons/${id}`);
  return data;
};
