# Personal Finance Visualizer

A simple, intuitive web application designed to help users track their personal finances, visualize spending habits, and manage monthly budgets. This application aims to provide clear insights into financial activity without the complexity of authentication or multi-user features.

## ✨ Features

The project is developed in stages, with each stage building upon the previous one.

### Stage 1: Basic Transaction Tracking

- **Add/Edit/Delete Transactions**: Easily manage your financial entries with fields for amount, date, and description.
- **Transaction List View**: See a chronological list of all your recorded transactions.
- **Monthly Expenses Bar Chart**: Visualize your spending trends over different months.
- **Basic Form Validation**: Ensures data integrity during transaction entry.

### Stage 2: Categories

- **Predefined Categories**: Organize your transactions into predefined categories (e.g., Food, Transport, Utilities, Income).
- **Category-wise Pie Chart**: Understand your spending breakdown by category at a glance.
- **Dashboard Summary Cards**: Get quick insights into your total expenses, total income, and a list of your most recent transactions on the main dashboard.

### Stage 3: Budgeting

- **Set Monthly Category Budgets**: Define monthly spending limits for individual categories (excluding income).
- **Budget vs Actual Comparison Chart**: Visually compare your budgeted amounts against your actual spending for any given month.
- **Simple Spending Insights**: Receive textual insights on your overall budget performance, highlighting overspent, underspent, and unbudgeted categories.

## 🚀 Tech Stack

The application is built with a modern web development stack:

- **Frontend**:
  - **React**: A JavaScript library for building user interfaces.
  - **Recharts**: A composable charting library built on React components for data visualization.
  - **Axios**: Promise-based HTTP client for making API requests.
  - **React Router DOM**: For handling client-side routing.
  - **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
- **Backend**:
  - **Node.js**: JavaScript runtime for server-side logic.
  - **Express.js**: A fast, unopinionated, minimalist web framework for Node.js.
  - **MongoDB**: A NoSQL document database for storing transaction and budget data.
  - **Mongoose**: MongoDB object data modeling (ODM) for Node.js.
  - **dotenv**: To load environment variables from a `.env` file.
  - **cors**: Node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.

## 📁 Folder Structure

```bash
|-- backend
    |-- src
        |-- config
            |-- db.js
        |-- controllers
            |-- budget.controller.js
            |-- transaction.controller.js
            |-- user.controller.js
        |-- models
            |-- budget.model.js
            |-- transaction.model.js
            |-- user.model.js
        |-- routes
            |-- budget.routes.js
            |-- transaction.routes.js
            |-- user.routes.js
        |-- services
            |-- category.service.js
    |-- .env
    |-- package-lock.json
    |-- package.json
    |-- server.js
|-- frontend
    |-- public
        |-- vite.svg
    |-- src
        |-- assets
            |-- react.svg
        |-- components
            |-- BudgetComparisonChart.jsx
            |-- BudgetForm.jsx
            |-- CategoryPieChart.jsx
            |-- DashboardSummary.jsx
            |-- MonthlyExpensesChart.jsx
            |-- SpendingInsights.jsx
            |-- TransactionForm.jsx
            |-- TransactionList.jsx
        |-- context
            |-- UserContext.jsx
        |-- pages
            |-- BudgetingPage.jsx
            |-- TransactionDetailPage.jsx
        |-- services
            |-- category.service.js
        |-- App.css
        |-- App.jsx
        |-- index.css
        |-- main.jsx
    |-- .gitignore
    |-- eslint.config.js
    |-- index.html
    |-- package-lock.json
    |-- package.json
    |-- README.md
    |-- vite.config.js
|-- README.md
```

## ⚙️ Setup Instructions

Follow these steps to get the project up and running on your local machine.

### Prerequisites

- Node.js (LTS version recommended)
- MongoDB Atlas account or a local MongoDB instance running.

### 1. Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Create a `.env` file:**
    In the `backend` directory, create a file named `.env` and add your MongoDB connection string.
    ```env
    MONGO_URI=your_mongodb_connection_string
    PORT=3000
    ```
    Replace `your_mongodb_connection_string` with your actual MongoDB Atlas connection string (or local MongoDB URI).
4.  **Start the backend server:**
    ```bash
    npm start
    # or if using nodemon: npm run dev
    ```
    The backend server should start on `http://localhost:3000`.

### 2. Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Start the frontend development server:**
    ```bash
    npm run dev
    ```
    The frontend application should open in your browser, typically at `http://localhost:5173`.

## 🖥️ Usage

Once both the backend and frontend servers are running:

1.  Open your browser to `http://localhost:5173`.
2.  The application will automatically generate a unique device ID for you (stored in local storage) to keep your data separate. This acts as your "user ID."
3.  Use the "Add New Transaction" form on the dashboard to record your income and expenses.
4.  View your transactions in the "Transaction List" and use the "View" button for details, or "Edit" and "Delete" actions.
5.  Explore your financial overview with the "Monthly Expenses Bar Chart" and "Category-wise Expense Pie Chart".
6.  Navigate to the "Budgeting" link in the header to:
    - Set monthly budgets for different expense categories.
    - Review your set budgets in a table.
    - See a "Budget vs Actual Spending" comparison chart for a selected month.
    - Read "Current Month Spending Insights" to understand your financial performance relative to your budgets.
