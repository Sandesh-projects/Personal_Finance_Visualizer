// frontend/src/components/BudgetComparisonChart.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useUser } from "../context/UserContext";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getCategoryLabel } from "../services/category.service"; // For labels

const BudgetComparisonChart = ({ triggerRefresh }) => {
  const { userId } = useUser();
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const fetchBudgetComparison = useCallback(async () => {
    if (!userId) {
      setLoading(false); // Ensure loading is false if no userId
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `http://localhost:3000/api/budgets/${userId}/comparison`,
        {
          params: { month: selectedMonth, year: selectedYear },
        }
      );

      const formattedData = response.data.map((item) => ({
        name: getCategoryLabel(item.category),
        Budgeted: item.budgeted,
        Actual: item.actual,
      }));
      setChartData(formattedData);
    } catch (err) {
      console.error("Error fetching budget comparison:", err);
      setError(
        err.response?.data?.message || "Failed to load budget comparison data."
      );
    } finally {
      setLoading(false);
    }
  }, [userId, selectedMonth, selectedYear]);

  useEffect(() => {
    fetchBudgetComparison();
  }, [fetchBudgetComparison, triggerRefresh]);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i); // Current year, 2 years before, 2 years after

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-slate-800/50 rounded-lg">
        <p className="text-center text-slate-400 text-lg">
          Loading budget comparison...
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

  return (
    <div className="font-sans">
      {/* Month and Year Selectors */}
      <div className="flex flex-col sm:flex-row justify-center sm:space-x-4 mb-6 space-y-4 sm:space-y-0">
        <select
          className="bg-slate-700 border border-slate-600 rounded-md p-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 appearance-none"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
        >
          {[...Array(12).keys()].map((i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>
        <select
          className="bg-slate-700 border border-slate-600 rounded-md p-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 appearance-none"
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {chartData.length === 0 ? (
        <div className="flex justify-center items-center h-64 bg-slate-800/50 rounded-lg">
          <p className="text-center text-slate-400 text-lg">
            No budget or spending data for the selected period.
          </p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#475569"
              opacity={0.6}
            />
            <XAxis
              dataKey="name"
              interval={0}
              angle={-30}
              textAnchor="end"
              height={60}
              tick={{ fill: "#94a3b8", fontSize: 12 }} // text-slate-400 equivalent
            />
            <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />{" "}
            {/* text-slate-400 equivalent */}
            <Tooltip
              cursor={{ fill: "rgba(100, 116, 139, 0.2)" }} // slate-500 with opacity
              contentStyle={{
                backgroundColor: "#334155", // slate-700
                borderColor: "#475569", // slate-600
                borderRadius: "8px",
                color: "#e2e8f0", // slate-200
                fontSize: "14px",
              }}
              itemStyle={{ color: "#e2e8f0" }} // slate-200
              labelStyle={{ color: "#cbd5e1" }} // slate-300
              formatter={(value) => `₹${value.toFixed(2)}`}
            />
            <Legend wrapperStyle={{ paddingTop: "16px", color: "#94a3b8" }} />{" "}
            {/* text-slate-400 equivalent */}
            {/* Colors: Budgeted: Primary Light (#3b82f6 - blue-500), Actual: Primary Dark (#1d4ed8 - blue-700) */}
            <Bar dataKey="Budgeted" fill="#6366f1" radius={[10, 10, 0, 0]} />{" "}
            {/* indigo-500 */}
            <Bar dataKey="Actual" fill="#a855f7" radius={[10, 10, 0, 0]} />{" "}
            {/* purple-500 */}
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default BudgetComparisonChart;
