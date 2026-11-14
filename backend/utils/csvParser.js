
const { parse } = require("csv-parse/sync");
const { detectBankFormat } = require("./bankFormats");

// Convert different date formats into YYYY-MM-DD
function parseDate(value) {
  if (!value) return null;

  const input = String(value).trim();

  // YYYY-MM-DD
  let match = input.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);

  if (match) {
    const [, year, month, day] = match;

    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  // DD/MM/YYYY or DD-MM-YYYY
  match = input.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);

  if (match) {
    const [, day, month, year] = match;

    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  // Other recognizable date formats
  const parsed = new Date(input);

  if (!Number.isNaN(parsed.getTime())) {
    return [
      parsed.getFullYear(),
      String(parsed.getMonth() + 1).padStart(2, "0"),
      String(parsed.getDate()).padStart(2, "0")
    ].join("-");
  }

  return null;
}

// Convert amount into a number
function parseAmount(value) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const input = String(value).trim();

  const isNegative =
    input.includes("-") ||
    /^\(.*\)$/.test(input) ||
    /\bdr\b|debit/i.test(input);

  const number = Number(
    input
      .replace(/[₹,$\s()]/g, "")
      .replace(/[A-Za-z]/g, "")
  );

  if (!Number.isFinite(number)) {
    return null;
  }

  return isNegative ? -Math.abs(number) : Math.abs(number);
}

// Identify whether transaction is debit or credit
function getTransactionType(row, mapping, rawAmount) {
  const typeValue = mapping.type
    ? String(row[mapping.type] || "").trim().toLowerCase()
    : "";

  if (
    typeValue.includes("dr") ||
    typeValue.includes("debit")
  ) {
    return "debit";
  }

  if (
    typeValue.includes("cr") ||
    typeValue.includes("credit")
  ) {
    return "credit";
  }

  if (rawAmount < 0) {
    return "debit";
  }

  return "credit";
}

// Main CSV parser function
function parseCsv(csvText) {
  if (!csvText || !String(csvText).trim()) {
    throw new Error("CSV file is empty.");
  }

  const records = parse(csvText, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    bom: true,
    relax_column_count: true
  });

  if (records.length === 0) {
    throw new Error("CSV file does not contain any transaction rows.");
  }

  const headers = Object.keys(records[0]);

  const mapping = detectBankFormat(headers);

  return records.map((row, index) => {
    let rawAmount;

    // Handle separate debit and credit columns
    if (mapping.debit || mapping.credit) {
      const debit = mapping.debit
        ? parseAmount(row[mapping.debit])
        : 0;

      const credit = mapping.credit
        ? parseAmount(row[mapping.credit])
        : 0;

      rawAmount = (credit || 0) - Math.abs(debit || 0);
    } else {
      // Handle single amount column
      rawAmount = parseAmount(row[mapping.amount]);
    }

    const date = parseDate(row[mapping.date]);

    const description = String(
      row[mapping.description] || ""
    ).trim();

    if (
      !date ||
      !description ||
      rawAmount === null
    ) {
      throw new Error(
        `Invalid transaction data at CSV row ${index + 2}. Please check date, description and amount.`
      );
    }

    return {
      date,
      description,
      amount: Math.abs(rawAmount),
      type: getTransactionType(row, mapping, rawAmount)
    };
  });
}

module.exports = {
  parseCsv,
  parseDate,
  parseAmount
};
