// frontend/src/components/MonthlyExpensesChart.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useUser } from "../context/UserContext";
import axios from "axios";
import {
  BarChart,
  Bar,
  LineChart, // Import LineChart
  Line, // Import Line
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Define your backend API base URL using an environment variable
const API_BASE_URL = import.meta.env.VITE_APP_BACKEND_API_URL;

const MonthlyExpensesChart = ({ triggerRefresh }) => {
  const { userId } = useUser();
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartType, setChartType] = useState("BarChart"); // 'BarChart' or 'LineChart'
  const [timeGranularity, setTimeGranularity] = useState("month"); // 'day', 'month', 'year'

  const fetchChartData = useCallback(
    async (granularity) => {
      if (!userId) {
        setLoading(false); // Ensure loading is false if no userId
        return;
      }

      setLoading(true);
      setError(null);
      try {
        // Adjust API endpoint based on granularity
        // Assuming backend supports a /api/transactions/:userId/aggregated-expenses endpoint
        // with a 'granularity' query parameter (day, month, year)
        // UPDATED AXIOS ENDPOINT
        const response = await axios.get(
          `${API_BASE_URL}/api/transactions/${userId}/aggregated-expenses`,
          {
            params: { granularity },
          }
        );
        const data = response.data;

        const formattedData = data.map((item) => {
          let name;
          if (granularity === "day") {
            // Format as "DD MMM"
            name = new Date(
              item.year,
              item.month - 1,
              item.day
            ).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
          } else if (granularity === "month") {
            // Format as "MMM YY"
            name = new Date(item.year, item.month - 1).toLocaleString("en-IN", {
              month: "short",
              year: "2-digit",
            });
          } else if (granularity === "year") {
            // Format as "YYYY"
            name = String(item.year);
          }

          return {
            name,
            expenses: item.totalAmount,
          };
        });
        setChartData(formattedData);
      } catch (err) {
        console.error("Error fetching aggregated expenses:", err);
        setError(err.response?.data?.message || "Failed to load chart data.");
      } finally {
        setLoading(false);
      }
    },
    [userId, API_BASE_URL] // Added API_BASE_URL to dependency array
  );

  useEffect(() => {
    fetchChartData(timeGranularity);
  }, [fetchChartData, triggerRefresh, timeGranularity]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-slate-800/50 rounded-lg">
        <p className="text-center text-slate-400 text-lg">Loading chart...</p>
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

  if (chartData.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 bg-slate-800/50 rounded-lg">
        <p className="text-center text-slate-400 text-lg px-4">
          No expense data to display for the selected period/granularity.
        </p>
      </div>
    );
  }

  const commonChartProps = {
    data: chartData,
    margin: { top: 5, right: 30, left: 20, bottom: 5 },
  };

  const axisTickStyle = { fill: "#94a3b8", fontSize: 12 }; // slate-400
  const tooltipContentStyle = {
    backgroundColor: "#334155", // slate-700
    borderColor: "#475569", // slate-600
    borderRadius: "8px",
    color: "#e2e8f0", // slate-200
    fontSize: "14px",
    padding: "10px",
  };
  const tooltipLabelStyle = { color: "#cbd5e1" }; // slate-300
  const tooltipItemStyle = { color: "#e2e8f0" }; // slate-200
  const legendWrapperStyle = { paddingTop: "16px", color: "#94a3b8" }; // slate-400

  return (
    <div className="font-sans">
      <div className="flex flex-wrap justify-center md:justify-end gap-3 mb-6">
        {/* Chart Type Toggles */}
        <div className="flex bg-slate-700 rounded-lg p-1 shadow-inner">
          <button
            onClick={() => setChartType("BarChart")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              chartType === "BarChart"
                ? "bg-indigo-600 text-white shadow"
                : "text-slate-300 hover:text-slate-100 hover:bg-slate-600"
            }`}
          >
            Bar Chart
          </button>
          <button
            onClick={() => setChartType("LineChart")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              chartType === "LineChart"
                ? "bg-indigo-600 text-white shadow"
                : "text-slate-300 hover:text-slate-100 hover:bg-slate-600"
            }`}
          >
            Line Chart
          </button>
        </div>

        {/* Time Granularity Toggles */}
        <div className="flex bg-slate-700 rounded-lg p-1 shadow-inner">
          <button
            onClick={() => setTimeGranularity("day")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              timeGranularity === "day"
                ? "bg-indigo-600 text-white shadow"
                : "text-slate-300 hover:text-slate-100 hover:bg-slate-600"
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setTimeGranularity("month")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              timeGranularity === "month"
                ? "bg-indigo-600 text-white shadow"
                : "text-slate-300 hover:text-slate-100 hover:bg-slate-600"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setTimeGranularity("year")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              timeGranularity === "year"
                ? "bg-indigo-600 text-white shadow"
                : "text-slate-300 hover:text-slate-100 hover:bg-slate-600"
            }`}
          >
            Yearly
          </button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        {chartType === "BarChart" ? (
          <BarChart {...commonChartProps}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#475569"
              opacity={0.6}
            />
            <XAxis dataKey="name" tick={axisTickStyle} />
            <YAxis tick={axisTickStyle} />
            <Tooltip
              formatter={(value) => `₹${value.toFixed(2)}`}
              contentStyle={tooltipContentStyle}
              labelStyle={tooltipLabelStyle}
              itemStyle={tooltipItemStyle}
              cursor={{ fill: "rgba(100, 116, 139, 0.2)" }}
            />
            <Legend wrapperStyle={legendWrapperStyle} />
            <Bar
              dataKey="expenses"
              fill="#6366f1" // indigo-500
              name="Total Expenses"
              radius={[10, 10, 0, 0]}
            />
          </BarChart>
        ) : (
          <LineChart {...commonChartProps}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#475569"
              opacity={0.6}
            />
            <XAxis dataKey="name" tick={axisTickStyle} />
            <YAxis tick={axisTickStyle} />
            <Tooltip
              formatter={(value) => `₹${value.toFixed(2)}`}
              contentStyle={tooltipContentStyle}
              labelStyle={tooltipLabelStyle}
              itemStyle={tooltipItemStyle}
              cursor={{ stroke: "rgba(100, 116, 139, 0.2)", strokeWidth: 2 }} // Line chart cursor
            />
            <Legend wrapperStyle={legendWrapperStyle} />
            <Line
              type="monotone" // Smooth line
              dataKey="expenses"
              stroke="#8b5cf6" // purple-500 for line
              strokeWidth={2}
              name="Total Expenses"
              activeDot={{
                r: 8,
                fill: "#a78bfa",
                stroke: "#8b5cf6",
                strokeWidth: 2,
              }} // Active dot styling
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyExpensesChart;
