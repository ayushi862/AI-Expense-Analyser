/**
 * Safely parse JSON that came out of an LLM.
 * Handles ```json fences, leading/trailing prose, and returns a fallback
 * instead of throwing.
 */
function safeJsonParse(text, fallback = null) {
  if (typeof text !== 'string') return fallback;

  let cleaned = text.trim().replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim();

  try {
    return JSON.parse(cleaned);
  } catch (_) {
    // fall through to extraction
  }

  // Try to extract the first balanced {...} or [...] block
  const start = cleaned.search(/[\[{]/);
  if (start === -1) return fallback;
  const open = cleaned[start];
  const close = open === '{' ? '}' : ']';
  let depth = 0;
  let inStr = false;
  let esc = false;

  for (let i = start; i < cleaned.length; i++) {
    const ch = cleaned[i];
    if (inStr) {
      if (esc) esc = false;
      else if (ch === '\\') esc = true;
      else if (ch === '"') inStr = false;
      continue;
    }
    if (ch === '"') inStr = true;
    else if (ch === open) depth++;
    else if (ch === close && --depth === 0) {
      try {
        return JSON.parse(cleaned.slice(start, i + 1));
      } catch (_) {
        return fallback;
      }
    }
  }
  return fallback;
}

module.exports = { safeJsonParse };
