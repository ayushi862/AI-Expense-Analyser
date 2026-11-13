
const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    bankName: {
        type: String,
        trim: true
    },
    type: {
        type: String,
        enum: ["bank", "upi"],
        required: true
    },
    last4: {
        type: String,
        maxlength: 4
    },
    openingBalance: {
        type: Number,
        default: 0
    },
    linkedAccountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model("Account", accountSchema);
