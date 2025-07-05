import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useUser } from "../context/UserContext";
import { getCategoryLabel } from "../services/category.service";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Tag,
  Clock,
  FileText,
} from "lucide-react";

const TransactionDetailPage = () => {
  const { transactionId } = useParams();
  const { userId, loadingUser, error: userError } = useUser();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactionDetails = async () => {
      if (!userId || !transactionId) return;

      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `http://localhost:3000/api/transactions/detail/${transactionId}`,
          {
            params: { userId: userId },
          }
        );
        setTransaction(response.data);
      } catch (err) {
        console.error("Error fetching transaction details:", err);
        setError(
          err.response?.data?.message || "Failed to load transaction details."
        );
      } finally {
        setLoading(false);
      }
    };

    if (!loadingUser && userId) {
      fetchTransactionDetails();
    }
  }, [transactionId, userId, loadingUser]);

  if (loadingUser || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex justify-center items-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <DollarSign className="w-8 h-8 text-white" />
          </div>
          <p className="text-xl font-medium text-slate-300 animate-pulse">
            Loading transaction details...
          </p>
        </div>
      </div>
    );
  }

  if (userError || error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex justify-center items-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-red-900/50 backdrop-blur-sm rounded-2xl p-8 border border-red-700/50 text-center shadow-xl">
            <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-8 h-8 text-red-400" />
            </div>
            <p className="text-lg font-medium text-red-300 mb-6">
              {userError || error}
            </p>
            <Link
              to="/"
              className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex justify-center items-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 text-center shadow-xl">
            <div className="w-16 h-16 bg-slate-700/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-lg font-medium text-slate-300 mb-6">
              Transaction not found or you don't have access.
            </p>
            <Link
              to="/"
              className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Main Transaction Detail Card */}
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden shadow-xl">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-8 border-b border-slate-700/50">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Transaction Details
                </h1>
                <p className="text-slate-300">
                  Complete information about your transaction
                </p>
              </div>
            </div>
          </div>

          {/* Transaction Details Grid */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/30">
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="w-5 h-5 text-blue-400" />
                  <h3 className="text-lg font-semibold text-white">
                    Description
                  </h3>
                </div>
                <p className="text-slate-300 text-lg break-words">
                  {transaction.description}
                </p>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/30">
                <div className="flex items-center gap-3 mb-4">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  <h3 className="text-lg font-semibold text-white">Amount</h3>
                </div>
                <p
                  className={`text-2xl font-bold ${
                    transaction.category === "Income"
                      ? "text-emerald-400"
                      : "text-red-400"
                  }`}
                >
                  ₹{transaction.amount.toFixed(2)}
                </p>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/30">
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="w-5 h-5 text-purple-400" />
                  <h3 className="text-lg font-semibold text-white">Date</h3>
                </div>
                <p className="text-slate-300 text-lg">
                  {new Date(transaction.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    weekday: "long",
                  })}
                </p>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/30">
                <div className="flex items-center gap-3 mb-4">
                  <Tag className="w-5 h-5 text-pink-400" />
                  <h3 className="text-lg font-semibold text-white">Category</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      transaction.category === "Income"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {getCategoryLabel(transaction.category)}
                  </span>
                </div>
              </div>
            </div>

            {/* Recorded On Section */}
            <div className="mt-8 bg-slate-800/30 rounded-xl p-6 border border-slate-700/20">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-5 h-5 text-slate-400" />
                <h3 className="text-lg font-semibold text-white">
                  Recorded On
                </h3>
              </div>
              <p className="text-slate-300">
                {new Date(transaction.createdAt).toLocaleString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-8 bg-slate-800/30 border-t border-slate-700/50">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/"
                className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg transform hover:scale-105 transition-all duration-200 gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailPage;
