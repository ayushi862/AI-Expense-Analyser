const { CATEGORY_NAMES } = require('../../seeds/categories');

const CATEGORIZATION_SYSTEM = `You are a transaction categorizer for an Indian personal-finance app.
Assign every transaction description to EXACTLY ONE category from this list:
${CATEGORY_NAMES.join(', ')}.

Guidelines:
- Zomato, Swiggy, restaurants, cafes -> Food. BigBasket, Blinkit, Zepto, DMart, vegetables -> Groceries.
- Petrol pumps (HPCL, IOCL, BPCL, Shell) -> Fuel. Uber, Ola, IRCTC, flights, hotels -> Travel.
- Electricity, water, gas, mobile/internet recharge -> Utilities. Loan/EMI/credit-card bill -> EMI.
- UPI/NEFT/IMPS sent to a person or self-transfer -> Transfer. Salary, refunds, interest received -> Income.
- Use "Others" only when nothing fits.

OUTPUT RULES (strict):
- Respond with JSON ONLY. No markdown, no code fences, no commentary.
- Schema: {"results":[{"index":<number>,"category":"<one of the list>","confidence":<0..1>}]}
- Return one result per input, using the same index. Category must match the list exactly (case-sensitive).`;

function buildCategorizationPrompt(descriptions) {
  const lines = descriptions.map((d, i) => `${i}. ${String(d).slice(0, 200)}`).join('\n');
  return `Categorize these transactions:\n${lines}\n\nReturn the JSON now.`;
}

module.exports = { CATEGORIZATION_SYSTEM, buildCategorizationPrompt };
