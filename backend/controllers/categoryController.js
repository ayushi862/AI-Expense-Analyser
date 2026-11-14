const Category = require('../models/Category');
const { DEFAULT_CATEGORIES, CATEGORY_NAMES } = require('../seeds/categories');

const uidOf = (req) => req.user?._id || req.user?.id || req.userId || null;

/** Default categories (user: null) plus the user's own custom ones. */
const visibleFilter = (userId) => (userId ? { $or: [{ user: null }, { user: userId }] } : { user: null });

/** All valid category names for a user (DB first, seed list as fallback). */
async function getCategoryNames(userId = null) {
  try {
    const docs = await Category.find(visibleFilter(userId), 'name').lean();
    if (docs.length) return [...new Set(docs.map((d) => d.name))];
  } catch (_) { /* fall back */ }
  return CATEGORY_NAMES;
}

/** Case-insensitive match -> canonical category name, or null if invalid. */
async function resolveCategory(name, userId = null) {
  if (!name) return null;
  const names = await getCategoryNames(userId);
  return names.find((n) => n.toLowerCase() === String(name).trim().toLowerCase()) || null;
}

// GET /api/categories
async function listCategories(req, res) {
  try {
    let categories = await Category.find(visibleFilter(uidOf(req))).sort({ name: 1 }).lean();
    if (!categories.length) categories = DEFAULT_CATEGORIES;
    res.json({ success: true, count: categories.length, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = { listCategories, getCategoryNames, resolveCategory };
