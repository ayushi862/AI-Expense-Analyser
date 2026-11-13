const mongoose = require("mongoose");

const savingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    goalName: {
        type: String,
        required: true
    },
    targetAmount: {
        type: Number,
        required: true,
        min: 0
    },
    savedAmount: {
        type: Number,
        default: 0,
        min: 0
    },
    targetDate: {
        type: Date
    },
    description: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model("Saving", savingSchema);