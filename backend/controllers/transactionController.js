
const mongoose = require("mongoose");
const Transaction = require("../models/Transaction");

// GET ALL TRANSACTIONS
const getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({
            userId: req.user.id
        }).sort({ date: -1 });

        return res.status(200).json({
            message: "Transactions fetched successfully",
            totalTransactions: transactions.length,
            transactions
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to fetch transactions"
        });
    }
};

// GET SINGLE TRANSACTION
const getSingleTransaction = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid transaction ID"
            });
        }

        const transaction = await Transaction.findOne({
            _id: id,
            userId: req.user.id
        });

        if (!transaction) {
            return res.status(404).json({
                message: "Transaction not found"
            });
        }

        return res.status(200).json({
            message: "Transaction fetched successfully",
            transaction
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to fetch transaction"
        });
    }
};

// FILTER TRANSACTIONS
const filterTransactions = async (req, res) => {
    try {
        const { type, category, startDate, endDate } = req.query;

        const filter = {
            userId: req.user.id
        };

        if (type) {
            if (!["debit", "credit"].includes(type)) {
                return res.status(400).json({
                    message: "Type must be debit or credit"
                });
            }
            filter.type = type;
        }

        if (category) {
            if (!mongoose.Types.ObjectId.isValid(category)) {
                return res.status(400).json({
                    message: "Invalid category ID"
                });
            }
            filter.category = category;
        }

        if (startDate) {
            const start = new Date(startDate);

            if (Number.isNaN(start.getTime())) {
                return res.status(400).json({
                    message: "Invalid start date"
                });
            }

            filter.date = {
                ...filter.date,
                $gte: start
            };
        }

        if (endDate) {
            const end = new Date(endDate);

            if (Number.isNaN(end.getTime())) {
                return res.status(400).json({
                    message: "Invalid end date"
                });
            }

            filter.date = {
                ...filter.date,
                $lte: end
            };
        }

        if (startDate && endDate &&
            new Date(startDate) > new Date(endDate)) {
            return res.status(400).json({
                message: "Start date cannot be after end date"
            });
        }

        const transactions = await Transaction.find(filter)
            .sort({ date: -1 });

        return res.status(200).json({
            message: "Transactions filtered successfully",
            totalTransactions: transactions.length,
            transactions
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to filter transactions"
        });
    }
};

module.exports = {
    getAllTransactions,
    getSingleTransaction,
    filterTransactions
};
