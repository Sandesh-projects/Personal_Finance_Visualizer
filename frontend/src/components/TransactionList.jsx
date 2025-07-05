// frontend/src/components/TransactionList.jsx
import React, { useState } from "react";
import { useUser } from "../context/UserContext";
import axios from "axios";
import { getCategoryLabel } from "../services/category.service";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowUp } from "lucide-react";

const TransactionList = ({ transactions, onEdit, onDelete, onDataRefresh }) => {
  const { userId } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [transactionsPerPage, setTransactionsPerPage] = useState(5);
  const [showAllTransactions, setShowAllTransactions] = useState(false);

  const transactionsToDisplay = showAllTransactions
    ? transactions
    : transactions.slice(0, transactionsPerPage);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) {
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await axios.delete(`http://localhost:3000/api/transactions/${id}`, {
        params: { userId: userId },
      });
      onDataRefresh();
    } catch (err) {
      console.error("Error deleting transaction:", err);
      setError(
        err.response?.data?.message ||
          "An unexpected error occurred during deletion."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleShowMore = () => {
    setTransactionsPerPage((prev) => prev + 5);
  };

  const handleShowLess = () => {
    setTransactionsPerPage(5);
    setShowAllTransactions(false);
  };

  const handleShowAll = () => {
    setShowAllTransactions(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-24 bg-slate-800/50 rounded-lg">
        <p className="text-center text-slate-400 text-lg">
          Deleting transaction...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-24 bg-red-900/20 rounded-lg">
        <p className="text-red-400 text-center text-lg">{error}</p>
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="flex justify-center items-center h-24 bg-slate-800/50 rounded-lg">
        <p className="text-center text-slate-400 text-lg px-4">
          No transactions recorded yet. Add one to get started!
        </p>
      </div>
    );
  }

  const hasMoreTransactions = transactionsPerPage < transactions.length;
  const canShowAll =
    !showAllTransactions && transactions.length > transactionsToDisplay.length;
  const showShowMoreButton = !showAllTransactions && hasMoreTransactions;
  const showShowLessButton = showAllTransactions || transactionsPerPage > 5;

  return (
    <div className="overflow-x-auto font-sans bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl  pb-4">
      <table className="min-w-full rounded-t-lg overflow-hidden">
        <thead className="bg-slate-700">
          <tr>
            <th className="py-3 px-4 text-left text-sm font-semibold text-slate-200 uppercase tracking-wider rounded-tl-lg border-r border-slate-600">
              Date
            </th>
            <th className="py-3 px-4 text-left text-sm font-semibold text-slate-200 uppercase tracking-wider border-r border-slate-600">
              Category
            </th>
            <th className="py-3 px-4 text-left text-sm font-semibold text-slate-200 uppercase tracking-wider border-r border-slate-600">
              Amount
            </th>
            <th className="py-3 px-4 text-center text-sm font-semibold text-slate-200 uppercase tracking-wider rounded-tr-lg">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700">
          {/* REMOVED: {" "} here */}
          {transactionsToDisplay.map((transaction) => (
            <tr
              key={transaction._id}
              className="hover:bg-slate-700 transition-colors duration-150"
            >
              <td className="py-3 px-4 whitespace-nowrap text-base text-slate-300 border-r border-slate-700">
                {new Date(transaction.date).toLocaleDateString("en-IN")}
              </td>
              <td className="py-3 px-4 whitespace-nowrap text-base text-slate-300 border-r border-slate-700">
                {getCategoryLabel(transaction.category)}
              </td>
              <td
                className={`py-3 px-4 whitespace-nowrap text-base font-semibold border-r border-slate-700 ${
                  transaction.category === "Income"
                    ? "text-emerald-400"
                    : "text-red-400"
                }`}
              >
                ₹{transaction.amount.toFixed(2)}
              </td>
              <td className="py-3 px-4 text-center whitespace-nowrap text-sm font-medium">
                <Link
                  to={`/transactions/${transaction._id}`}
                  className="text-blue-400 hover:text-blue-300 mr-2 px-2 py-1 rounded transition-all duration-200"
                >
                  View
                </Link>
                <button
                  onClick={() => onEdit(transaction)}
                  className="text-indigo-400 hover:text-indigo-300 mr-2 px-2 py-1 rounded transition-all duration-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(transaction._id)}
                  className="text-red-400 hover:text-red-300 px-2 py-1 rounded transition-all duration-200"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {(showShowMoreButton || canShowAll || showShowLessButton) && (
        <div className="mt-6 flex justify-center items-center gap-4">
          {showShowMoreButton && (
            <button
              onClick={handleShowMore}
              className="inline-flex items-center justify-center text-slate-300 hover:text-white border border-slate-600 hover:bg-slate-700 px-4 py-2 rounded-lg font-medium transition-colors duration-200 gap-2 group"
            >
              Show More
              <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform duration-200" />
            </button>
          )}

          {canShowAll && (
            <button
              onClick={handleShowAll}
              className="inline-flex items-center justify-center text-slate-300 hover:text-white border border-slate-600 hover:bg-slate-700 px-4 py-2 rounded-lg font-medium transition-colors duration-200 gap-2 group"
            >
              Show All
              <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform duration-200" />
            </button>
          )}

          {showShowLessButton && (
            <button
              onClick={handleShowLess}
              className="inline-flex items-center justify-center text-slate-300 hover:text-white border border-slate-600 hover:bg-slate-700 px-4 py-2 rounded-lg font-medium transition-colors duration-200 gap-2 group"
            >
              Show Less
              <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform duration-200" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TransactionList;
