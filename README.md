# 🏦 Loan Management Dashboard

A modern, high-performance web dashboard engineered for **Revenue-Based Financing (RBF)**, loan origination, borrower relationship management, and financial transaction oversight. Built with **React 18**, **TypeScript**, **Vite**, **Redux Toolkit (RTK Query)**, **Ant Design**, and **Tailwind CSS**.

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Architecture & Directory Structure](#-architecture--directory-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Configuration](#environment-configuration)
  - [Running Locally](#running-locally)
  - [Building for Production](#building-for-production)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)
- [Authentication & Security](#-authentication--security)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

The **Loan Management Dashboard** serves as the central administrative hub for revenue financing operations. It empowers administrators and underwriters to monitor system health, evaluate funding requests, manage borrower portfolios, audit transactions, and configure platform content with real-time data sync and responsive design.

---

## 🚀 Key Features

### 1. 📊 Executive Dashboard & Analytics
- **KPI Summary Cards**: Real-time visibility into Total Borrowers, Active Financing Facilities, Capital Disbursed, and Repayment Rates.
- **Interactive Visualizations**: Funding vs. Repayments charts powered by **Recharts**.
- **Live Activity Stream**: Quick-access view of recent loan applications and pending approvals.

### 2. 📝 Funding Applications Pipeline
- **Application Processing**: Review, approve, or reject loan applications with real-time status transitions (`PENDING`, `APPROVED`, `REJECTED`).
- **Underwriting Dossier**: Detailed breakdown of applicant business details, financial statements, requested capital, fees, terms, and repayment percentages.
- **Search & Filtering**: Multi-parameter search, status filtering, and paginated record navigation.

### 3. 👥 Borrower Relationship Management (CRM)
- **Directory**: Comprehensive table of registered borrowers, contact info, and facility statuses.
- **Borrower Profile View**: Individual borrower breakdown showing financing history, outstanding balances, and associated contracts.

### 4. 💳 Financial Transaction Ledger
- **Audit-Ready Ledger**: Unified view of all disbursements, revenue share repayments, refunds, and adjustments.
- **Status Badges**: Succeeded, Pending, and Failed transaction states with timestamps in UTC.
- **Transaction Details Modal**: Deep dive into individual transaction IDs, payment methods, and counterparty data.

### 5. 🔔 Notification System
- **Real-Time Alerts**: Updates on new loan submissions, disbursement confirmations, and repayment events.
- **Header Badge**: Notification indicator with unread indicators and direct navigation to notification center.

### 6. ⚙️ Platform Administration & CMS
- **WYSIWYG Rich Text Editor**: Embedded **Jodit Editor** for managing dynamic **Terms & Conditions** and **Privacy Policy**.
- **FAQ Management**: Full CRUD capabilities (Create, Read, Update, Delete) with interactive accordion previews.
- **Admin Profile & Security**: Update admin avatar, personal details, and change credentials securely.

---

## 🛠 Technology Stack

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | [React 18](https://react.dev/) | Component-based UI library |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) | Strict static typing and code reliability |
| **Build Tool** | [Vite](https://vitejs.dev/) | Fast development server and optimized bundler |
| **State Management** | [Redux Toolkit (RTK)](https://redux-toolkit.js.org/) | Global state store and slice architecture |
| **Data Fetching** | [RTK Query](https://redux-toolkit.js.org/rtk-query/overview) | Server-state caching, tag invalidation & auto-refresh |
| **Styling** | [Tailwind CSS 3](https://tailwindcss.com/) | Utility-first responsive CSS styling |
| **UI Components** | [Ant Design (AntD)](https://ant.design/) | Enterprise-grade modals, tables, and pagination |
| **Icons** | [Lucide React](https://lucide.dev/) / [React Icons](https://react-icons.github.io/react-icons/) | Modern UI icon sets |
| **Charts** | [Recharts](https://recharts.org/) | Composable declarative SVG charting |
| **Rich Text** | [Jodit React](https://xdsoft.net/jodit/) | WYSIWYG editor for CMS policies |
| **Forms & Validation** | [React Hook Form](https://react-hook-form.com/) | High-performance form state management |
| **Authentication** | [jwt-decode](https://github.com/auth0/jwt-decode) & [js-cookie](https://github.com/js-cookie/js-cookie) | Client-side JWT session handling |
| **Notifications** | [react-hot-toast](https://react-hot-toast.com/) | Lightweight toast notifications |

---

## 📁 Architecture & Directory Structure

```text
loan-management-dashboard/
├── public/                     # Static public assets
├── src/
│   ├── assets/                 # Images, logos, and vector assets
│   ├── components/
│   │   ├── common/             # Reusable primitives (Spinner, FormItem, Title)
│   │   ├── Shared/             # Error boundaries and fallback views
│   │   └── ui/                 # Domain-specific UI blocks (Charts, Tables, Modals)
│   │       ├── FAQ/            # FAQ modal and editing components
│   │       ├── Home/           # Stat cards, funding charts, and application tables
│   │       └── Settings/       # CMS editors, profile forms, and password views
│   ├── Layout/
│   │   ├── Auth/               # Wrapper layout for authentication views
│   │   └── Main/               # Core app layout with Sidebar, Header, and Outlet
│   ├── Pages/
│   │   ├── Auth/               # Login, ForgotPassword, VerifyOtp, ResetPassword
│   │   ├── Dashboard/          # Home, FundingApplications, Borrowers, Transactions,
│   │   │                       # Settings, Notifications, FAQs, Policies
│   │   └── Public/             # Publicly accessible policy views
│   ├── redux/
│   │   ├── api/
│   │   │   └── baseApi.ts      # RTK Query root definition, base query & re-auth
│   │   ├── apiSlices/          # Feature API slices (auth, loan, borrower, transaction, etc.)
│   │   └── store.ts            # Root Redux store configuration
│   ├── routes/
│   │   ├── index.tsx           # React Router 6 route tree
│   │   ├── ProtectedRoute.tsx  # Authenticated route guard
│   │   └── PublicRoute.tsx     # Guest-only route guard
│   ├── Translation/            # i18n translation bundles (en, es)
│   ├── utils/
│   │   └── auth.ts             # Auth token storage, Remember Me logic & JWT helpers
│   ├── App.tsx                 # Root application wrapper
│   ├── main.tsx                # React entry point with Redux Provider & Router
│   └── index.css               # Global Tailwind CSS directives and custom typography
├── .env.example                # Sample environment variables
├── package.json                # Project dependencies and scripts
├── tailwind.config.js          # Tailwind CSS theme customization
├── tsconfig.json               # TypeScript compiler configuration
└── vite.config.ts              # Vite configuration with path aliases
```

---

## 🏁 Getting Started

### Prerequisites

Make sure you have the following installed on your local machine:
- **Node.js**: `v18.0.0` or later (LTS recommended)
- **npm**: `v9.0.0` or later (or `yarn` / `pnpm`)
- **Git**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/hassansabbir/loan-management-dashbaord.git
   cd loan-management-dashboard
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

### Environment Configuration

Create a `.env` file in the root directory by copying the sample file:

```bash
cp .env.example .env
```

Open `.env` and specify the API backend endpoints:

```env
VITE_BASE_URL=http://localhost:5004/api/v1
VITE_IMAGE_URL=http://localhost:5004
```

### Running Locally

Launch the local Vite development server:

```bash
npm run dev
```

The application will be accessible at:
```
http://localhost:5173
```

### Building for Production

Compile TypeScript and build the optimized production assets:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## 🔐 Environment Variables

| Variable Name | Required | Default / Example | Description |
| :--- | :---: | :--- | :--- |
| `VITE_BASE_URL` | **Yes** | `http://10.10.26.180:5004/api/v1` | Base URL for REST API endpoints |
| `VITE_IMAGE_URL` | **Yes** | `http://10.10.26.180:5004` | Host URL for user avatars & uploaded documents |

---

## 📜 Available Scripts

In the project directory, you can run:

| Command | Action |
| :--- | :--- |
| `npm run dev` | Runs the app in development mode with Hot Module Replacement (HMR) |
| `npm run build` | Runs TypeScript type checking (`tsc`) and compiles the production bundle |
| `npm run preview` | Spins up a local static server to preview the built `dist` folder |
| `npm run lint` | Lints source files with ESLint to catch syntax and style errors |
| `npm run type-check` | Runs the TypeScript compiler (`tsc --noEmit`) to validate types without emitting files |

---

## 🔒 Authentication & Security

- **JWT Session Management**: Access tokens are included automatically via `Authorization: Bearer <token>` headers on all protected API queries.
- **Automated Silent Re-Authentication**: When an API request responds with `401 Unauthorized`, `baseQueryWithReauth` attempts a silent refresh using the stored refresh token. If refresh fails, it clears credentials and safely redirects to `/auth/login`.
- **Remember Me Persistence**: Users can choose persistent storage (`localStorage` + 30-day cookies) or transient session storage (`sessionStorage` + session cookies).
- **Route Guards**:
  - `ProtectedRoute`: Prevents unauthenticated access to the main dashboard layout.
  - `PublicRoute`: Prevents already logged-in users from accessing authentication pages (e.g., login, password recovery).

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: add some amazing feature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is proprietary and confidential. Unauthorized copying, distribution, or modification is strictly prohibited.
