import path from "path";
import { fileURLToPath } from "url"; // Required for __dirname in ES Modules
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

// Load environment variables
dotenv.config();

// Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure Cloudinary (Ensure env variables are set)
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
	console.error("❌ Cloudinary environment variables are missing!");
	process.exit(1);
}
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json({ limit: "5mb" })); // Parse JSON body
app.use(express.urlencoded({ extended: true })); // Parse form data (urlencoded)
app.use(cookieParser());

// ✅ CORS Configuration: Allow Multiple Origins (Local & Deployed)
const allowedOrigins = [
	"http://localhost:3000", 
	"https://snapzy-frontend.onrender.com"
];

app.use(cors({
	origin: allowedOrigins,
	credentials: true, // Allow cookies/auth headers
}));

// Serve Static Files in Production (MUST be before API routes)
if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "frontend", "dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}

// API Routes
app.use("/api/ai", aiRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notifications", notificationRoutes);

// Start Server
app.listen(PORT, async () => {
	console.log(`🚀 Server is running on port ${PORT}`);
	await connectMongoDB();
});
