// frontend/src/App.jsx (within the Dashboard component)
import React, { useState, useEffect, useCallback } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom"; // Import Navigate
import { useUser } from "./context/UserContext.jsx";
import TransactionForm from "./components/TransactionForm.jsx";
import TransactionList from "./components/TransactionList.jsx";
import MonthlyExpensesChart from "./components/MonthlyExpensesChart.jsx";
import CategoryPieChart from "./components/CategoryPieChart.jsx";
import DashboardSummary from "./components/DashboardSummary.jsx";
import SpendingInsights from "./components/SpendingInsights.jsx";
import TransactionDetailPage from "./pages/TransactionDetailPage.jsx";
import BudgetingPage from "./pages/BudgetingPage.jsx";
import {
  TrendingUp,
  DollarSign,
  Plus,
  BarChart3,
  PieChart,
  Target,
  Banknote, // Ensure Banknote is imported
} from "lucide-react";
import axios from "axios";

// Define your backend API base URL using an environment variable
// This should be consistent across all frontend files making API calls.
const API_BASE_URL = import.meta.env.VITE_APP_BACKEND_API_URL;

// Dashboard component definition
const Dashboard = ({
  deviceId,
  userId,
  loadingUser,
  userError,
  transactions,
  loadingTransactions,
  transactionError,
  transactionToEdit,
  handleTransactionSuccess,
  handleEditTransaction,
  handleDeleteTransaction,
  totalExpenses,
  totalIncome,
  mostRecentTransactions,
  refreshTrigger,
}) => {
  const sectionClasses = "py-16 relative";
  const cardClasses =
    "bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 shadow-xl";
  // Modified titleClasses: removed flex centering from h2 itself
  const titleClasses = "text-4xl md:text-5xl font-bold text-white mb-4";
  const subtitleClasses =
    "text-xl text-slate-300 max-w-2xl mx-auto text-center mb-12";

  return (
    <div className="flex-grow">
      <section className={sectionClasses}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* NEW: Wrapper div for icon and title */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <Banknote size={36} className="text-emerald-400" />
            <h2 className={titleClasses}>Financial Overview</h2>
          </div>
          <p className={subtitleClasses}>
            Get a comprehensive view of your financial health at a glance
          </p>
          <div className={cardClasses}>
            <DashboardSummary
              totalExpenses={totalExpenses}
              totalIncome={totalIncome}
              mostRecentTransactions={mostRecentTransactions}
            />
          </div>
        </div>
      </section>

      {/* Transaction Management Section */}
      <section className={`${sectionClasses} bg-slate-800/30`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Similarly, for "Transaction Management" title */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <DollarSign size={36} className="text-blue-400" />{" "}
            {/* Example icon for this section */}
            <h2 className={titleClasses}>Transaction Management</h2>
          </div>
          <p className={subtitleClasses}>
            Easily add, edit, and manage all your financial transactions
          </p>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div className={`${cardClasses} md:col-span-2`}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-white">
                  {transactionToEdit
                    ? "Edit Transaction"
                    : "Add New Transaction"}
                </h3>
              </div>
              <TransactionForm
                onTransactionSuccess={handleTransactionSuccess}
                transactionToEdit={transactionToEdit}
                userId={userId}
              />
            </div>

            <div className={`${cardClasses} md:col-span-3`}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-white">
                  Transaction History
                </h3>
              </div>
              {loadingTransactions ? (
                <div className="text-center py-12">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-slate-400 text-lg">
                    Loading transactions...
                  </p>
                </div>
              ) : transactionError ? (
                <div className="text-center py-12">
                  <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-red-400 text-2xl">!</span>
                  </div>
                  <p className="text-red-400 text-lg">{transactionError}</p>
                </div>
              ) : (
                <TransactionList
                  transactions={transactions}
                  onEdit={handleEditTransaction}
                  onDelete={handleDeleteTransaction}
                  onDataRefresh={handleTransactionSuccess}
                  userId={userId}
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Financial Analytics Section */}
      <section className={sectionClasses}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Similarly, for "Financial Analytics" title */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <BarChart3 size={36} className="text-purple-400" />{" "}
            {/* Example icon */}
            <h2 className={titleClasses}>Financial Analytics</h2>
          </div>
          <p className={subtitleClasses}>
            Visualize your spending patterns and discover insights about your
            financial habits
          </p>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <div className={cardClasses}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-white">
                  Spending Trends
                </h3>
              </div>
              <MonthlyExpensesChart
                userId={userId}
                triggerRefresh={refreshTrigger}
              />
            </div>
            <div className={cardClasses}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <PieChart className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-white">
                  Category Breakdown
                </h3>
              </div>
              <CategoryPieChart
                userId={userId}
                triggerRefresh={refreshTrigger}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-700/50 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-slate-400">
            <p>
              &copy; {new Date().getFullYear()} Personal Finance Visualizer.
              Built with React, and modern web technologies.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Main App component
function App() {
  const { deviceId, userId, loadingUser, error: userError } = useUser();
  const [transactions, setTransactions] = useState([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [transactionError, setTransactionError] = useState(null);
  const [transactionToEdit, setTransactionToEdit] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [mostRecentTransactions, setMostRecentTransactions] = useState([]);

  // Define your backend API base URL using an environment variable
  // This should be consistent across all frontend files making API calls.
  const API_BASE_URL = import.meta.env.VITE_APP_BACKEND_API_URL;

  const fetchTransactions = useCallback(async () => {
    if (!userId) return;

    setLoadingTransactions(true);
    setTransactionError(null);
    try {
      // UPDATED AXIOS ENDPOINT
      const response = await axios.get(
        `${API_BASE_URL}/api/transactions/${userId}`
      );
      const fetchedTransactions = response.data;
      setTransactions(fetchedTransactions);

      const expenses = fetchedTransactions
        .filter((t) => t.category !== "Income")
        .reduce((sum, t) => sum + t.amount, 0);
      setTotalExpenses(expenses);

      const income = fetchedTransactions
        .filter((t) => t.category === "Income")
        .reduce((sum, t) => sum + t.amount, 0);
      setTotalIncome(income);

      const sortedTransactions = [...fetchedTransactions].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      setMostRecentTransactions(sortedTransactions.slice(0, 5));
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setTransactionError(
        err.response?.data?.message || "Failed to load transactions."
      );
    } finally {
      setLoadingTransactions(false);
    }
  }, [userId, API_BASE_URL]); // Added API_BASE_URL to dependency array

  useEffect(() => {
    fetchTransactions();
  }, [userId, refreshTrigger, fetchTransactions]);

  const handleTransactionSuccess = useCallback(() => {
    setTransactionToEdit(null);
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  const handleEditTransaction = useCallback((transaction) => {
    setTransactionToEdit(transaction);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleDeleteTransaction = useCallback(() => {
    handleTransactionSuccess();
  }, [handleTransactionSuccess]);

  if (loadingUser) {
    return (
      <div className="flex justify-center items-center h-screen w-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-xl text-slate-300 animate-pulse">
            Loading your financial dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (userError) {
    return (
      <div className="flex justify-center items-center h-screen w-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-red-400 text-3xl">!</span>
          </div>
          <p className="text-xl text-red-400 mb-4">Something went wrong</p>
          <p className="text-slate-300">{userError}</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <nav className="bg-slate-900/90 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link
                to="/"
                className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent hover:from-blue-300 hover:to-purple-300 transition-all duration-200"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                Personal Finance
              </Link>
              <div className="flex items-center space-x-8">
                <Link
                  to="/"
                  className="text-slate-300 hover:text-blue-400 transition-colors duration-200 font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  to="/budgeting"
                  className="text-slate-300 hover:text-blue-400 transition-colors duration-200 font-medium"
                >
                  Budgeting
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="flex-grow">
          <Routes>
            <Route
              path="/"
              element={
                <Dashboard
                  deviceId={deviceId}
                  userId={userId}
                  loadingUser={loadingUser}
                  userError={userError}
                  transactions={transactions}
                  loadingTransactions={loadingTransactions}
                  transactionError={transactionError}
                  transactionToEdit={transactionToEdit}
                  handleTransactionSuccess={handleTransactionSuccess}
                  handleEditTransaction={handleEditTransaction}
                  handleDeleteTransaction={handleDeleteTransaction}
                  totalExpenses={totalExpenses}
                  totalIncome={totalIncome}
                  mostRecentTransactions={mostRecentTransactions}
                  refreshTrigger={refreshTrigger}
                />
              }
            />
            <Route
              path="/transactions/:transactionId"
              element={<TransactionDetailPage userId={userId} />}
            />
            <Route
              path="/budgeting"
              element={<BudgetingPage userId={userId} />}
            />
            {/* Default route: redirects to the dashboard if no other route matches */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
