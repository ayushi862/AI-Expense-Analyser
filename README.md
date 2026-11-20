# AI-Expense-Analyser
AI-powered personal expense tracking and analytics platform


## CSV Import, Transaction Deduplication & Reports

### 1. CSV Import

The AI Expense Analyser supports importing bank transactions through CSV files.

**Supported CSV column headers**

| Field | Supported column names |
|---|---|
| Date | Date, Transaction Date, Txn Date, Value Date, Posting Date |
| Description | Description, Narration, Details, Particulars, Transaction Details, Remarks |
| Amount | Amount, Transaction Amount, Txn Amount, Withdrawal, Deposit |
| Type | Type, Transaction Type, Dr/Cr, Debit/Credit |
| Debit | Debit, Withdrawal Amount, Withdrawal |
| Credit | Credit, Deposit Amount, Deposit |

**CSV requirements:**
- A Date column is required.
- A Description/Narration column is required.
- At least one Amount, Debit, or Credit column is required.
- Separate Debit and Credit columns are supported.
- CSV headers are normalized to handle differences in capitalization, spaces, underscores, and hyphens.
- Invalid dates, missing descriptions, and invalid amounts are rejected with validation errors.

**Import API endpoints**

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/import/preview` | Upload and preview CSV transactions |
| POST | `/api/import/confirm` | Validate and save transactions |

Both endpoints require authentication.

### 2. Duplicate Transaction Prevention

The application uses SHA-256 hashing to identify duplicate transactions.

The duplicate hash is generated using:
- User ID
- Account ID
- Transaction date
- Normalized description (trimmed and lowercase)
- Amount
- Transaction type (debit/credit)

The Transaction model uses a unique compound database index on `userId` and `dedupHash`.

This prevents the same transaction hash from being inserted more than once for the same user.

### 3. Excel Export

**API:** `GET /api/export/excel`

The Excel export generates a workbook containing two worksheets:

**Transactions**
- Date
- Description
- Merchant
- Amount
- Type
- Category
- Subcategory

**Category Summary**
- Category
- Total Debit
- Total Credit

An optional month filter is supported:

`GET /api/export/excel?month=YYYY-MM`

Additional features:
- Exports only the logged-in user's transactions.
- Excludes transactions marked as transfers.
- Sorts transactions by date in descending order.
- Formats worksheet headings and freezes the header row.

### 4. PDF Expense Report

**API:** `GET /api/report/pdf`

The PDF report includes:

1. **Financial Summary:** Total Income, Total Expenses, and Savings.
2. **Category-wise Expenses:** Expense totals for each category.
3. **Top 5 Merchants:** Merchants with the highest spending.
4. **Budget Status:** Budget amount, spent amount, remaining amount, and status.

An optional month filter is supported:

`GET /api/report/pdf?month=YYYY-MM`

If no month is specified, the report is generated for the current month.

Budget status is classified as:
- Within Limit: Spending below 80% of budget.
- Near Limit: Spending at least 80% but below 100%.
- Exceeded: Spending at or above 100%.

The report includes only the logged-in user's transactions and excludes transfers.

Both Excel and PDF exports require authentication.
