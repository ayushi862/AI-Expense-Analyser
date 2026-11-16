
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
  }
];

testCases.forEach((test) => {
  console.log("\n-----------------------------");
  console.log(test.name);
  console.log("-----------------------------");

  try {
    const result = parseCsv(test.csv);
    console.log("SUCCESS");
    console.log(result);
  } catch (error) {
    console.log("FAILED:", error.message);
  }
});
