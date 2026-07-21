# FinTrack — Expense Tracker & Analytics

A production-grade personal finance SaaS application built with the **MERN stack** (MongoDB, Express, React, Node). Track income and expenses, set monthly budgets, uncover insights with beautiful analytics, and export reports as PDF or Excel.

> The frontend runs as a fully self-contained demo in the browser (data persists to `localStorage`) so you can explore every feature without standing up the backend. A complete, deployable Express + MongoDB backend lives in [`server/`](./server) and exposes the exact REST API the README documents.

---

## Features

- **Authentication** — register, login, logout, JWT sessions, bcrypt password hashing, protected routes, remember me, forgot/reset password, form validation.
- **Dashboard** — total balance, income, expenses, savings, monthly budget, remaining budget, recent transactions, monthly summary, expense categories, financial insights.
- **Transactions** — full CRUD with title, amount, income/expense, category, date, notes; search, filter (type/category/date range), sort, pagination.
- **Categories** — 6 income + 10 expense categories with color-coded metadata.
- **Analytics** — income vs expense (line), category spending (doughnut + pie), weekly (bar), yearly (bar); highest expense/income; savings percentage.
- **Budgets** — create/update/delete monthly budgets; remaining, used, percentage; alerts at 80% and on exceed.
- **Reports** — monthly and annual reports; export to PDF, Excel (CSV), and print.
- **Profile** — update name/email, upload profile picture, change password.
- **Settings** — light/dark mode with persistence, currency selection (₹, $, €, £), notification toggles.
- **Notifications** — toast notifications for success, error, warning, info.
- **Admin** — total users, total transactions, system statistics, delete user, manage categories.
- **Responsive** — desktop, laptop, tablet, mobile.
- **UI** — glassmorphism, rounded components, smooth animations, loading skeletons, empty/error states, hover effects, clean sidebar — inspired by Notion, Stripe, Linear and Vercel.

---

## Tech Stack

### Frontend
- React.js (Vite) — JavaScript only
- Tailwind CSS
- React Router DOM
- Axios
- React Hook Form
- React Icons / Lucide React
- React Toastify
- Chart.js + react-chartjs-2

### Backend
- Node.js + Express.js — JavaScript only
- JWT Authentication + bcrypt
- dotenv, multer (profile image upload)
- Helmet, CORS, express-rate-limit, xss-clean
- Morgan logging

### Database
- MongoDB Atlas + Mongoose

---

## Folder Structure

```
fintrack/
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
├── .env.example
├── vercel.json                # Frontend deployment (Vercel)
├── render.yaml                # Backend deployment (Render)
├── src/                       # Frontend (React client)
│   ├── App.jsx                # Router + providers
│   ├── main.jsx
│   ├── index.css
│   ├── components/
│   │   ├── ui/                # Button, Modal, Badge, Avatar, StatCard, ...
│   │   ├── layout/            # Sidebar, Topbar, DashboardLayout, ProtectedRoute, AuthLayout
│   │   ├── charts/            # Chart.js registration + chart wrappers
│   │   └── transactions/      # TransactionFormModal, TransactionRow
│   ├── context/               # AuthContext, SettingsContext
│   ├── hooks/                 # useTransactions, useBudgets
│   ├── pages/                 # Login, Register, ForgotPassword, ResetPassword,
│   │                          # Dashboard, Transactions, Analytics, Budgets, Reports,
│   │                          # Profile, Settings, Admin
│   ├── services/              # api.js (REST-shaped), store.js, analytics.js
│   └── utils/                 # constants, formatters, validation, seed, exporters
└── server/                    # Backend (Express + MongoDB)
    ├── package.json
    ├── .env.example
    ├── render.yaml
    └── src/
        ├── server.js          # Express app entry
        ├── config/            # env + db connection
        ├── controllers/       # auth, user, transaction, budget, category, report, settings, admin
        ├── middleware/        # auth (JWT), error, rateLimiter, upload (multer)
        ├── models/            # User, Transaction, Budget, Category, Settings
        ├── routes/            # REST routes per resource
        ├── utils/             # helpers, mailer, seed
        └── uploads/           # multer avatar destination
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or a local MongoDB instance)

### 1. Frontend

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # production build → dist/
```

### 2. Backend

```bash
cd server
npm install
cp .env.example .env   # then edit values
npm run seed            # optional: load demo data + admin/user accounts
npm run dev             # http://localhost:5000
```

Demo credentials (after seeding):
- User: `demo@fintrack.app` / `demo123`
- Admin: `admin@fintrack.app` / `admin123`

> The frontend ships with a `localStorage`-backed service layer (`src/services/api.js`) that mirrors the REST API below, so you can use the app immediately without running the backend. To point it at the real backend, replace the methods in `src/services/api.js` with Axios calls to `import.meta.env.VITE_API_URL`.

---

## Environment Variables

