import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";
import cors from "cors"; 
import { fileURLToPath } from "url";  // Fix __dirname in ES Modules
import connectMongoDB from "./db/connectMongoDB.js";

// Load environment variables first
dotenv.config();

// Fix __dirname for ES modules
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
app.use(express.json({ limit: "5mb" })); // to parse JSON
app.use(express.urlencoded({ extended: true })); // to parse form data
app.use(cookieParser());

// Enable CORS for frontend requests
const FRONTEND_URL = process.env.VITE_FRONTEND_URL || "https://snapzy-frontend.onrender.com";
console.log("Allowed Frontend URL:", FRONTEND_URL);

app.use(cors({
	origin: FRONTEND_URL, // Allow frontend origin
	credentials: true, // Allow cookies & authentication headers
}));

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

// Serve Frontend in Production
if (process.env.NODE_ENV === "production") {
	const frontendPath = path.join(__dirname, "frontend", "dist");
	app.use(express.static(frontendPath));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(frontendPath, "index.html"));
	});
}

// Start Server
app.listen(PORT, async () => {
	console.log(`Server is running on port ${PORT}`);
	await connectMongoDB();
});
