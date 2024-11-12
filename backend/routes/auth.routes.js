import { sign } from 'crypto';
import express from 'express';
import { getMe, login, logout, signup } from '../controllers/auth.controller.js';
import { getUserProfile, followUnfollowUser } from '../controllers/user.controller.js';
import { protectRoute } from '../middleware/protectRoute.js';
 
 const router = express.Router();
 
router.get("/me", protectRoute ,getMe);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/follow", followUnfollowUser);

export default router;