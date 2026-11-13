
const Account = require("../models/Account");

const createAccount = async (req, res) => {
    try {
        const {
            name,
            bankName,
            type,
            last4,
            openingBalance,
            linkedAccountId
        } = req.body;

        const account = await Account.create({
            user: req.user.id,
            name,
            bankName,
            type,
            last4,
            openingBalance,
            linkedAccountId
        });

        res.status(201).json({
            message: "Account created successfully",
            account
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getAccounts = async (req, res) => {
    try {
        const accounts = await Account.find({
            user: req.user.id
        });

        res.status(200).json(accounts);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const updateAccount = async (req, res) => {
    try {
        const account = await Account.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user.id
            },
            req.body,
            { new: true, runValidators: true }
        );

        if (!account) {
            return res.status(404).json({
                message: "Account not found"
            });
        }

        res.status(200).json({
            message: "Account updated successfully",
            account
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const deleteAccount = async (req, res) => {
    try {
        const account = await Account.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });

        if (!account) {
            return res.status(404).json({
                message: "Account not found"
            });
        }

        res.status(200).json({
            message: "Account deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    createAccount,
    getAccounts,
    updateAccount,
    deleteAccount
};
