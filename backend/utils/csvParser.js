
const { parse } = require("csv-parse/sync");
const { detectBankFormat } = require("./bankFormats");

// Validate and convert date into YYYY-MM-DD
function parseDate(value) {
  if (!value) return null;

  const input = String(value).trim();
  let year, month, day;

  // YYYY-MM-DD
  let match = input.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);

  if (match) {
    [, year, month, day] = match;
  } else {
    // DD/MM/YYYY or DD-MM-YYYY
    match = input.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);

    if (!match) return null;

    [, day, month, year] = match;
  }

  year = Number(year);
  month = Number(month);
  day = Number(day);

  const date = new Date(Date.UTC(year, month - 1, day));

  // Reject invalid calendar dates
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return [
    year,
    String(month).padStart(2, "0"),
    String(day).padStart(2, "0")
  ].join("-");
}

// Convert currency amount into a number
function parseAmount(value) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  let input = String(value).trim();

  const isNegative =
    input.startsWith("-") ||
    /^\(.*\)$/.test(input) ||
    /\b(dr|debit)\b/i.test(input);

  // Remove currency symbols and formatting
  input = input
    .replace(/^(₹|rs\.?|inr|\$|usd)\s*/i, "")
    .replace(/\s*(dr|debit|cr|credit)$/i, "")
    .replace(/,/g, "")
    .replace(/\s+/g, "")
    .replace(/^\((.*)\)$/, "$1")
    .replace(/^[+-]/, "");

  // Accept only valid numeric amounts
  if (!/^\d+(\.\d{1,2})?$/.test(input)) {
    return null;
  }

  const number = Number(input);

  if (!Number.isFinite(number)) {
    return null;
  }

  return isNegative ? -number : number;
}

// Identify debit or credit transaction
function getTransactionType(row, mapping, rawAmount) {
  const typeValue = mapping.type
    ? String(row[mapping.type] || "").trim().toLowerCase()
    : "";

  if (/^(dr|debit)$/.test(typeValue)) {
    return "debit";
  }

  if (/^(cr|credit)$/.test(typeValue)) {
    return "credit";
  }

  return rawAmount < 0 ? "debit" : "credit";
}

// Main CSV parser function
function parseCsv(csvText) {
  if (!csvText || !String(csvText).trim()) {
    throw new Error("CSV file is empty.");
  }

  let records;

  try {
    records = parse(csvText, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      bom: true,
      relax_column_count: true
    });
  } catch (error) {
    throw new Error("Invalid CSV format. Please check the file.");
  }

  if (records.length === 0) {
    throw new Error("CSV file does not contain any transaction rows.");
  }

  const headers = Object.keys(records[0]);
  const mapping = detectBankFormat(headers);

  return records.map((row, index) => {
    let rawAmount;

    // Handle separate Debit and Credit columns
    if (mapping.debit || mapping.credit) {
      const debitValue = mapping.debit
        ? row[mapping.debit]
        : "";

      const creditValue = mapping.credit
        ? row[mapping.credit]
        : "";

      // Empty cells should be treated as zero
      const debit = String(debitValue ?? "").trim() === ""
        ? 0
        : parseAmount(debitValue);

      const credit = String(creditValue ?? "").trim() === ""
        ? 0
        : parseAmount(creditValue);

      if (
        (mapping.debit && debit === null) ||
        (mapping.credit && credit === null)
      ) {
        throw new Error(`Invalid amount at CSV row ${index + 2}.`);
      }

      rawAmount = (credit || 0) - Math.abs(debit || 0);
    } else {
      // Handle single Amount column
      rawAmount = parseAmount(row[mapping.amount]);
    }

    const date = parseDate(row[mapping.date]);

    const description = String(
      row[mapping.description] || ""
    ).trim();

    if (!date) {
      throw new Error(`Invalid date at CSV row ${index + 2}.`);
    }

    if (!description) {
      throw new Error(`Missing description at CSV row ${index + 2}.`);
    }

    if (rawAmount === null || rawAmount === 0) {
      throw new Error(`Invalid amount at CSV row ${index + 2}.`);
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
