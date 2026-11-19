
const mongoose = require("mongoose");
const crypto = require("crypto");

const Transaction = require("../models/Transaction");
const Account = require("../models/Account");

// CREATE TRANSACTION
const createTransaction = async (req, res) => {
    try {
        const {
            accountId,
            date,
            description,
            merchant,
            referenceNo,
            amount,
            type,
            category,
            subcategory
        } = req.body;

        if (
            !accountId ||
            !date ||
            !description ||
            amount === undefined ||
            !type
        ) {
            return res.status(400).json({
                message: "Required fields are missing"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(accountId)) {
            return res.status(400).json({
                message: "Invalid account ID"
            });
        }

        if (!["debit", "credit"].includes(type)) {
            return res.status(400).json({
                message: "Type must be debit or credit"
            });
        }

        if (
            typeof amount !== "number" ||
            !Number.isFinite(amount) ||
            amount <= 0
        ) {
            return res.status(400).json({
                message: "Amount must be a positive number"
            });
        }

        const transactionDate = new Date(date);

        if (Number.isNaN(transactionDate.getTime())) {
            return res.status(400).json({
                message: "Invalid transaction date"
            });
        }

        const account = await Account.findOne({
            _id: accountId,
            user: req.user.id
        });

        if (!account) {
            return res.status(404).json({
                message: "Account not found"
            });
        }

        const normalizedDescription = description.trim();

        const dedupHash = crypto
            .createHash("sha256")
            .update([
                req.user.id,
                accountId,
                transactionDate.toISOString(),
                normalizedDescription.toLowerCase(),
                amount,
                type,
                referenceNo || ""
            ].join("|"))
            .digest("hex");

        const transaction = await Transaction.create({
            userId: req.user.id,
            accountId,
            date: transactionDate,
            description: normalizedDescription,
            merchant: merchant || "",
            referenceNo: referenceNo || "",
            amount,
            type,
            category: category || null,
            subcategory: subcategory || "",
            dedupHash
        });

        return res.status(201).json({
            message: "Transaction created successfully",
            transaction
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "Duplicate transaction already exists"
            });
        }

        console.error("Create Transaction Error:", error);

        return res.status(500).json({
            message: "Failed to create transaction"
        });
    }
};

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

        if (
            startDate &&
            endDate &&
            new Date(startDate) > new Date(endDate)
        ) {
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

// MANUALLY MARK OR UNMARK TRANSFER
const updateTransferStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { isTransfer } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid transaction ID"
            });
        }

        if (typeof isTransfer !== "boolean") {
            return res.status(400).json({
                message: "isTransfer must be true or false"
            });
        }

        const transaction = await Transaction.findOneAndUpdate(
            {
                _id: id,
                userId: req.user.id
            },
            {
                $set: { isTransfer }
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!transaction) {
            return res.status(404).json({
                message: "Transaction not found"
            });
        }

        return res.status(200).json({
            message: isTransfer
                ? "Transaction marked as transfer successfully."
                : "Transaction unmarked as transfer successfully.",
            transaction
        });

    } catch (error) {
        console.error("Transfer Update Error:", error);

        return res.status(500).json({
            message: "Failed to update transfer status."
        });
    }
};

module.exports = {
    createTransaction,
    getAllTransactions,
    getSingleTransaction,
    filterTransactions,
    updateTransferStatus
};
