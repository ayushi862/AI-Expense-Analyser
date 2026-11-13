
const mongoose = require("mongoose");

const recurringPaymentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    merchant: {
        type: String,
        required: true,
        trim: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    frequency: {
        type: String,
        enum: ["weekly", "monthly", "quarterly", "yearly"],
        required: true
    },
    nextExpectedDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "confirmed", "dismissed"],
        default: "pending"
    }
}, { timestamps: true });

module.exports = mongoose.model("RecurringPayment", recurringPaymentSchema);
