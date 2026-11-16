
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    getSummary,
    getCategorySplit,
    getMonthlyTrend,
    getTopMerchants
} = require("../controllers/analyticsController");

// Analytics Summary
router.get("/summary", authMiddleware, getSummary);

// Category-wise Expense Split
router.get("/category-split", authMiddleware, getCategorySplit);

// Monthly Income and Expense Trend
router.get("/monthly-trend", authMiddleware, getMonthlyTrend);

// Top 5 Merchants
router.get("/top-merchants", authMiddleware, getTopMerchants);

module.exports = router;
