import React, { useState, useEffect, useCallback } from "react";
import { useUser } from "../context/UserContext";
import axios from "axios";
import BudgetForm from "../components/BudgetForm";
import BudgetComparisonChart from "../components/BudgetComparisonChart";
import SpendingInsights from "../components/SpendingInsights";
import { getCategoryLabel } from "../services/category.service";
import {
  Target,
  TrendingUp,
  AlertCircle,
  Trash2,
  Calendar,
  DollarSign,
  PieChart,
} from "lucide-react";

// Define your backend API base URL using an environment variable
const API_BASE_URL = import.meta.env.VITE_APP_BACKEND_API_URL;

const BudgetingPage = () => {
  const { userId, loadingUser, error: userError } = useUser();
  const [budgets, setBudgets] = useState([]);
  const [loadingBudgets, setLoadingBudgets] = useState(false);
  const [budgetError, setBudgetError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [currentMonthBudgetComparison, setCurrentMonthBudgetComparison] =
    useState([]);

  // Reusable Tailwind classes for consistency from LandingPage
  const sectionContainerClasses = "py-16";
  const contentWrapperClasses = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8";
  const cardClasses =
    "bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 shadow-xl";
  const mainTitleClasses =
    "text-5xl md:text-7xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent";
  const sectionTitleClasses =
    "text-4xl font-bold text-white mb-6 pb-4 border-b border-slate-700 text-center";
  const subtitleClasses =
    "text-xl text-slate-300 max-w-2xl mx-auto text-center mb-12";
  const cardHeadingClasses =
    "text-2xl font-semibold text-white mb-4 pb-2 border-b border-slate-700";

  const fetchBudgets = useCallback(async () => {
    if (!userId) return;
    setLoadingBudgets(true);
    setBudgetError(null);
    try {
      const budgetsResponse = await axios.get(
        `${API_BASE_URL}/api/budgets/${userId}`
      );
      setBudgets(budgetsResponse.data);

      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      const comparisonResponse = await axios.get(
        `${API_BASE_URL}/api/budgets/${userId}/comparison`,
        {
          params: { month: currentMonth, year: currentYear },
        }
      );
      setCurrentMonthBudgetComparison(comparisonResponse.data);
    } catch (err) {
      console.error("Error fetching budgets:", err);
      setBudgetError(err.response?.data?.message || "Failed to load budgets.");
    } finally {
      setLoadingBudgets(false);
    }
  }, [userId, API_BASE_URL]);

  useEffect(() => {
    if (!loadingUser && userId) {
      fetchBudgets();
    }
  }, [userId, loadingUser, refreshTrigger, fetchBudgets]);

  const handleBudgetSuccess = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  const handleDeleteBudget = async (budgetId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this budget? This action cannot be undone."
      )
    ) {
      return;
    }
    setBudgetError(null);
    try {
      await axios.delete(`${API_BASE_URL}/api/budgets/${budgetId}`, {
        params: { userId: userId },
      });
      handleBudgetSuccess();
    } catch (err) {
      console.error("Error deleting budget:", err);
      setBudgetError(err.response?.data?.message || "Failed to delete budget.");
    }
  };

  if (loadingUser || loadingBudgets) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 mx-auto animate-pulse">
            <Target className="w-8 h-8 text-white" />
          </div>
          <p className="text-xl text-slate-300 animate-pulse">
            Loading budgeting data...
          </p>
        </div>
      </div>
    );
  }

  if (userError || budgetError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 flex items-center justify-center p-6">
        <div className="bg-red-900/50 backdrop-blur-sm border border-red-700/50 rounded-2xl p-8 max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-lg text-red-300">{userError || budgetError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 font-sans">
      <div className={contentWrapperClasses}>
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
              <Target className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className={mainTitleClasses}>Budget Management</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Set monthly budgets, track spending, and get insights to achieve
            your financial goals
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-12">
          {/* Set Budget Form */}
          <div className="xl:col-span-1">
            <div className={`${cardClasses} hover:scale-[1.005]`}>
              {" "}
              {/* Added subtle hover effect */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <h2
                  className={cardHeadingClasses.replace(
                    "mb-4 pb-2 border-b border-slate-700",
                    ""
                  )}
                >
                  Set Budget
                </h2>{" "}
                {/* Adjusted heading for card */}
              </div>
              <BudgetForm
                onBudgetSuccess={handleBudgetSuccess}
                currentBudgets={budgets}
                userId={userId}
              />
            </div>
          </div>

          {/* Current Budgets List */}
          <div className="xl:col-span-2">
            <div className={cardClasses}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <h2
                  className={cardHeadingClasses.replace(
                    "mb-4 pb-2 border-b border-slate-700",
                    ""
                  )}
                >
                  Your Current Budgets
                </h2>
              </div>
              {budgets.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-700/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-400 text-lg">
                    No budgets set yet. Create your first budget to get started!
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-700">
                    <thead className="bg-slate-700/50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                          Month
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                          Year
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-slate-300 uppercase tracking-wider">
                          Budgeted Amount (₹)
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-semibold text-slate-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                      {budgets.map((budget) => (
                        <tr
                          key={budget._id}
                          className="bg-slate-800/60 hover:bg-slate-700/70 transition-colors duration-150"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-base font-normal text-white">
                            {getCategoryLabel(budget.category)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-base font-normal text-slate-300">
                            {new Date(
                              budget.year,
                              budget.month - 1
                            ).toLocaleString("default", { month: "long" })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-base font-normal text-slate-300">
                            {budget.year}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-base text-emerald-400 font-semibold text-right">
                            ₹{budget.budgetedAmount.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                            <button
                              onClick={() => handleDeleteBudget(budget._id)}
                              className="bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 p-2 rounded-md transition-all duration-200"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-12">
          {/* Budget vs Actual Chart */}
          <div className={`${cardClasses} hover:scale-[1.005]`}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h2
                className={cardHeadingClasses.replace(
                  "mb-4 pb-2 border-b border-slate-700",
                  ""
                )}
              >
                Budget vs Actual Comparison
              </h2>
            </div>
            <BudgetComparisonChart
              userId={userId}
              triggerRefresh={refreshTrigger}
            />
          </div>

          {/* Spending Insights */}
          <div className={`${cardClasses} hover:scale-[1.005]`}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <PieChart className="w-5 h-5 text-white" />
              </div>
              <h2
                className={cardHeadingClasses.replace(
                  "mb-4 pb-2 border-b border-slate-700",
                  ""
                )}
              >
                Spending Insights
              </h2>
            </div>
            <SpendingInsights
              userId={userId}
              budgetComparisonData={currentMonthBudgetComparison}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetingPage;
