
const ExcelJS = require("exceljs");
const Transaction = require("../models/Transaction");

// GET /api/export/excel?month=YYYY-MM
const exportExcel = async (req, res) => {
    try {
        const { month } = req.query;

        // Logged-in user's transactions only
        const filter = {
            userId: req.user.id,
            isTransfer: { $ne: true }
        };

        // Optional month validation and filtering
        if (month) {
            if (!/^\d{4}-\d{2}$/.test(month)) {
                return res.status(400).json({
                    message: "Month must be in YYYY-MM format"
                });
            }

            const [year, monthNumber] = month.split("-").map(Number);

            if (monthNumber < 1 || monthNumber > 12) {
                return res.status(400).json({
                    message: "Invalid month"
                });
            }

            filter.date = {
                $gte: new Date(Date.UTC(year, monthNumber - 1, 1)),
                $lt: new Date(Date.UTC(year, monthNumber, 1))
            };
        }

        const transactions = await Transaction.find(filter)
            .populate("category", "name")
            .sort({ date: -1 });

        const workbook = new ExcelJS.Workbook();

        workbook.creator = "AI Expense Analyser";
        workbook.created = new Date();

        // Sheet 1: Transactions
        const transactionSheet = workbook.addWorksheet("Transactions");

        transactionSheet.columns = [
            { header: "Date", key: "date", width: 15 },
            { header: "Description", key: "description", width: 30 },
            { header: "Merchant", key: "merchant", width: 25 },
            { header: "Amount", key: "amount", width: 15 },
            { header: "Type", key: "type", width: 12 },
            { header: "Category", key: "category", width: 20 },
            { header: "Subcategory", key: "subcategory", width: 20 }
        ];

        transactions.forEach((transaction) => {
            transactionSheet.addRow({
                date: transaction.date
                    ? transaction.date.toISOString().split("T")[0]
                    : "",
                description: transaction.description,
                merchant: transaction.merchant || "",
                amount: transaction.amount,
                type: transaction.type,
                category: transaction.category?.name || "Uncategorized",
                subcategory: transaction.subcategory || ""
            });
        });

        // Sheet 2: Category Summary
        const summarySheet = workbook.addWorksheet("Category Summary");

        summarySheet.columns = [
            { header: "Category", key: "category", width: 25 },
            { header: "Total Debit", key: "debit", width: 18 },
            { header: "Total Credit", key: "credit", width: 18 }
        ];

        const categorySummary = new Map();

        transactions.forEach((transaction) => {
            const categoryName = transaction.category?.name || "Uncategorized";

            if (!categorySummary.has(categoryName)) {
                categorySummary.set(categoryName, {
                    debit: 0,
                    credit: 0
                });
            }

            const summary = categorySummary.get(categoryName);

            if (transaction.type === "debit") {
                summary.debit += transaction.amount;
            } else if (transaction.type === "credit") {
                summary.credit += transaction.amount;
            }
        });

        for (const [category, totals] of categorySummary) {
            summarySheet.addRow({
                category,
                debit: Number(totals.debit.toFixed(2)),
                credit: Number(totals.credit.toFixed(2))
            });
        }

        // Format headings
        [transactionSheet, summarySheet].forEach((sheet) => {
            sheet.getRow(1).font = { bold: true };
            sheet.getRow(1).alignment = { vertical: "middle" };
            sheet.views = [{ state: "frozen", ySplit: 1 }];
        });

        // Send Excel file
        const filename = month
            ? `expense-report-${month}.xlsx`
            : "expense-report.xlsx";

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${filename}"`
        );

        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        console.error("Excel Export Error:", error);

        if (!res.headersSent) {
            return res.status(500).json({
                message: "Failed to export Excel report"
            });
        }
    }
};

module.exports = { exportExcel };
