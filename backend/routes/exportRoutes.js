
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { exportExcel } = require("../controllers/exportController");

// GET /api/export/excel?month=2026-11
router.get("/excel", authMiddleware, exportExcel);

module.exports = router;
