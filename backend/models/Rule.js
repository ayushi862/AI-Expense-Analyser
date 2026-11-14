// NEW model - merchant -> category rules per user. Skip/merge if you already have one.
const mongoose = require('mongoose');

const ruleSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    merchant: { type: String, required: true, trim: true, lowercase: true },
    category: { type: String, required: true },
    priority: { type: Number, default: 10 }, // higher number = applied first
    source: { type: String, enum: ['manual', 'correction'], default: 'manual' },
  },
  { timestamps: true }
);

ruleSchema.index({ user: 1, merchant: 1 }, { unique: true });

module.exports = mongoose.models.Rule || mongoose.model('Rule', ruleSchema);
