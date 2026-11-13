
const FIELD_ALIASES = {
  date: [
    "date",
    "transaction date",
    "txn date",
    "value date",
    "posting date"
  ],
  description: [
    "description",
    "narration",
    "details",
    "particulars",
    "transaction details",
    "remarks"
  ],
  amount: [
    "amount",
    "transaction amount",
    "txn amount",
    "withdrawal",
    "deposit"
  ],
  type: [
    "type",
    "transaction type",
    "dr/cr",
    "debit/credit"
  ],
  debit: [
    "debit",
    "withdrawal amount",
    "withdrawal"
  ],
  credit: [
    "credit",
    "deposit amount",
    "deposit"
  ]
};

function normalizeHeader(header) {
  return String(header || "")
    .trim()
    .toLowerCase()
    .replace(/[_-]/g, " ")
    .replace(/\s+/g, " ");
}

function detectBankFormat(headers) {
  const normalizedHeaders = headers.map(normalizeHeader);
  const mapping = {};

  for (const [field, aliases] of Object.entries(FIELD_ALIASES)) {
    const match = aliases.find(alias =>
      normalizedHeaders.includes(normalizeHeader(alias))
    );

    if (match) {
      mapping[field] = headers[
        normalizedHeaders.indexOf(normalizeHeader(match))
      ];
    }
  }

  if (!mapping.date || !mapping.description) {
    throw new Error(
      "CSV must contain a date column and a description/narration column."
    );
  }

  if (!mapping.amount && !mapping.debit && !mapping.credit) {
    throw new Error(
      "CSV must contain an amount, debit, or credit column."
    );
  }

  return mapping;
}

module.exports = {
  FIELD_ALIASES,
  normalizeHeader,
  detectBankFormat
};
