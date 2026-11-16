const Rule = require('../models/Rule');
const { resolveCategory } = require('./categoryController');
const { normalizeMerchant } = require('../services/ruleService');

const uid = (req) => req.user?._id || req.user?.id || req.userId;

// GET /api/rules
exports.getRules = async (req, res) => {
  try {
    const rules = await Rule.find({ user: uid(req) }).sort({ priority: -1, updatedAt: -1 });
    res.json({ success: true, count: rules.length, data: rules });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/rules   { merchant, category, priority? }
exports.createRule = async (req, res) => {
  try {
    const { merchant, category, priority } = req.body;
    const m = normalizeMerchant(merchant);
    const cat = await resolveCategory(category, uid(req));
    if (!m) return res.status(400).json({ success: false, message: 'merchant is required' });
    if (!cat) return res.status(400).json({ success: false, message: 'Invalid category' });

    const rule = await Rule.create({ user: uid(req), merchant: m, category: cat, priority, source: 'manual' });
    res.status(201).json({ success: true, data: rule });
  } catch (err) {
    if (err.code === 11000)
      return res.status(409).json({ success: false, message: 'Rule for this merchant already exists' });
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/rules/:id   { merchant?, category?, priority? }
exports.updateRule = async (req, res) => {
  try {
    const update = {};
    if (req.body.merchant !== undefined) {
      update.merchant = normalizeMerchant(req.body.merchant);
      if (!update.merchant) return res.status(400).json({ success: false, message: 'merchant cannot be empty' });
    }
    if (req.body.category !== undefined) {
      const cat = await resolveCategory(req.body.category, uid(req));
      if (!cat) return res.status(400).json({ success: false, message: 'Invalid category' });
      update.category = cat;
    }
    if (req.body.priority !== undefined) update.priority = req.body.priority;

    const rule = await Rule.findOneAndUpdate({ _id: req.params.id, user: uid(req) }, { $set: update }, { new: true, runValidators: true });
    if (!rule) return res.status(404).json({ success: false, message: 'Rule not found' });
    res.json({ success: true, data: rule });
  } catch (err) {
    if (err.code === 11000)
      return res.status(409).json({ success: false, message: 'Rule for this merchant already exists' });
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/rules/:id
exports.deleteRule = async (req, res) => {
  try {
    const rule = await Rule.findOneAndDelete({ _id: req.params.id, user: uid(req) });
    if (!rule) return res.status(404).json({ success: false, message: 'Rule not found' });
    res.json({ success: true, message: 'Rule deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
