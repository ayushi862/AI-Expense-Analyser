
const { parseCsv } = require("../utils/csvParser");

const testCases = [
  {
    name: "Sample 1 - Normal Amount and Type",
    csv: `Date,Description,Amount,Type
13/11/2026,Swiggy Order,450,Debit
12/11/2026,Salary,25000,Credit`
  },
  {
    name: "Sample 2 - Separate Debit and Credit",
    csv: `Transaction Date,Narration,Debit,Credit
13/11/2026,Swiggy Order,450,
12/11/2026,Salary,,25000`
  },
  {
    name: "Sample 3 - Transaction Amount and Dr/Cr",
    csv: `Date,Particulars,Transaction Amount,Dr/Cr
13/11/2026,Amazon Purchase,1200,DR
12/11/2026,Refund,500,CR`
  },
  {
    name: "Sample 4 - Amount with Commas",
    csv: `Date,Description,Amount,Type
13/11/2026,Big Purchase,"1,25,000",Debit`
  },
  {
    name: "Sample 5 - Different Date Formats",
    csv: `Date,Description,Amount,Type
2026-11-13,Online Shopping,1500,Debit
13-11-2026,Food Order,450,Debit`
  },
  {
    name: "Sample 6 - Empty Rows",
    csv: `Date,Description,Amount,Type
13/11/2026,Food Order,450,Debit

12/11/2026,Salary,25000,Credit

`
  }
];

let passed = 0;
let failed = 0;

function runTest(name, callback) {
  console.log("\n-----------------------------");
  console.log(name);
  console.log("-----------------------------");

  try {
    callback();
    console.log("SUCCESS");
    passed++;
  } catch (error) {
    console.log("FAILED:", error.message);
    failed++;
  }
}

// Existing CSV tests
testCases.forEach((test) => {
  runTest(test.name, () => {
    const result = parseCsv(test.csv);

    if (result.length === 0) {
      throw new Error("No transactions parsed.");
    }

    console.log(`Parsed ${result.length} transactions`);
  });
});

// Large CSV test
runTest("Sample 7 - Large CSV (1000 Rows)", () => {
  const rows = ["Date,Description,Amount,Type"];

  for (let i = 1; i <= 1000; i++) {
    rows.push(`13/11/2026,Transaction ${i},${i * 10},Debit`);
  }

  const result = parseCsv(rows.join("\n"));

  if (result.length !== 1000) {
    throw new Error(`Expected 1000 rows but got ${result.length}`);
  }
});

// Invalid input tests
runTest("Sample 8 - Invalid Date", () => {
  const csv = `Date,Description,Amount,Type
31/02/2026,Invalid Date,500,Debit`;

  let errorOccurred = false;

  try {
    parseCsv(csv);
  } catch (error) {
    errorOccurred = error.message.includes("Invalid date");
  }

  if (!errorOccurred) {
    throw new Error("Invalid date was not rejected.");
  }
});

runTest("Sample 9 - Invalid Amount", () => {
  const csv = `Date,Description,Amount,Type
13/11/2026,Invalid Amount,abc123,Debit`;

  let errorOccurred = false;

  try {
    parseCsv(csv);
  } catch (error) {
    errorOccurred = error.message.includes("Invalid amount");
  }

  if (!errorOccurred) {
    throw new Error("Invalid amount was not rejected.");
  }
});

runTest("Sample 10 - Missing Description", () => {
  const csv = `Date,Description,Amount,Type
13/11/2026,,500,Debit`;

  let errorOccurred = false;

  try {
    parseCsv(csv);
  } catch (error) {
    errorOccurred = error.message.includes("Missing description");
  }

  if (!errorOccurred) {
    throw new Error("Missing description was not rejected.");
  }
});

runTest("Sample 11 - Empty CSV", () => {
  let errorOccurred = false;

  try {
    parseCsv("");
  } catch (error) {
    errorOccurred = error.message.includes("empty");
  }

  if (!errorOccurred) {
    throw new Error("Empty CSV was not rejected.");
  }
});

runTest("Sample 12 - Header Only CSV", () => {
  let errorOccurred = false;

  try {
    parseCsv("Date,Description,Amount,Type");
  } catch (error) {
    errorOccurred = error.message.includes("does not contain");
  }

  if (!errorOccurred) {
    throw new Error("Header-only CSV was not rejected.");
  }
});

console.log("\n=============================");
console.log(`TOTAL PASSED: ${passed}`);
console.log(`TOTAL FAILED: ${failed}`);
console.log("=============================");
