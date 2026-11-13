
const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    accountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    merchant: {
        type: String,
        default: ""
    },
    referenceNo: {
        type: String,
        default: ""
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    type: {
        type: String,
        enum: ["debit", "credit"],
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        default: null
    },
    subcategory: {
        type: String,
        default: ""
    },
    categorySource: {
        type: String,
        enum: ["rule", "ai", "manual"],
        default: "manual"
    },
    confidence: {
        type: Number,
        min: 0,
        max: 1,
        default: null
    },
    needsReview: {
        type: Boolean,
        default: false
    },
    aiResult: {
        type: mongoose.Schema.Types.Mixed,
        default: null
    },
    isTransfer: {
        type: Boolean,
        default: false
    },
    transferPairId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction",
        default: null
    },
    isRecurring: {
        type: Boolean,
        default: false
    },
    dedupHash: {
        type: String,
        required: true
    }
}, { timestamps: true });

transactionSchema.index(
    { userId: 1, dedupHash: 1 },
    { unique: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
