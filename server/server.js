import express from "express";
import cors from "cors";
import { PORT } from "./config/serverConfig.js";
import authRoutes from "./routes/authRoutes.js";
const app = express();
// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("API is running");
});

// Server start
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}); }`);
});
