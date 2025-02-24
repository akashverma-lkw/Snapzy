import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";
import cors from "cors";
import { fileURLToPath } from "url";  
import connectMongoDB from "./db/connectMongoDB.js";

// Load Environment Variables
dotenv.config();

// Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cloudinary Configuration
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Initialize Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS Configuration
const FRONTEND_URL = process.env.FRONTEND_URL || "https://snapzy-frontend.onrender.com";
console.log("Allowed Frontend URL:", FRONTEND_URL);

app.use(cors({
	origin: FRONTEND_URL,
	credentials: true,
	methods: ["GET", "POST", "PUT", "DELETE"],
	allowedHeaders: ["Content-Type", "Authorization"]
}));

// Debugging: Log Incoming Requests
app.use((req, res, next) => {
	console.log(`[${req.method}] ${req.url}`);
	next();
});

// Import Routes
import aiRoutes from "./routes/ai.route.js";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import notificationRoutes from "./routes/notification.route.js";

// Register Routes
app.use("/api/ai", aiRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notifications", notificationRoutes);

// Start Server
app.listen(PORT, async () => {
	console.log(`✅ Server is running on port ${PORT}`);
	await connectMongoDB();
});
