import express from "express";
import cors from "cors";
import authRoutes from "./Routes/auth.routes.js";
import userRoutes from "./Routes/user.routes.js";
import productRoutes from "./Routes/product.routes.js";
import orderRoutes from "./Routes/order.routes.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://yourfrontend.com"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
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

app.get("/", (req, res) => {
  res.send("Welcome to DressBio E-commerce API 🚀");
});

app.use("/api/v1", authRoutes);
app.use("/api/v1", userRoutes);
app.use("/api/v1", productRoutes);
app.use("/api/v1", orderRoutes);

app.use((err, req, res, next) => {
  if (err.message === "CORS_NOT_ALLOWED") {
    return res.status(403).json({ message: "CORS not allowed for this origin" });
  }
  return res.status(500).json({ message: "Internal Server Error", error: err.message });
});

export default app;
