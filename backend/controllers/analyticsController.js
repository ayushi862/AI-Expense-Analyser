
const mongoose = require("mongoose");
const Transaction = require("../models/Transaction");

// Common filter for logged-in user and transfers
const getBaseFilter = (userId, month) => {
    const filter = {
        userId: new mongoose.Types.ObjectId(userId),
        isTransfer: { $ne: true }
    };

    if (month) {
        if (!/^\d{4}-\d{2}$/.test(month)) {
            throw new Error("Month must be in YYYY-MM format");
        }

        const [year, monthNumber] = month.split("-").map(Number);

        if (monthNumber < 1 || monthNumber > 12) {
            throw new Error("Invalid month");
        }

        filter.date = {
            $gte: new Date(Date.UTC(year, monthNumber - 1, 1)),
            $lt: new Date(Date.UTC(year, monthNumber, 1))
        };
    }

    return filter;
};

// 1. GET ANALYTICS SUMMARY
const getSummary = async (req, res) => {
    try {
        const filter = getBaseFilter(req.user.id, req.query.month);

        const [totals, dailyExpenses, highestCategory, highestDay] =
            await Promise.all([
                Transaction.aggregate([
                    { $match: filter },
                    {
                        $group: {
                            _id: null,
                            income: {
                                $sum: {
                                    $cond: [
                                        { $eq: ["$type", "credit"] },
                                        "$amount",
                                        0
                                    ]
                                }
                            },
                            expense: {
                                $sum: {
                                    $cond: [
                                        { $eq: ["$type", "debit"] },
                                        "$amount",
                                        0
                                    ]
                                }
                            }
                        }
                    }
                ]),

                Transaction.aggregate([
                    { $match: { ...filter, type: "debit" } },
                    {
                        $group: {
                            _id: {
                                $dateToString: {
                                    format: "%Y-%m-%d",
                                    date: "$date",
                                    timezone: "UTC"
                                }
                            },
                            total: { $sum: "$amount" }
                        }
                    }
                ]),

                Transaction.aggregate([
                    { $match: { ...filter, type: "debit", category: { $ne: null } } },
                    {
                        $group: {
                            _id: "$category",
                            total: { $sum: "$amount" }
                        }
                    },
                    { $sort: { total: -1 } },
                    { $limit: 1 },
                    {
                        $lookup: {
                            from: "categories",
                            localField: "_id",
                            foreignField: "_id",
                            as: "categoryInfo"
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            category: {
                                $ifNull: [
                                    { $arrayElemAt: ["$categoryInfo.name", 0] },
                                    "Unknown"
                                ]
                            },
                            amount: "$total"
                        }
                    }
                ]),

                Transaction.aggregate([
                    { $match: { ...filter, type: "debit" } },
                    {
                        $group: {
                            _id: {
                                $dateToString: {
                                    format: "%Y-%m-%d",
                                    date: "$date",
                                    timezone: "UTC"
                                }
                            },
                            total: { $sum: "$amount" }
                        }
                    },
                    { $sort: { total: -1 } },
                    { $limit: 1 }
                ])
            ]);

        const income = totals[0]?.income || 0;
        const expense = totals[0]?.expense || 0;
        const savings = income - expense;

        const averageDailySpend = dailyExpenses.length
            ? expense / dailyExpenses.length
            : 0;

        return res.status(200).json({
            message: "Analytics summary fetched successfully",
            summary: {
                income,
                expense,
                savings,
                savingsPercentage: income > 0
                    ? Number(((savings / income) * 100).toFixed(2))
                    : 0,
                averageDailySpend: Number(averageDailySpend.toFixed(2)),
                highestCategory: highestCategory[0] || null,
                highestSpendingDay: highestDay[0] || null
            }
        });
    } catch (error) {
        console.error("Summary Error:", error);
        return res.status(error.message.includes("Month") ||
            error.message.includes("month")
            ? 400 : 500).json({
                message: error.message || "Failed to fetch analytics summary"
            });
    }
};

// 2. GET CATEGORY SPLIT
const getCategorySplit = async (req, res) => {
    try {
        const filter = getBaseFilter(req.user.id, req.query.month);

        const categories = await Transaction.aggregate([
            { $match: { ...filter, type: "debit" } },
            {
                $group: {
                    _id: "$category",
                    amount: { $sum: "$amount" }
                }
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "_id",
                    foreignField: "_id",
                    as: "categoryInfo"
                }
            },
            {
                $project: {
                    _id: 0,
                    category: {
                        $ifNull: [
                            { $arrayElemAt: ["$categoryInfo.name", 0] },
                            "Uncategorized"
                        ]
                    },
                    amount: 1
                }
            },
            { $sort: { amount: -1 } }
        ]);

        const totalExpense = categories.reduce(
            (sum, item) => sum + item.amount, 0
        );

        const result = categories.map(item => ({
            ...item,
            percentage: totalExpense > 0
                ? Number(((item.amount / totalExpense) * 100).toFixed(2))
                : 0
        }));

        return res.status(200).json({
            message: "Category split fetched successfully",
            totalExpense,
            categories: result
        });
    } catch (error) {
        console.error("Category Split Error:", error);
        return res.status(error.message.toLowerCase().includes("month")
            ? 400 : 500).json({
                message: error.message || "Failed to fetch category split"
            });
    }
};

// 3. GET MONTHLY TREND
const getMonthlyTrend = async (req, res) => {
    try {
        const filter = getBaseFilter(req.user.id, req.query.month);

        const monthlyTrend = await Transaction.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: {
                        year: { $year: "$date" },
                        month: { $month: "$date" }
                    },
                    income: {
                        $sum: {
                            $cond: [
                                { $eq: ["$type", "credit"] },
                                "$amount",
                                0
                            ]
                        }
                    },
                    expense: {
                        $sum: {
                            $cond: [
                                { $eq: ["$type", "debit"] },
                                "$amount",
                                0
                            ]
                        }
                    }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
            {
                $project: {
                    _id: 0,
                    year: "$_id.year",
                    month: "$_id.month",
                    income: 1,
                    expense: 1
                }
            }
        ]);

        return res.status(200).json({
            message: "Monthly trend fetched successfully",
            monthlyTrend
        });
    } catch (error) {
        console.error("Monthly Trend Error:", error);
        return res.status(error.message.toLowerCase().includes("month")
            ? 400 : 500).json({
                message: error.message || "Failed to fetch monthly trend"
            });
    }
};

// 4. GET TOP MERCHANTS
const getTopMerchants = async (req, res) => {
    try {
        const filter = getBaseFilter(req.user.id, req.query.month);

        const merchants = await Transaction.aggregate([
            {
                $match: {
                    ...filter,
                    type: "debit",
                    merchant: { $exists: true, $ne: "" }
                }
            },
            {
                $group: {
                    _id: "$merchant",
                    totalSpent: { $sum: "$amount" },
                    transactions: { $sum: 1 }
                }
            },
            { $sort: { totalSpent: -1 } },
            { $limit: 5 },
            {
                $project: {
                    _id: 0,
                    merchant: "$_id",
                    totalSpent: 1,
                    transactions: 1
                }
            }
        ]);

        return res.status(200).json({
            message: "Top merchants fetched successfully",
            merchants
        });
    } catch (error) {
        console.error("Top Merchants Error:", error);
        return res.status(error.message.toLowerCase().includes("month")
            ? 400 : 500).json({
                message: error.message || "Failed to fetch top merchants"
            });
    }
};

module.exports = {
    getSummary,
    getCategorySplit,
    getMonthlyTrend,
    getTopMerchants
};
