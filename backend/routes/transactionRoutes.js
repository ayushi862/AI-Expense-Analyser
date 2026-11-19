
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    createTransaction,
    getAllTransactions,
    getSingleTransaction,
    filterTransactions,
    updateTransferStatus
} = require("../controllers/transactionController");

// Create transaction
router.post("/", authMiddleware, createTransaction);

// Get all transactions
router.get("/", authMiddleware, getAllTransactions);

// Filter transactions
router.get("/filter", authMiddleware, filterTransactions);

// Manually mark or unmark a transaction as transfer
router.patch("/:id/transfer", authMiddleware, updateTransferStatus);

// Get single transaction
router.get("/:id", authMiddleware, getSingleTransaction);

module.exports = router;
