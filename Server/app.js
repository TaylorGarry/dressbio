import express from "express";
import cors from "cors";
import authRoutes from "./Routes/auth.routes.js"
import userRoutes from "./Routes/user.routes.js"

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to DressBio E-commerce API 🚀");
});

app.use("/api/v1", authRoutes);
app.use("/api/v1", userRoutes);

export default app;
