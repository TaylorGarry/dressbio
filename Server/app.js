import express from "express";
import cors from "cors";
import path from "path";                    // ✅ Import path
import { fileURLToPath } from "url";        // ✅ Import fileURLToPath
import authRoutes from "./Routes/auth.routes.js";
import userRoutes from "./Routes/user.routes.js";
import productRoutes from "./Routes/product.routes.js";
import orderRoutes from "./Routes/order.routes.js";
import reviewRoutes from "./Routes/review.routes.js";
import paymentRoutes from "./Routes/payment.routes.js";

const app = express();

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const allowedOrigins = [
  "http://localhost:5173",      // for local dev
  "https://mydevtm.com"         // live frontend
];


app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow non-browser requests like Postman
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("CORS_NOT_ALLOWED"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));


app.use(express.json());

// Serve uploads folder
app.use("/public", express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.send("Welcome to DressBio E-commerce API 🚀");
});

app.use("/api/v1", authRoutes);
app.use("/api/v1", userRoutes);
app.use("/api/v1", productRoutes);
app.use("/api/v1", orderRoutes);
app.use("/api/v1", reviewRoutes);
app.use("/api/v1/payment", paymentRoutes);

app.use((err, req, res, next) => {
  if (err.message === "CORS_NOT_ALLOWED") {
    return res.status(403).json({ message: "CORS not allowed for this origin" });
  }
  return res.status(500).json({ message: "Internal Server Error", error: err.message });
});

export default app;
