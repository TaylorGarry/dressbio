import express from "express";
import { authMiddleware } from "../Middlewares/auth.middleware.js";
import User from "../Modals/user.modals.js";
import { updateProfile } from "../Controllers/auth.controller.js";
import upload from "../Middlewares/upload.js";

const router = express.Router();

router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.accountType === "admin") {
      return res.json({ message: "Welcome Admin! 🎩", role: "admin", user });
    }
    return res.json({ message: "Welcome User 👤", role: "user", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.put("/profile", authMiddleware, upload.single("image"), updateProfile);

export default router;
