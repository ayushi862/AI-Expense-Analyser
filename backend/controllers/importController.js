
const crypto = require("crypto");
const Transaction = require("../models/Transaction");
const Account = require("../models/Account");
const { parseCsv } = require("../utils/csvParser");

// CSV IMPORT PREVIEW API
const previewImport = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "Please upload a CSV file."
            });
        }

        const csvText = req.file.buffer.toString("utf8");
        const transactions = parseCsv(csvText);

        return res.status(200).json({
            message: "CSV preview generated successfully.",
            totalTransactions: transactions.length,
            transactions
        });

    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
};

// CSV IMPORT CONFIRM API
const confirmImport = async (req, res) => {
    try {
        const { accountId, transactions } = req.body;

        if (!accountId) {
            return res.status(400).json({
                message: "Account ID is required."
            });
        }

        if (!Array.isArray(transactions) || transactions.length === 0) {
            return res.status(400).json({
                message: "Please provide transactions to import."
            });
        }

        // Verify that the account belongs to the logged-in user
        const account = await Account.findOne({
            _id: accountId,
            user: req.user.id
        });

        if (!account) {
            return res.status(404).json({
                message: "Account not found."
            });
        }

        const validTransactions = [];

        for (const transaction of transactions) {
            const { date, description, amount, type } = transaction;

            if (
                !date ||
                !description ||
                !String(description).trim() ||
                !Number.isFinite(Number(amount)) ||
                Number(amount) <= 0 ||
                !["debit", "credit"].includes(type)
            ) {
                return res.status(400).json({
                    message: "Invalid transaction data.",
                    invalidTransaction: transaction
                });
            }

            const parsedDate = new Date(date);

            if (Number.isNaN(parsedDate.getTime())) {
                return res.status(400).json({
                    message: "Invalid transaction date.",
                    invalidTransaction: transaction
                });
            }

            const normalizedDescription = String(description).trim();

            const dedupHash = crypto
                .createHash("sha256")
                .update([
                    req.user.id,
                    accountId,
                    parsedDate.toISOString(),
                    normalizedDescription.toLowerCase(),
                    Number(amount),
                    type
                ].join("|"))
                .digest("hex");

            validTransactions.push({
                userId: req.user.id,
                accountId,
                date: parsedDate,
                description: normalizedDescription,
                amount: Number(amount),
                type,
                dedupHash
            });
        }

        const result = await Transaction.insertMany(
            validTransactions,
            { ordered: false }
        );

        return res.status(201).json({
            message: "Transactions imported successfully.",
            importedCount: result.length,
            transactions: result
        });

    } catch (error) {
        if (error.name === "BulkWriteError" || error.code === 11000) {
            return res.status(200).json({
                message: "Import completed. Some duplicate transactions may have been skipped.",
                importedCount: error.result?.nInserted || 0
            });
        }

        return res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    previewImport,
    confirmImport
};