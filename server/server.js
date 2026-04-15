import express from "express";
import cors from "cors";

import serverConfig from "./config/serverConfig.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();


//  Middleware
app.use(express.json()); // برای خواندن JSON
app.use(cors()); // برای اجازه دادن به frontend


// Routes
app.use("/api/auth", authRoutes);


//  Server Start
app.listen(serverConfig.PORT, () => {
  console.log(`Server is running on port ${serverConfig.PORT}`);
});