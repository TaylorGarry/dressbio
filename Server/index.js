// import dotenv from "dotenv";
// dotenv.config();
import "dotenv/config";
import connectDB from "./DB/DBConnection.js";
import app from "./app.js";

// console.log("📌 PORT:", process.env.PORT);
// console.log("📌 MONGO_URI:", process.env.MONGO_URI);

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
