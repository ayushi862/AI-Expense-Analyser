# AI Expense Analyser - API Documentation



## Base URLs



**Local Backend:**

`http://localhost:5000`



**Deployed Backend:**

`https://ai-expense-analyser-backend.onrender.com`



## Authentication



Protected endpoints require a JWT token.



Add this header to authenticated requests:



```http

Authorization: Bearer YOUR\_JWT\_TOKEN

```



## 1. Authentication APIs



| Method | Endpoint | Description | Access |

|---|---|---|---|

| POST | `/api/auth/register` | Register a user | Public |

| POST | `/api/auth/login` | Login user | Public |

| GET | `/api/auth/profile` | Get user profile | Protected |



## 2. Account APIs



| Method | Endpoint | Description |

|---|---|---|

| POST | `/api/accounts` | Create account |

| GET | `/api/accounts` | Get accounts |

| PUT | `/api/accounts/:id` | Update account |

| DELETE | `/api/accounts/:id` | Delete account |



All account endpoints require authentication.



## 3. Transaction APIs



| Method | Endpoint | Description |

|---|---|---|

| POST | `/api/transactions` | Create transaction |

| GET | `/api/transactions` | Get transactions |

| GET | `/api/transactions/filter` | Filter transactions |

| GET | `/api/transactions/:id` | Get transaction by ID |

| PATCH | `/api/transactions/:id/transfer` | Transfer transaction |



All transaction endpoints require authentication.



## 4. Budget APIs



| Method | Endpoint | Description |

|---|---|---|

| GET | `/api/budgets/status` | Get budget status |

| POST | `/api/budgets` | Create budget |

| GET | `/api/budgets` | Get budgets |

| PUT | `/api/budgets/:id` | Update budget |

| DELETE | `/api/budgets/:id` | Delete budget |



All budget endpoints require authentication.



## 5. CSV Import APIs



| Method | Endpoint | Description |

|---|---|---|

| POST | `/api/import/preview` | Preview uploaded CSV file |

| POST | `/api/import/confirm` | Confirm CSV import |



Authentication is required.



**CSV upload:** The preview endpoint accepts a file using the `file` field. Maximum file size is 5 MB.



## 6. Category APIs



| Method | Endpoint | Description |

|---|---|---|

| GET | `/api/categories` | Get categories |



Authentication is required.



## 7. Transaction Rules APIs



| Method | Endpoint | Description |

|---|---|---|

| GET | `/api/rules` | Get rules |

| POST | `/api/rules` | Create rule |

| PUT | `/api/rules/:id` | Update rule |

| DELETE | `/api/rules/:id` | Delete rule |



Authentication is required.



## 8. Analytics APIs



| Method | Endpoint | Description |

|---|---|---|

| GET | `/api/analytics/summary` | Get expense summary |

| GET | `/api/analytics/category-split` | Get category-wise expense split |

| GET | `/api/analytics/monthly-trend` | Get monthly expense trends |

| GET | `/api/analytics/top-merchants` | Get top merchants |



All analytics endpoints require authentication.



## 9. Excel Export API



| Method | Endpoint | Description |

|---|---|---|

| GET | `/api/export/excel` | Export transactions to Excel |



Authentication is required.



Optional query parameter: `month=YYYY-MM`



Example:



`/api/export/excel?month=2026-11`



## 10. PDF Report API



| Method | Endpoint | Description |

|---|---|---|

| GET | `/api/report/pdf` | Generate PDF expense report |



Authentication is required.



Optional query parameter: `month=YYYY-MM`



Example:



`/api/report/pdf?month=2026-11`



## Health Check



| Method | Endpoint | Description |

|---|---|---|

| GET | `/` | Check whether the backend server is running |



Example response:



```text

AI Expense Analyser API Running

```



## Notes



- All protected endpoints require a valid JWT token.

- Use the deployed backend URL for production requests.

- Request body fields and response formats should be checked against the respective API implementation.

- Never share JWT tokens, database credentials, or API keys.
