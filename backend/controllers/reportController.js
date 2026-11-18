
const PDFDocument = require("pdfkit");
const Transaction = require("../models/Transaction");
const Budget = require("../models/Budget");

const exportPDF = async (req, res) => {
    try {
        const { month } = req.query;

        const now = new Date();
        let year = now.getUTCFullYear();
        let monthNumber = now.getUTCMonth() + 1;

        if (month) {
            if (!/^\d{4}-\d{2}$/.test(month)) {
                return res.status(400).json({
                    message: "Month must be in YYYY-MM format"
                });
            }

            [year, monthNumber] = month.split("-").map(Number);

            if (monthNumber < 1 || monthNumber > 12) {
                return res.status(400).json({
                    message: "Invalid month"
                });
            }
        }

        const startDate = new Date(Date.UTC(year, monthNumber - 1, 1));
        const endDate = new Date(Date.UTC(year, monthNumber, 1));

        const filter = {
            userId: req.user.id,
            isTransfer: { $ne: true },
            date: { $gte: startDate, $lt: endDate }
        };

        const [transactions, budgets] = await Promise.all([
            Transaction.find(filter)
                .populate("category", "name")
                .sort({ date: -1 }),

            Budget.find({
                user: req.user.id,
                month: monthNumber,
                year
            }).populate("category", "name")
        ]);

        // Calculate income and expenses
        let income = 0;
        let expense = 0;

        transactions.forEach((transaction) => {
            if (transaction.type === "credit") {
                income += transaction.amount;
            } else if (transaction.type === "debit") {
                expense += transaction.amount;
            }
        });

        const savings = income - expense;

        // Category-wise expenses
        const categoryTotals = new Map();

        transactions
            .filter((transaction) => transaction.type === "debit")
            .forEach((transaction) => {
                const name = transaction.category?.name || "Uncategorized";

                categoryTotals.set(
                    name,
                    (categoryTotals.get(name) || 0) + transaction.amount
                );
            });

        // Top 5 merchants
        const merchantTotals = new Map();

        transactions
            .filter((transaction) =>
                transaction.type === "debit" && transaction.merchant
            )
            .forEach((transaction) => {
                const name = transaction.merchant;

                merchantTotals.set(
                    name,
                    (merchantTotals.get(name) || 0) + transaction.amount
                );
            });

        const topMerchants = [...merchantTotals.entries()]
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        // Generate PDF
        const doc = new PDFDocument({ margin: 50 });

        const filename = `expense-report-${year}-${String(monthNumber).padStart(2, "0")}.pdf`;

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${filename}"`
        );

        doc.pipe(res);

        doc.fontSize(20).text("AI Expense Analyser", { align: "center" });
        doc.moveDown(0.5);

        doc.fontSize(14).text("Monthly Expense Report", { align: "center" });
        doc.fontSize(11).text(
            `${year}-${String(monthNumber).padStart(2, "0")}`,
            { align: "center" }
        );

        doc.moveDown(2);

        // Financial summary
        doc.fontSize(15).text("Financial Summary");
        doc.moveDown(0.5);

        doc.fontSize(11);
        doc.text(`Total Income: Rs. ${income.toFixed(2)}`);
        doc.text(`Total Expenses: Rs. ${expense.toFixed(2)}`);
        doc.text(`Savings: Rs. ${savings.toFixed(2)}`);

        // Category split
        doc.moveDown(1.5);
        doc.fontSize(15).text("Category-wise Expenses");
        doc.moveDown(0.5);

        doc.fontSize(11);

        if (categoryTotals.size === 0) {
            doc.text("No expense records found.");
        } else {
            for (const [category, amount] of categoryTotals) {
                doc.text(`${category}: Rs. ${amount.toFixed(2)}`);
            }
        }

        // Top merchants
        doc.moveDown(1.5);
        doc.fontSize(15).text("Top 5 Merchants");
        doc.moveDown(0.5);

        doc.fontSize(11);

        if (topMerchants.length === 0) {
            doc.text("No merchant records found.");
        } else {
            topMerchants.forEach(([merchant, amount], index) => {
                doc.text(
                    `${index + 1}. ${merchant}: Rs. ${amount.toFixed(2)}`
                );
            });
        }

        // Budget status
        doc.moveDown(1.5);
        doc.fontSize(15).text("Budget Status");
        doc.moveDown(0.5);

        doc.fontSize(11);

        if (budgets.length === 0) {
            doc.text("No budgets found for this month.");
        } else {
            for (const budget of budgets) {
                const categoryName =
                    budget.category?.name || "Overall Budget";

                const spent = budget.category
                    ? categoryTotals.get(categoryName) || 0
                    : expense;

                const remaining = budget.amount - spent;
                const percentage = budget.amount > 0
                    ? (spent / budget.amount) * 100
                    : 0;

                const status = percentage >= 100
                    ? "Exceeded"
                    : percentage >= 80
                        ? "Near Limit"
                        : "Within Limit";

                doc.text(
                    `${categoryName}: Budget Rs. ${budget.amount.toFixed(2)}, ` +
                    `Spent Rs. ${spent.toFixed(2)}, ` +
                    `Remaining Rs. ${remaining.toFixed(2)} (${status})`
                );
            }
        }

        doc.end();

    } catch (error) {
        console.error("PDF Report Error:", error);

        if (!res.headersSent) {
            return res.status(500).json({
                message: "Failed to generate PDF report"
            });
        }
    }
};

module.exports = { exportPDF };
