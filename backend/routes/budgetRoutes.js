
const express = require("express");
const router = express.Router();

const {
    createBudget,
    getBudgets,
    updateBudget,
    deleteBudget,
    getBudgetStatus
} = require("../controllers/budgetController");

const authMiddleware = require("../middleware/authMiddleware");

router.get("/status", authMiddleware, getBudgetStatus);

router.post("/", authMiddleware, createBudget);
router.get("/", authMiddleware, getBudgets);
router.put("/:id", authMiddleware, updateBudget);
router.delete("/:id", authMiddleware, deleteBudget);

module.exports = router;
