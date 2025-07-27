import express from "express";
import { checkoutSuccess, createCheckoutSession } from "../controllers/payment.js";
import { protectedRoute } from "../middleware/auth.js";


const router = express.Router();

router.post("/create-checkout-session", protectedRoute, createCheckoutSession);
router.post("/checkout-success", protectedRoute, checkoutSuccess);

export default router;