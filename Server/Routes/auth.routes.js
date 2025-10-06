import express from "express";
import { login, logout, signup, updateProfile } from "../Controllers/auth.controller.js";
import upload from "../Middlewares/upload.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

// const router = express.Router();

// router.post("/signup", upload.single("image"), signup);

// router.post("/login", login);

// router.post("/logout", logout);

// export default router;



const router = express.Router();

router.post("/signup", upload.single("image"), signup);
router.post("/login", login);
router.put(
  "/update-profile",
  authMiddleware,
  upload.single("image"), // multer middleware
  updateProfile
);

router.post("/logout", logout);

export default router;
