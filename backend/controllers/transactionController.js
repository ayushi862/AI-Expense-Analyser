
const mongoose = require("mongoose");
const Transaction = require("../models/Transaction");

// COMMON PAGINATION, SEARCH AND SORTING HELPER
const getQueryOptions = (query) => {
    const {
        page = "1",
        limit = "10",
        search,
        sortBy = "date",
        order = "desc"
    } = query;

    if (!/^\d+$/.test(page) || Number(page) < 1) {
        return { error: "Page must be a positive integer" };
    }

    if (!/^\d+$/.test(limit) || Number(limit) < 1 || Number(limit) > 100) {
        return { error: "Limit must be between 1 and 100" };
    }

    const allowedSortFields = [
        "date",
        "amount",
        "description",
        "merchant"
    ];

    if (!allowedSortFields.includes(sortBy)) {
        return { error: "Invalid sortBy field" };
    }

    if (!["asc", "desc"].includes(order)) {
        return { error: "Order must be asc or desc" };
    }

    if (search !== undefined && typeof search !== "string") {
        return { error: "Search must be a string" };
    }

    if (search && search.length > 100) {
        return { error: "Search cannot exceed 100 characters" };
    }

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    return {
        page: pageNumber,
        limit: limitNumber,
        skip: (pageNumber - 1) * limitNumber,
        search: search ? search.trim() : "",
        sort: {
            [sortBy]: order === "asc" ? 1 : -1
        }
    };
};

// ADD SEARCH CONDITIONS
const addSearchFilter = (filter, search) => {
    if (search) {
        const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const searchRegex = new RegExp(escapedSearch, "i");

        filter.$or = [
            { description: searchRegex },
            { merchant: searchRegex },
            { referenceNo: searchRegex }
        ];
    }
};

// COMMON FETCH FUNCTION
const fetchTransactions = async (filter, options) => {
    addSearchFilter(filter, options.search);

    const totalTransactions = await Transaction.countDocuments(filter);

    const transactions = await Transaction.find(filter)
        .sort(options.sort)
        .skip(options.skip)
        .limit(options.limit);

    return {
        totalTransactions,
        totalPages: Math.ceil(totalTransactions / options.limit),
        currentPage: options.page,
        limit: options.limit,
        hasNextPage: options.page < Math.ceil(totalTransactions / options.limit),
        hasPrevPage: options.page > 1,
        transactions
    };
};

// GET ALL TRANSACTIONS
const getAllTransactions = async (req, res) => {
    try {
        const options = getQueryOptions(req.query);

        if (options.error) {
            return res.status(400).json({ message: options.error });
        }

        const result = await fetchTransactions(
            { userId: req.user.id },
            options
        );

        return res.status(200).json({
            message: "Transactions fetched successfully",
            ...result
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
        const {
            type,
            category,
            startDate,
            endDate
        } = req.query;

        const options = getQueryOptions(req.query);

        if (options.error) {
            return res.status(400).json({ message: options.error });
        }

        const filter = {
            userId: req.user.id
        };

        if (type !== undefined) {
            if (!["debit", "credit"].includes(type)) {
                return res.status(400).json({
                    message: "Type must be debit or credit"
                });
            }
            filter.type = type;
        }

        if (category !== undefined) {
            if (!mongoose.Types.ObjectId.isValid(category)) {
                return res.status(400).json({
                    message: "Invalid category ID"
                });
            }
            filter.category = category;
        }

        let start;
        let end;

        if (startDate !== undefined) {
            start = new Date(startDate);

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

        if (endDate !== undefined) {
            end = new Date(endDate);

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

        if (start && end && start > end) {
            return res.status(400).json({
                message: "Start date cannot be after end date"
            });
        }

        const result = await fetchTransactions(filter, options);

        return res.status(200).json({
            message: "Transactions filtered successfully",
            ...result
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
    getAllTransactions,
    getSingleTransaction,
    filterTransactions,
    updateTransferStatus
};
