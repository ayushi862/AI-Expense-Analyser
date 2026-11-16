/**
 * AI client.
 *  - AI_MOCK=true  -> no network call, returns fake-but-plausible categories
 *                     (so the rest of the team is never blocked).
 *  - otherwise     -> Anthropic Messages API (needs ANTHROPIC_API_KEY).
 * Requires Node 18+ (global fetch).
 */
const { safeJsonParse } = require('./safeJson');
const { CATEGORIZATION_SYSTEM, buildCategorizationPrompt } = require('./prompts');
const { CATEGORY_NAMES } = require('../../seeds/categories');

const isMock = () => String(process.env.AI_MOCK).toLowerCase() === 'true';

const KEYWORDS = [
  ['Food', /zomato|swiggy|restaurant|cafe|pizza|burger|dominos|mcdonald|starbucks|biryani/i],
  ['Groceries', /bigbasket|blinkit|zepto|dmart|grocery|kirana|vegetable|instamart/i],
  ['Fuel', /petrol|diesel|hpcl|iocl|bpcl|shell|fuel/i],
  ['Travel', /uber|ola|irctc|makemytrip|flight|indigo|redbus|hotel|metro/i],
  ['Rent', /rent|landlord/i],
  ['Entertainment', /netflix|spotify|prime video|hotstar|bookmyshow|movie|inox|pvr/i],
  ['Healthcare', /pharmacy|apollo|medplus|hospital|clinic|doctor|1mg|pharmeasy/i],
  ['Education', /school|college|udemy|coursera|tuition|byju|fees/i],
  ['Utilities', /electricity|water bill|gas|airtel|jio|vodafone|recharge|broadband|bescom/i],
  ['EMI', /emi|loan|credit card bill|bajaj finserv/i],
  ['Income', /salary|refund|interest credit|cashback|dividend/i],
  ['Transfer', /upi\/|neft|imps|transfer|sent to|self/i],
  ['Shopping', /amazon|flipkart|myntra|ajio|nykaa|meesho|mall|store/i],
];

function mockCategory(description) {
  const hit = KEYWORDS.find(([, re]) => re.test(description));
  return hit ? hit[0] : 'Others';
}

async function callAnthropic({ system, prompt, maxTokens, retries = 2 }) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not set (or set AI_MOCK=true)');

  let lastErr;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        signal: AbortSignal.timeout(Number(process.env.AI_TIMEOUT_MS) || 30000),
        headers: {
          'content-type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: process.env.AI_MODEL || 'claude-haiku-5-5',
          max_tokens: maxTokens,
          system,
          messages: [{ role: 'user', content: prompt }],
        }),
      });
      if (!res.ok) throw new Error(`AI API ${res.status}: ${(await res.text()).slice(0, 200)}`);
      const data = await res.json();
      return (data.content || []).filter((b) => b.type === 'text').map((b) => b.text).join('');
    } catch (err) {
      lastErr = err;
      await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
    }
  }
  throw lastErr;
}

/**
 * Generic LLM call. Returns raw text.
 * In mock mode, pass `mock` (string | () => string) to control the fake response.
 */
async function callAI({ system = '', prompt, maxTokens = 1000, mock }) {
  if (isMock()) {
    return typeof mock === 'function' ? mock() : mock ?? '{}';
  }
  return callAnthropic({ system, prompt, maxTokens });
}

/**
 * Categorize descriptions. Always returns one entry per input:
 *   [{ description, category, confidence }]
 * Invalid / missing categories fall back to "Others". Never throws.
 */
async function categorizeDescriptions(descriptions, { batchSize = 25 } = {}) {
  const out = [];
  for (let i = 0; i < descriptions.length; i += batchSize) {
    const batch = descriptions.slice(i, i + batchSize);
    let parsed = null;
    try {
      const raw = await callAI({
        system: CATEGORIZATION_SYSTEM,
        prompt: buildCategorizationPrompt(batch),
        maxTokens: 1500,
        mock: () =>
          JSON.stringify({
            results: batch.map((d, idx) => ({ index: idx, category: mockCategory(d), confidence: 0.9 })),
          }),
      });
      parsed = safeJsonParse(raw, null);
    } catch (err) {
      console.error('[aiClient] categorize failed:', err.message);
    }

    const byIndex = new Map((parsed?.results || []).map((r) => [Number(r.index), r]));
    batch.forEach((description, idx) => {
      const r = byIndex.get(idx);
      const valid = r && CATEGORY_NAMES.includes(r.category);
      out.push({
        description,
        category: valid ? r.category : 'Others',
        confidence: valid ? Number(r.confidence) || 0.5 : 0,
      });
    });
  }
  return out;
}

module.exports = { callAI, categorizeDescriptions, isMock };
