const Budget = require("../models/Budget");

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
        res.status(500).json({
            message: error.message
        });
    }
};

const getBudgets = async (req, res) => {
    try {
        const budgets = await Budget.find({
            user: req.user.id
        }).populate("category", "name");

        res.status(200).json(budgets);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
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
        res.status(500).json({
            message: error.message
        });
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
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    createBudget,
    getBudgets,
    updateBudget,
    deleteBudget
};