### Frontend (`.env`)
```
VITE_API_URL=http://localhost:5000/api
```

### Backend (`server/.env`) — see `server/.env.example`
```
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/fintrack
JWT_SECRET=<long_random_string>
JWT_EXPIRES_IN=30d
JWT_RESET_EXPIRES_IN=30m
EMAIL_FROM=FinTrack <no-reply@fintrack.app>
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
UPLOAD_DIR=uploads
MAX_UPLOAD_MB=2
```

---

## API Documentation

Base URL: `http://localhost:5000/api`

### Auth
| Method | Endpoint              | Description            | Auth |
|--------|-----------------------|------------------------|------|
| POST   | `/auth/register`      | Register a new user    | —    |
| POST   | `/auth/login`         | Login                   | —    |
| GET    | `/auth/me`            | Current user             | ✅   |
| POST   | `/auth/forgot-password` | Send reset email       | —    |
| POST   | `/auth/reset-password`   | Reset password         | —    |

### Users (profile)
| Method | Endpoint            | Description              | Auth |
|--------|---------------------|--------------------------|------|
| GET    | `/users`            | Get profile               | ✅   |
| PUT    | `/users`            | Update name/email         | ✅   |
| PUT    | `/users/password`  | Change password           | ✅   |
| POST   | `/users/avatar`     | Upload avatar (multipart) | ✅   |

### Transactions
| Method | Endpoint                  | Description                          | Auth |
|--------|---------------------------|--------------------------------------|------|
| GET    | `/transactions`           | List (search, filter, sort, paginate) | ✅   |
| POST   | `/transactions`           | Create                                | ✅   |
| GET    | `/transactions/summary`   | Income/expense/balance totals         | ✅   |
| PUT    | `/transactions/:id`       | Update                                | ✅   |
| DELETE | `/transactions/:id`       | Delete                                | ✅   |

Query params for `GET /transactions`: `search`, `type`, `category`, `from`, `to`, `sortBy` (`date`|`amount`|`title`), `sortDir` (`asc`|`desc`), `page`, `pageSize`.

### Budgets
| Method | Endpoint                  | Description            | Auth |
|--------|---------------------------|------------------------|------|
| GET    | `/budgets`                | List budgets            | ✅   |
| POST   | `/budgets`                | Create budget           | ✅   |
| PUT    | `/budgets/:id`            | Update budget           | ✅   |
| DELETE | `/budgets/:id`            | Delete budget           | ✅   |
| GET    | `/budgets/status/:month`  | Budget status for month | ✅   |

### Categories
| Method | Endpoint            | Description        | Auth |
|--------|---------------------|--------------------|------|
| GET    | `/categories`       | List categories     | ✅   |
| POST   | `/categories`       | Create category     | ✅   |
| DELETE | `/categories/:id`   | Delete category      | ✅   |

### Reports
| Method | Endpoint                          | Description       | Auth |
|--------|-----------------------------------|-------------------|------|
| GET    | `/reports/monthly/:year/:month`   | Monthly report     | ✅   |
| GET    | `/reports/annual/:year`           | Annual report      | ✅   |

### Settings
| Method | Endpoint       | Description         | Auth |
|--------|----------------|---------------------|------|
| GET    | `/settings`    | Get settings         | ✅   |
| PUT    | `/settings`    | Update settings      | ✅   |

### Admin
| Method | Endpoint            | Description           | Auth |
|--------|---------------------|-----------------------|------|
| GET    | `/admin/stats`      | System statistics      | Admin |
| GET    | `/admin/users`      | List all users         | Admin |
| DELETE | `/admin/users/:id`  | Delete a user          | Admin |

---

## Deployment

### Frontend → Vercel
1. Push the repo to GitHub.
2. Import the project in Vercel.
3. Set `VITE_API_URL` to your Render backend URL.
4. Vercel auto-detects Vite (`vercel.json` is included). Output dir: `dist`.

### Backend → Render
1. Push the repo to GitHub.
2. Create a new Web Service in Render pointing to the `server/` directory (or use the included `render.yaml`).
3. Build command: `npm install` · Start command: `npm start`.
4. Add environment variables from `server/.env.example` (set `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`).
5. Optional: run `npm run seed` once via the Render shell.

### Database → MongoDB Atlas
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Add a database user and allow network access (`0.0.0.0/0` for dev).
3. Copy the connection string into `MONGO_URI`.

---

## Screenshots

> Add screenshots here once deployed.

```
screenshots/
├── dashboard.png
├── analytics.png
├── transactions.png
├── budgets.png
└── reports.png
```

---

## Future Improvements

- Recurring transactions and subscriptions
- Multi-currency conversion
- Shared/family budgets with role-based access
- Plaid/bank-sync integration for automatic imports
- Email + push notifications (cron-based budget alerts)
- PWA / offline support
- Mobile app (React Native)

---

## License

MIT © 2026 FinTrack. Built for portfolios, internships and placements.
