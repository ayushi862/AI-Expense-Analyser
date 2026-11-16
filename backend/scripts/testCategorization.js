/**
 * Run:  AI_MOCK=true node scripts/testCategorization.js
 *       node scripts/testCategorization.js           (real AI, needs ANTHROPIC_API_KEY)
 */
try { require('dotenv').config(); } catch (_) {}
const { categorizeDescriptions, isMock } = require('../services/ai/aiClient');

const SAMPLES = [
  ['ZOMATO ORDER 4821 BANGALORE', 'Food'],
  ['UPI/BIGBASKET/9876543210', 'Groceries'],
  ['HPCL PETROL PUMP PANIPAT', 'Fuel'],
  ['UBER INDIA TRIP', 'Travel'],
  ['Amazon Pay - Order 402-8812', 'Shopping'],
  ['NETFLIX.COM MONTHLY', 'Entertainment'],
  ['APOLLO PHARMACY 1123', 'Healthcare'],
  ['UDEMY COURSE PURCHASE', 'Education'],
  ['BESCOM ELECTRICITY BILL', 'Utilities'],
  ['HDFC LOAN EMI 03/12', 'EMI'],
  ['UPI/RAHUL SHARMA/SENT TO FRIEND', 'Transfer'],
  ['SALARY CREDIT ACME PVT LTD', 'Income'],
  ['House rent November to landlord', 'Rent'],
  ['IRCTC TICKET BOOKING', 'Travel'],
  ['RANDOM VENDOR 7731', 'Others'],
];

(async () => {
  console.log(`Mode: ${isMock() ? 'MOCK' : 'LIVE'}\n`);
  const results = await categorizeDescriptions(SAMPLES.map((s) => s[0]));
  let pass = 0;
  results.forEach((r, i) => {
    const ok = r.category === SAMPLES[i][1];
    if (ok) pass++;
    console.log(`${ok ? 'OK  ' : 'FAIL'} ${r.description.padEnd(38)} -> ${r.category.padEnd(14)} (expected ${SAMPLES[i][1]}, conf ${r.confidence})`);
  });
  console.log(`\n${pass}/${SAMPLES.length} matched expectations`);
})();
