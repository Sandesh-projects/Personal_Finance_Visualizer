// frontend/src/components/TransactionForm.jsx
import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import axios from "axios";
import { categories } from "../services/category.service"; // Import categories

const TransactionForm = ({ onTransactionSuccess, transactionToEdit }) => {
  const { userId } = useUser();

  // Helper to get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(getTodayDate()); // Set initial date state to today's date
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(categories[0]?.value || "");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (transactionToEdit) {
      setIsEditing(true);
      setAmount(transactionToEdit.amount);
      // Ensure date is in YYYY-MM-DD format for the input type="date"
      setDate(new Date(transactionToEdit.date).toISOString().split("T")[0]);
      setDescription(transactionToEdit.description);
      // Ensure category matches one of the values, default to first if not found
      setCategory(transactionToEdit.category || categories[0]?.value || "");
      setError(null);
      setSuccessMessage(null);
    } else {
      setIsEditing(false);
      setAmount("");
      setDate(getTodayDate()); // When not editing, reset date to today's date
      setDescription("");
      setCategory(categories[0]?.value || "");
      setError(null);
      setSuccessMessage(null);
    }
  }, [transactionToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // Basic client-side validation
    if (!amount || !date || !description || !category) {
      setError("All fields are required.");
      return;
    }
    if (isNaN(amount) || parseFloat(amount) <= 0) {
      setError("Amount must be a positive number.");
      return;
    }
    if (new Date(date).toString() === "Invalid Date") {
      setError("Please enter a valid date.");
      return;
    }
    if (!categories.map((cat) => cat.value).includes(category)) {
      setError("Invalid category selected.");
      return;
    }

    const transactionData = {
      userId,
      amount: parseFloat(amount),
      date,
      description,
      category,
    };

    const url = isEditing
      ? `http://localhost:3000/api/transactions/${transactionToEdit._id}`
      : "http://localhost:3000/api/transactions";
    const requestMethod = isEditing ? "put" : "post";

    try {
      await axios[requestMethod](url, transactionData);

      setSuccessMessage(
        isEditing ? "Transaction updated!" : "Transaction added!"
      );
      if (!isEditing) {
        setAmount("");
        setDate(getTodayDate()); // Reset date to today's date after adding
        setDescription("");
        setCategory(categories[0]?.value || "");
      }
      onTransactionSuccess(); // Trigger a refresh of transactions in the parent component
    } catch (err) {
      console.error("Error submitting transaction:", err);
      setError(err.response?.data?.message || "An unexpected error occurred.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 font-sans">
      <div>
        <label
          htmlFor="amount"
          className="block text-base font-medium text-slate-300 mb-2"
        >
          Amount (₹)
        </label>
        <input
          type="number"
          id="amount"
          className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md p-2.5 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="e.g., 50.00"
          step="0.01"
          min="0"
          required
        />
      </div>
      <div>
        <label
          htmlFor="date"
          className="block text-base font-medium text-slate-300 mb-2"
        >
          Date
        </label>
        <input
          type="date"
          id="date"
          className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md p-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>
      <div>
        <label
          htmlFor="description"
          className="block text-base font-medium text-slate-300 mb-2"
        >
          Description
        </label>
        <input
          type="text"
          id="description"
          className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md p-2.5 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g., Groceries, Rent, Salary"
          required
        />
      </div>
      <div>
        <label
          htmlFor="category"
          className="block text-base font-medium text-slate-300 mb-2"
        >
          Category
        </label>
        <select
          id="category"
          className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md p-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 appearance-none"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
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
        {isEditing ? "Update Transaction" : "Add Transaction"}
      </button>
    </form>
  );
};

export default TransactionForm;
