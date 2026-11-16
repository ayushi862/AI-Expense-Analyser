
const Budget = require("../models/Budget");
const Transaction = require("../models/Transaction");

const createBudget = async (req, res) => {
    try {
        const { category, amount, month, year } = req.body;

        const budget = await Budget.create({
            user: req.user.id,
            category,
            amount,
            month,
            year
        });

        res.status(201).json({
            message: "Budget created successfully",
            budget
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getBudgets = async (req, res) => {
    try {
        const budgets = await Budget.find({
            user: req.user.id
        }).populate("category", "name");

        res.status(200).json(budgets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateBudget = async (req, res) => {
    try {
        const { category, amount, month, year } = req.body;

        const budget = await Budget.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user.id
            },
            { category, amount, month, year },
            { new: true, runValidators: true }
        );

        if (!budget) {
            return res.status(404).json({
                message: "Budget not found"
            });
        }

        res.status(200).json({
            message: "Budget updated successfully",
            budget
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteBudget = async (req, res) => {
    try {
        const budget = await Budget.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });

        if (!budget) {
            return res.status(404).json({
                message: "Budget not found"
            });
        }

        res.status(200).json({
            message: "Budget deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET /api/budgets/status
const getBudgetStatus = async (req, res) => {
    try {
        const now = new Date();

        const month = Number(req.query.month || now.getMonth() + 1);
        const year = Number(req.query.year || now.getFullYear());

        if (
            !Number.isInteger(month) ||
            month < 1 ||
            month > 12 ||
            !Number.isInteger(year) ||
            year < 2000 ||
            year > 2100
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid month or year"
            });
        }

        const budgets = await Budget.find({
            user: req.user.id,
            month,
            year
        }).populate("category", "name");

        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 1);

        const results = await Promise.all(
            budgets.map(async (budget) => {

                if (!budget.category) {
                    return {
                        category: "Uncategorized",
                        limit: budget.amount,
                        spent: 0,
                        remaining: budget.amount,
                        percent: 0,
                        alert: "ok",
                        alertTriggered: false
                    };
                }

                const transactions = await Transaction.find({
                    userId: req.user.id,
                    category: budget.category._id,
                    type: "debit",
                    isTransfer: false,
                    date: {
                        $gte: startDate,
                        $lt: endDate
                    }
                });

                const spent = transactions.reduce(
                    (total, transaction) => total + transaction.amount,
                    0
                );

                const limit = budget.amount;
                const remaining = limit - spent;

                const percent = limit > 0
                    ? Number(((spent / limit) * 100).toFixed(2))
                    : 0;

                const currentAlertLevel = percent >= 100
                    ? 100
                    : percent >= 80
                        ? 80
                        : 0;

                const previousAlertLevel = budget.lastAlertLevel || 0;

                const alertTriggered =
                    currentAlertLevel > previousAlertLevel;

                if (currentAlertLevel !== previousAlertLevel) {
                    await Budget.updateOne(
                        {
                            _id: budget._id,
                            user: req.user.id
                        },
                        {
                            $set: {
                                lastAlertLevel: currentAlertLevel
                            }
                        }
                    );
                }

                return {
                    category: budget.category.name,
                    limit,
                    spent,
                    remaining,
                    percent,
                    alert: currentAlertLevel === 0
                        ? "ok"
                        : currentAlertLevel,
                    alertTriggered
                };
            })
        );

        res.status(200).json({
            success: true,
            month,
            year,
            data: results
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createBudget,
    getBudgets,
    updateBudget,
    deleteBudget,
    getBudgetStatus
};
