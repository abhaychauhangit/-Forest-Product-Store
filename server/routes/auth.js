import express from "express";
import { checkAuth, login, logout, signup } from "../controllers/auth.js";
import { protectedRoute } from "../middleware/auth.js";




const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.post("/logout", logout);
// router.post("/refresh-token", ref)
router.get("/checkauth", protectedRoute, checkAuth);

export default router;
