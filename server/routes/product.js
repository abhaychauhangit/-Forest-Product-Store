import express from "express";
import { createProduct, deleteProduct, getAllProducts, getFeaturedProducts, getProductByCategory, getRecommendedProducts, getSearchedProducts, getSingleProduct, toggleFeaturedProduct } from "../controllers/product.js";
import { adminRoute, protectedRoute } from "../middleware/auth.js";


const router = express.Router();

router.get("/",  getAllProducts);
router.get("/featured", getFeaturedProducts);
router.get("/category/:category", getProductByCategory);
router.get("/recommended", getRecommendedProducts);
router.post("/", protectedRoute, adminRoute, createProduct);
router.patch("/:id", protectedRoute, adminRoute, toggleFeaturedProduct);
router.delete("/:id", protectedRoute, adminRoute, deleteProduct);
router.get("/search", getSearchedProducts);
router.get("/:id", getSingleProduct);

export default router;