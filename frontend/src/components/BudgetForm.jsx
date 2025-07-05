// frontend/src/components/BudgetForm.jsx
import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import axios from "axios";
import { categories } from "../services/category.service"; // Import categories

const BudgetForm = ({ onBudgetSuccess, currentBudgets = [] }) => {
  const { userId } = useUser();
  const [category, setCategory] = useState(
    categories.filter((c) => c.value !== "Income")[0]?.value || "Food"
  ); // Default to first non-income category
  const [budgetedAmount, setBudgetedAmount] = useState("");
  const [month, setMonth] = useState(new Date().getMonth() + 1); // Current month (1-12)
  const [year, setYear] = useState(new Date().getFullYear()); // Current year
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Effect to pre-fill amount if a budget for the selected category/month/year already exists
  useEffect(() => {
    const existingBudget = currentBudgets.find(
      (b) => b.category === category && b.month === month && b.year === year
    );
    if (existingBudget) {
      setBudgetedAmount(existingBudget.budgetedAmount);
    } else {
      setBudgetedAmount("");
    }
  }, [category, month, year, currentBudgets]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!userId) {
      setError("User not identified. Please refresh.");
      return;
    }
    if (
      budgetedAmount === "" ||
      isNaN(budgetedAmount) ||
      parseFloat(budgetedAmount) < 0
    ) {
      setError("Please enter a valid non-negative budgeted amount.");
      return;
    }

    const budgetData = {
      userId,
      category,
      month: parseInt(month),
      year: parseInt(year),
      budgetedAmount: parseFloat(budgetedAmount),
    };

    try {
      await axios.post("http://localhost:3000/api/budgets", budgetData);
      setSuccessMessage("Budget saved successfully!");
      onBudgetSuccess(); // Trigger a refresh of budgets
      // Optionally reset form for next entry
      // setBudgetedAmount(""); // Decided to keep pre-fill behavior from useEffect
    } catch (err) {
      console.error("Error setting budget:", err);
      setError(
        err.response?.data?.message ||
          "An unexpected error occurred while setting budget."
      );
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i); // Current year, 2 before, 2 after

  return (
    <form onSubmit={handleSubmit} className="space-y-6 font-sans">
      <div>
        <label
          htmlFor="budgetCategory"
          className="block text-base font-medium text-slate-300 mb-2"
        >
          Category
        </label>
        <select
          id="budgetCategory"
          className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md p-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 appearance-none"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          {categories
            .filter((c) => c.value !== "Income") // Exclude Income from budgetable categories
            .map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
        </select>
      </div>

      <div className="flex space-x-4">
        <div className="flex-1">
          <label
            htmlFor="budgetMonth"
            className="block text-base font-medium text-slate-300 mb-2"
          >
            Month
          </label>
          <select
            id="budgetMonth"
            className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md p-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 appearance-none"
            value={month}
            onChange={(e) => setMonth(parseInt(e.target.value))}
            required
          >
            {[...Array(12).keys()].map((i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label
            htmlFor="budgetYear"
            className="block text-base font-medium text-slate-300 mb-2"
          >
            Year
          </label>
          <select
            id="budgetYear"
            className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md p-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 appearance-none"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
            required
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label
          htmlFor="budgetedAmount"
          className="block text-base font-medium text-slate-300 mb-2"
        >
          Budgeted Amount (₹)
        </label>
        <input
          type="number"
          id="budgetedAmount"
          className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md p-2.5 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          value={budgetedAmount}
          onChange={(e) => setBudgetedAmount(e.target.value)}
          placeholder="e.g., 5000.00"
          step="0.01"
          min="0"
          required
        />
      </div>

      {error && (
        <p className="text-red-400 text-sm font-medium mt-4">{error}</p>
      )}
      {successMessage && (
        <p className="text-emerald-400 text-sm font-medium mt-4">
          {successMessage}
        </p>
      )}

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg py-3 px-6 rounded-md shadow-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all duration-200 transform hover:scale-105"
      >
        Set/Update Budget
      </button>
    </form>
  );
};

export default BudgetForm;
