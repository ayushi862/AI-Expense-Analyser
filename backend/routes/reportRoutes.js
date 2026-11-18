
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { exportPDF } = require("../controllers/reportController");

// GET /api/report/pdf?month=2026-11
router.get("/pdf", authMiddleware, exportPDF);

module.exports = router;
