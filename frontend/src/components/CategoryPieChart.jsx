// frontend/src/components/CategoryPieChart.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useUser } from "../context/UserContext";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { getCategoryLabel } from "../services/category.service"; // For labels

// Define your backend API base URL using an environment variable
const API_BASE_URL = import.meta.env.VITE_APP_BACKEND_API_URL;

// Define a consistent color palette based on the design system and common UI colors
const COLORS = [
  "#6366f1", // indigo-500
  "#a855f7", // purple-500
  "#f43f5e", // rose-500
  "#ec4899", // pink-500
  "#fbbf24", // amber-400
  "#22d3ee", // cyan-400
  "#10b981", // emerald-500
  "#3b82f6", // blue-500
  "#ef4444", // red-500
  "#84cc16", // lime-500
];

const CategoryPieChart = ({ triggerRefresh }) => {
  const { userId } = useUser();
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategoryBreakdown = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // UPDATED AXIOS ENDPOINT
      const response = await axios.get(
        `${API_BASE_URL}/api/transactions/${userId}/category-breakdown`
      );
      // Filter out income AND ensure totalAmount is a valid, non-zero number
      const data = response.data.filter(
        (item) =>
          item.category !== "Income" &&
          typeof item.totalAmount === "number" &&
          !isNaN(item.totalAmount) &&
          item.totalAmount > 0
      );

      // Format data for Recharts, ensuring value is totalAmount
      const formattedData = data.map((item) => ({
        name: getCategoryLabel(item.category),
        value: item.totalAmount,
      }));
      setChartData(formattedData);
    } catch (err) {
      console.error("Error fetching category breakdown:", err);
      setError(
        err.response?.data?.message || "Failed to load category breakdown."
      );
    } finally {
      setLoading(false);
    }
  }, [userId, API_BASE_URL]); // Added API_BASE_URL to dependency array

  useEffect(() => {
    fetchCategoryBreakdown();
  }, [fetchCategoryBreakdown, triggerRefresh]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-slate-800/50 rounded-lg">
        <p className="text-center text-slate-400 text-lg">
          Loading expense categories...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 bg-red-900/20 rounded-lg">
        <p className="text-red-400 text-center text-lg">{error}</p>
      </div>
    );
  }

  // Ensure chartData is not empty AND contains valid values before rendering the chart
  // This is a more robust check than just chartData.length === 0
  const hasValidChartData =
    chartData.length > 0 &&
    chartData.every(
      (item) =>
        typeof item.value === "number" && !isNaN(item.value) && item.value > 0
    );

  if (!hasValidChartData) {
    return (
      <div className="flex justify-center items-center h-64 bg-slate-800/50 rounded-lg">
        <p className="text-center text-slate-400 text-lg px-4">
          No expense data to display in the category chart yet. Add some
          expenses to see your spending breakdown!
        </p>
      </div>
    );
  }

  return (
    <div className="font-sans">
      <ResponsiveContainer width="100%" height={500}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="40%"
            labelLine={false}
            outerRadius={180}
            dataKey="value"
          >
            {/* The Cell component is rendered for each item in chartData */}
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                // Optionally add a subtle stroke for separation, but `strokeWidth={0}` removes it.
                // stroke={COLORS[index % COLORS.length]}
                // strokeWidth={0}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => `₹${value.toFixed(2)}`}
            contentStyle={{
              backgroundColor: "#334155",
              borderColor: "#475569",
              borderRadius: "8px",
              color: "#e2e8f0",
              fontSize: "14px",
              padding: "10px",
            }}
            labelStyle={{ color: "#cbd5e1" }}
            itemStyle={{ color: "#e2e8f0" }}
          />
          <Legend wrapperStyle={{ paddingTop: "16px", color: "#94a3b8" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryPieChart;
