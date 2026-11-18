
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    getAllTransactions,
    getSingleTransaction,
    filterTransactions,
    updateTransferStatus
} = require("../controllers/transactionController");

// Get all transactions
router.get("/", authMiddleware, getAllTransactions);

// Filter transactions
router.get("/filter", authMiddleware, filterTransactions);

// Manually mark or unmark a transaction as transfer
router.patch("/:id/transfer", authMiddleware, updateTransferStatus);

// Get single transaction
router.get("/:id", authMiddleware, getSingleTransaction);

module.exports = router;
