import express from "express";
import { addProductToCart, getCartItems, removeAllFromCArt, updateQuantity } from "../controllers/cart.js";
import { protectedRoute } from "../middleware/auth.js";


const router = express.Router();

router.get("/", protectedRoute, getCartItems);
router.post("/", protectedRoute, addProductToCart);
router.delete("/", protectedRoute, removeAllFromCArt);
router.put("/:id", protectedRoute, updateQuantity);

export default router;