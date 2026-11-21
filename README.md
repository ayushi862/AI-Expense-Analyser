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
# AI Expense Analyser

AI-powered personal expense tracking and analytics platform.

## Project Overview

The application helps users manage transactions, budgets, and spending patterns through financial analytics, CSV imports, and downloadable reports.

## Features

- User registration and login
- Account management
- Transaction creation, editing, deletion, and filtering
- Transaction search, sorting, and pagination
- CSV import with preview and confirmation
- Budget management and budget status
- Category management
- Custom transaction rules
- Expense analytics and monthly trends
- Excel export
- PDF report generation
- AI-powered expense analysis

## Technology Stack

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Multer
- ExcelJS
- PDFKit

### Frontend
- Frontend application is maintained in the `frontend` directory.

## Project Structure

```text
AI-Expense-Analyser/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── package.json
│   └── server.js
├── frontend/
├── API.md
├── README.md
└── .gitignore
```

## Backend Setup

### 1. Clone the repository

```bash
git clone https://github.com/ayushi862/AI-Expense-Analyser.git
```

### 2. Navigate to backend

```bash
cd AI-Expense-Analyser/backend
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file inside the `backend` directory.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
ANTHROPIC_API_KEY=your_anthropic_api_key
```

Never commit actual credentials or API keys to GitHub.

### 5. Run the backend

Development:

```bash
npm run dev
```

Production:

```bash
npm start
```

## Deployment

**Backend URL:**

https://ai-expense-analyser-backend.onrender.com

**Health Check:**

https://ai-expense-analyser-backend.onrender.com/

## API Documentation

See [API.md](./API.md) for available endpoints, HTTP methods, and authentication requirements.

## Security

- JWT authentication protects private routes.
- Environment variables store sensitive credentials.
- CSV uploads have a maximum file size of 5 MB.

## Project Status

Backend deployment is live. Frontend deployment and final end-to-end integration testing are pending.

## License

Developed for educational and project purposes.
