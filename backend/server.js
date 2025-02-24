import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";
import cors from "cors"; 

import aiRoutes from "./routes/ai.route.js";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import notificationRoutes from "./routes/notification.route.js";

import connectMongoDB from "./db/connectMongoDB.js";

dotenv.config();

// ✅ Cloudinary Configuration
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(express.json({ limit: "5mb" })); // Parse JSON requests
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(cookieParser()); // Parse cookies

// ✅ Enable CORS for frontend requests
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000"; 
app.use(cors({
	origin: FRONTEND_URL,
	credentials: true, // Allow cookies & authentication headers
	methods: ["GET", "POST", "PUT", "DELETE"],
}));

// ✅ Connect to MongoDB
connectMongoDB();

// ✅ API Routes
app.use("/api/ai", aiRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notifications", notificationRoutes);

// ✅ Health Check Route (for debugging)
app.get("/", (req, res) => {
	res.send("Snapzy Backend is running! 🚀");
});

// ✅ Start Server
app.listen(PORT, () => {
	console.log(`✅ Server is running on port ${PORT}`);
});
