
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    getAllTransactions,
    getSingleTransaction,
    filterTransactions
} = require("../controllers/transactionController");

// Get all transactions
router.get("/", authMiddleware, getAllTransactions);

// Filter transactions
router.get("/filter", authMiddleware, filterTransactions);

// Get single transaction
router.get("/:id", authMiddleware, getSingleTransaction);

module.exports = router;
