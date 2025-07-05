# Personal Finance Visualizer

A simple, intuitive web application designed to help users track their personal finances, visualize spending habits, and manage monthly budgets. This application aims to provide clear insights into financial activity without the complexity of authentication or multi-user features.

## ✨ Features

This Personal Finance Visualizer offers a robust set of features to help you manage and understand your finances:

- **Transaction Management**:

  - **Add, Edit, and Delete Transactions**: Easily record all your financial entries with fields for amount, date, description, and category.
  - **Comprehensive Transaction List**: View a chronological list of all your recorded income and expenses.
  - **Detailed Transaction View**: Access individual transaction details for a closer look.

- **Category-Based Organization**:

  - **Predefined Categories**: Organize your transactions into helpful, predefined categories such as Food, Transport, Utilities, Income, and more.

- **Financial Visualization & Insights**:

  - **Dashboard Summary**: Get quick insights into your total expenses, total income, and a list of your most recent transactions on the main dashboard.
  - **Spending Trends**: Visualize your expenditure patterns over different Period with an intuitive bar or line chart.
  - **Category Breakdown**: Understand where your money goes at a glance with a detailed category-wise pie chart.
  - **Spending Insights**: Receive textual insights into your financial habits and budget performance.

- **Budgeting Tools**:
  - **Set Monthly Budgets**: Define monthly spending limits for individual expense categories.
  - **Budget Comparison**: Visually compare your budgeted amounts against your actual spending for any given month, helping you stay on track.
  - **Performance Analysis**: Identify overspent, underspent, and unbudgeted categories for better financial planning.

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

## 🌐 Live Demo

Experience the deployed application here: [https://personal-finance-visualizer-vert-sigma.vercel.app/](https://personal-finance-visualizer-vert-sigma.vercel.app/)

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
    |-- .env
    |-- .gitignore
    |-- eslint.config.js
    |-- index.html
    |-- package-lock.json
    |-- package.json
    |-- README.md
    |-- vite.config.js
|-- .gitignore
|-- README.md
```

---

# ⚙️ Setup Instructions

Follow these steps to get the project up and running on your local machine.

## Prerequisites

- Node.js (LTS version recommended)
- MongoDB Atlas account or a local MongoDB instance running.

---

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

    In the `backend` directory, create a file named `.env` and add your MongoDB connection string and desired port.

    ```env
    MONGO_URI=your_mongodb_connection_string_here
    PORT=3000
    ```

    - Replace `your_mongodb_connection_string_here` with your actual MongoDB Atlas connection string (or local MongoDB URI, e.g., `mongodb://localhost:27017/personalfinancevisualizer`).

4.  **Start the backend server:**

    ```bash
    npm start
    # or if using nodemon for development: npm run dev
    ```

    The backend server should start on `http://localhost:3000` (or the port you specified).

### 2. Frontend Setup

1.  **Navigate to the frontend directory:**

    ```bash
    cd frontend
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Create a `.env` file:**

    In the `frontend` directory, create a file named `.env` and specify the URL of your backend API.

    ```env
    VITE_APP_BACKEND_API_URL=your_backend_api_url_here
    ```

    - Replace `your_backend_api_url_here` with the URL where your backend is running. If running locally, this will be `http://localhost:3000`. If you've deployed your backend (e.g., to Render), use its deployed URL.

4.  **Start the frontend development server:**

    ```bash
    npm run dev
    ```

    The frontend application should open in your browser, typically at `http://localhost:5173`.

# 🖥️ Usage

Once both the backend and frontend servers are running:

- Open your browser to `http://localhost:5173` (or the URL where your frontend is hosted if deployed).

- The application will automatically generate a unique device ID for you (stored in local storage) to keep your data separate. This acts as your "user ID."

- Use the "Add New Transaction" form on the dashboard to record your income and expenses.

- View your transactions in the "Transaction List" and use the "View" button for details, or "Edit" and "Delete" actions.

- Explore your financial overview with the "Expenses Bar Chart" and "Category Breakdown Pie Chart".

- Navigate to the "Budgeting" link in the header to:
  - Set monthly budgets for different expense categories.
  - Review your set budgets in a table.
  - See a "Budget vs Actual Spending" comparison chart for a selected month.
  - Read "Current Month Spending Insights" to understand your financial performance relative to your budgets.
