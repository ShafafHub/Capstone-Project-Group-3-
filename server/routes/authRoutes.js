import express from "express";

const router = express.Router();

// Example route
router.get("/login", (req, res) => {
  res.json({
    message: "Login route working",
  });
});

export default router;