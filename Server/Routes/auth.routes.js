import express from "express";
import { login, signup } from "../Controllers/auth.controller.js";
import upload from "../Middlewares/upload.js";

const router = express.Router();

router.post("/signup", upload.single("image"), signup);

router.post("/login", login);

export default router;
