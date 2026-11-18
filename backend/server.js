
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const accountRoutes = require("./routes/accountRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const importRoutes = require("./routes/importRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const ruleRoutes = require("./routes/ruleRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const exportRoutes = require("./routes/exportRoutes");
const reportRoutes = require("./routes/reportRoutes");

require("dotenv").config();

const connectDB = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/import", importRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/rules", ruleRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/export", exportRoutes);
app.use("/api/report", reportRoutes);

app.get("/", (req, res) => {
    res.send("AI Expense Analyser API Running");
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer();
