
const mongoose = require("mongoose");

const ruleSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        merchant: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },
        category: {
            type: String,
            required: true
        },
        priority: {
            type: Number,
            default: 10
        },
        source: {
            type: String,
            enum: ["manual", "correction"],
            default: "manual"
        }
    },
    { timestamps: true }
);

ruleSchema.index({ user: 1, merchant: 1 }, { unique: true });

module.exports = mongoose.models.Rule || mongoose.model("Rule", ruleSchema);
