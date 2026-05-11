import Coupon from "../models/Coupon.js";

// ─── GET /api/coupons ─────────────────────────────────────────────────────────
// Query params: category, search, page, limit
export const getCoupons = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 12 } = req.query;

    const filter = { status: "active" };
    if (category) filter.category = category;
    if (search) filter.title = { $regex: search, $options: "i" };

    const skip = (Number(page) - 1) * Number(limit);

    const [coupons, total] = await Promise.all([
      Coupon.find(filter)
        .populate("seller", "name avatar")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Coupon.countDocuments(filter),
    ]);

    res.json({
      success: true,
      coupons,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── GET /api/coupons/:id ─────────────────────────────────────────────────────
export const getCouponById = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id).populate("seller", "name email avatar");
    if (!coupon) return res.status(404).json({ success: false, message: "Coupon not found." });
    res.json({ success: true, coupon });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── POST /api/coupons ────────────────────────────────────────────────────────
export const createCoupon = async (req, res) => {
  try {
    const { title, category, description, price, expiry } = req.body;

    if (!title || !category || !description || !expiry)
      return res.status(400).json({ success: false, message: "Please fill all required fields." });

    const imagePath = req.file ? `/uploads/coupons/${req.file.filename}` : "";

    const coupon = await Coupon.create({
      title,
      category,
      description,
      price: price || 0,
      expiry,
      image: imagePath,
      seller: req.user._id,
    });

    const populated = await coupon.populate("seller", "name avatar");
    res.status(201).json({ success: true, message: "Listing created!", coupon: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── PUT /api/coupons/:id ─────────────────────────────────────────────────────
export const updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ success: false, message: "Coupon not found." });

    if (coupon.seller.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: "Not authorized." });

    const updates = { ...req.body };
    if (req.file) updates.image = `/uploads/coupons/${req.file.filename}`;

    const updated = await Coupon.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json({ success: true, coupon: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── DELETE /api/coupons/:id ──────────────────────────────────────────────────
export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ success: false, message: "Coupon not found." });

    if (coupon.seller.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: "Not authorized." });

    await coupon.deleteOne();
    res.json({ success: true, message: "Listing deleted." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── GET /api/coupons/my/listings ─────────────────────────────────────────────
// For the Profile page: "My Listings"
export const getMyCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({ seller: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, coupons });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};