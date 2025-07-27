import express from "express";
import { protectedRoute } from "../middleware/auth.js";
import { getCoupon, validateCoupon } from "../controllers/coupon.js";


const router = express.Router();

router.get("/", protectedRoute, getCoupon);
router.post("/validate", protectedRoute, validateCoupon);

export default router;