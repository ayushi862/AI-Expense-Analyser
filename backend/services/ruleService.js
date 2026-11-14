const Rule = require('../models/Rule');
const { categorizeDescriptions } = require('./ai/aiClient');

// Graceful import of category resolver with static fallback if model is not yet loaded
let resolveCategory;
try {
  const catController = require('../controllers/categoryController');
  resolveCategory = catController.resolveCategory;
} catch (_) {
  const { CATEGORY_NAMES } = require('../seeds/categories');
  resolveCategory = async (name) => {
    if (!name) return null;
    const target = String(name).trim().toLowerCase();
    return CATEGORY_NAMES.find((c) => c.toLowerCase() === target) || null;
  };
}

/**
 * Normalizes a merchant name or keyword for consistent matching and storage.
 *
 * @param {string} m - Raw merchant string
 * @returns {string} - Cleaned lowercase string
 */
const normalizeMerchant = (m) => String(m || '').trim().toLowerCase();

/**
 * Upsert or update a merchant-category rule when a user corrects a transaction category.
 *
 * @param {string|import('mongoose').Types.ObjectId} userId - User identifier
 * @param {string} merchant - Merchant name or keyword
 * @param {string} category - Canonical target category name
 * @param {number} [priority] - Rule evaluation priority (higher = evaluated first)
 * @returns {Promise<import('../models/Rule')>}
 */
async function createRuleFromCorrection(userId, merchant, category, priority) {
  if (!userId) throw new Error('User ID is required to create a rule');
  const m = normalizeMerchant(merchant);
  if (!m) throw new Error('Merchant is required');

  const cat = await resolveCategory(category, userId);
  if (!cat) throw new Error(`Invalid category: ${category}`);

  const set = { category: cat, source: 'correction' };
  if (priority !== undefined && priority !== null) {
    const p = Number(priority);
    if (!Number.isNaN(p)) {
      set.priority = p;
    }
  }

  return Rule.findOneAndUpdate(
    { user: userId, merchant: m },
    { $set: set, $setOnInsert: { user: userId, merchant: m } },
    { upsert: true, new: true, runValidators: true }
  );
}

/**
 * Finds the highest-priority rule matching the transaction description for a given user.
 *
 * @param {string|import('mongoose').Types.ObjectId} userId - User identifier
 * @param {string} description - Transaction description / narration
 * @param {Array<object>} [cachedRules=null] - Optional pre-loaded rules to avoid database queries
 * @returns {Promise<object|null>} - Matched rule object or null
 */
async function findMatchingRule(userId, description, cachedRules = null) {
  if (!userId || !description) return null;
  const d = String(description).toLowerCase();

  let rules = cachedRules;
  if (!rules) {
    try {
      rules = await Rule.find({ user: userId }).sort({ priority: -1 }).lean();
    } catch (err) {
      console.error('[ruleService] findMatchingRule database error:', err.message);
      return null;
    }
  }

  if (!Array.isArray(rules) || rules.length === 0) return null;
  return rules.find((r) => r.merchant && d.includes(r.merchant)) || null;
}

/**
 * Categorizes a single transaction description.
 * Evaluation order:
 *  1. User custom merchant rules (100% confidence)
 *  2. AI categorization model (Anthropic Claude / Mock)
 *  3. Fallback to "Others"
 *
 * @param {string|import('mongoose').Types.ObjectId} userId - User identifier
 * @param {string} description - Transaction description / narration
 * @returns {Promise<{ description: string, category: string, source: string, confidence: number, ruleId?: string|null }>}
 */
async function categorizeTransaction(userId, description) {
  const desc = String(description || '').trim();
  if (!desc) {
    return {
      description: '',
      category: 'Others',
      source: 'default',
      confidence: 0,
    };
  }

  // 1. Check user-defined custom rules
  try {
    const matchedRule = await findMatchingRule(userId, desc);
    if (matchedRule) {
      return {
        description: desc,
        category: matchedRule.category,
        source: matchedRule.source || 'rule',
        confidence: 1.0,
        ruleId: matchedRule._id || null,
        merchant: matchedRule.merchant,
      };
    }
  } catch (err) {
    console.error('[ruleService] Error matching user rules:', err.message);
  }

  // 2. Fall back to AI categorization
  try {
    const [aiResult] = await categorizeDescriptions([desc]);
    if (aiResult) {
      return {
        description: desc,
        category: aiResult.category,
        source: 'ai',
        confidence: aiResult.confidence,
      };
    }
  } catch (err) {
    console.error('[ruleService] AI categorization error:', err.message);
  }

  // 3. Default fallback
  return {
    description: desc,
    category: 'Others',
    source: 'fallback',
    confidence: 0,
  };
}

/**
 * Categorizes an array of transactions with optimized batching:
 *  - Loads user rules once in a single database query.
 *  - Matches rules across the batch in memory.
 *  - Bundles all unmatched transactions into a single AI batch request.
 *
 * @param {string|import('mongoose').Types.ObjectId} userId - User identifier
 * @param {Array<string|object>} transactions - Array of descriptions or transaction objects
 * @returns {Promise<Array<object>>} - List of categorized transactions
 */
async function categorizeTransactions(userId, transactions) {
  if (!Array.isArray(transactions) || transactions.length === 0) {
    return [];
  }

  const items = transactions.map((t) => {
    if (typeof t === 'string') return { raw: t, description: t.trim() };
    const desc = t.description || t.narration || t.merchant || '';
    return { raw: t, description: String(desc).trim() };
  });

  // Pre-load all user rules in one query
  let rules = [];
  if (userId) {
    try {
      rules = await Rule.find({ user: userId }).sort({ priority: -1 }).lean();
    } catch (err) {
      console.error('[ruleService] Error pre-loading user rules for batch:', err.message);
    }
  }

  const results = new Array(items.length);
  const unmatchedIndices = [];
  const unmatchedDescriptions = [];

  // Match items against rules
  items.forEach((item, index) => {
    const matchedRule = rules.find((r) => r.merchant && item.description.toLowerCase().includes(r.merchant));
    if (matchedRule) {
      results[index] = {
        ...(typeof item.raw === 'object' ? item.raw : { description: item.description }),
        category: matchedRule.category,
        source: matchedRule.source || 'rule',
        confidence: 1.0,
        ruleId: matchedRule._id || null,
      };
    } else {
      unmatchedIndices.push(index);
      unmatchedDescriptions.push(item.description);
    }
  });

  // Batch process unmatched transactions through AI
  if (unmatchedDescriptions.length > 0) {
    let aiOutputs = [];
    try {
      aiOutputs = await categorizeDescriptions(unmatchedDescriptions);
    } catch (err) {
      console.error('[ruleService] AI batch categorization error:', err.message);
    }

    unmatchedIndices.forEach((origIndex, i) => {
      const aiResult = aiOutputs[i];
      const item = items[origIndex];
      results[origIndex] = {
        ...(typeof item.raw === 'object' ? item.raw : { description: item.description }),
        category: aiResult?.category || 'Others',
        source: aiResult ? 'ai' : 'fallback',
        confidence: aiResult?.confidence ?? 0,
      };
    });
  }

  return results;
}

module.exports = {
  createRuleFromCorrection,
  findMatchingRule,
  normalizeMerchant,
  categorizeTransaction,
  categorizeTransactions,
};
