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
