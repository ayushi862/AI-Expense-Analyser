const mongoose = require("mongoose");

const ruleSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    keyword: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    priority: {
        type: Number,
        default: 1
    }
}, { timestamps: true });

module.exports = mongoose.model("Rule", ruleSchema);
