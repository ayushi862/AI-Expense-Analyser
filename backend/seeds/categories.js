/**
 * 14 PRD categories. Reuses the existing models/Category.js.
 * Run:  node seeds/categories.js
 * Defaults are stored with user: null (matches Category.js schema).
 */
const DEFAULT_CATEGORIES = [
  { name: 'Food',          type: 'Expense', description: 'Restaurants, cafes, food delivery' },
  { name: 'Shopping',      type: 'Expense', description: 'Clothes, electronics, online shopping' },
  { name: 'Travel',        type: 'Expense', description: 'Cabs, trains, flights, hotels' },
  { name: 'Rent',          type: 'Expense', description: 'House or office rent' },
  { name: 'Entertainment', type: 'Expense', description: 'Movies, OTT, games, events' },
  { name: 'Healthcare',    type: 'Expense', description: 'Doctors, medicines, hospitals' },
  { name: 'Education',     type: 'Expense', description: 'Fees, courses, books' },
  { name: 'Utilities',     type: 'Expense', description: 'Electricity, water, gas, mobile, internet' },
  { name: 'Groceries',     type: 'Expense', description: 'Supermarket and daily essentials' },
  { name: 'Fuel',          type: 'Expense', description: 'Petrol, diesel, CNG' },
  { name: 'EMI',           type: 'Expense', description: 'Loan EMIs and credit card bills' },
  { name: 'Transfer',      type: 'Expense', description: 'Transfers between accounts or to people' },
  { name: 'Income',        type: 'Income',  description: 'Salary, refunds, interest, other income' },
  { name: 'Others',        type: 'Expense', description: 'Anything that does not fit elsewhere' },
];

const CATEGORY_NAMES = DEFAULT_CATEGORIES.map((c) => c.name);

async function seedCategories() {
  const Category = require('../models/Category');
  for (const c of DEFAULT_CATEGORIES) {
    await Category.updateOne(
      { name: c.name, user: null },
      { $set: { ...c, user: null } },
      { upsert: true }
    );
  }
  return DEFAULT_CATEGORIES.length;
}

module.exports = { DEFAULT_CATEGORIES, CATEGORY_NAMES, seedCategories };

// CLI usage: node seeds/categories.js
if (require.main === module) {
  require('dotenv').config();
  const mongoose = require('mongoose');
  mongoose
    .connect(process.env.MONGO_URI || process.env.MONGODB_URI)
    .then(seedCategories)
    .then((n) => console.log(`Seeded ${n} categories`))
    .catch((e) => { console.error(e); process.exitCode = 1; })
    .finally(() => mongoose.disconnect());
}
