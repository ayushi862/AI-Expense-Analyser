const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },
    date: {
        type: Date,
        default: Date.now
    },
    paymentMethod: {
        type: String,
        enum: ["Cash", "UPI", "Card", "Bank Transfer", "Other"],
        default: "Other"
    },
    description: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model("Expense", expenseSchema);