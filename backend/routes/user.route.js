import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { followUnfollowUser, getUserProfile, getSuggestedUsers, updateUser } from '../controllers/user.controller.js';

const router = express.Router();

router
.get("/profile/:username", protectRoute ,getUserProfile)
.get("/suggested", protectRoute ,getSuggestedUsers)
.post("/follow/:id", protectRoute ,followUnfollowUser)
.post("/update", protectRoute , updateUser);


export default router;


