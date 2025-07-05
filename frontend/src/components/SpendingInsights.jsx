// frontend/src/components/SpendingInsights.jsx
import React from "react";
import { getCategoryLabel } from "../services/category.service";

const SpendingInsights = ({ budgetComparisonData }) => {
  if (!budgetComparisonData || budgetComparisonData.length === 0) {
    return (
      <div className="font-sans">
        <h3 className="text-xl font-semibold text-white mb-4">
          Spending Insights
        </h3>
        <p className="text-slate-400 text-base">
          No budget or spending data available for insights for the selected
          period.
        </p>
      </div>
    );
  }

  const insights = [];
  let totalBudgetedOverall = 0;
  let totalActualOverall = 0;
  let totalOverspent = 0;
  let totalUnderspent = 0;
  let overspentCategories = [];
  let underspentCategories = [];
  let unbudgetedSpending = [];

  budgetComparisonData.forEach((item) => {
    const categoryLabel = getCategoryLabel(item.category);

    totalBudgetedOverall += item.budgeted;
    totalActualOverall += item.actual;

    if (item.actual > item.budgeted && item.budgeted > 0) {
      const difference = item.actual - item.budgeted;
      totalOverspent += difference;
      overspentCategories.push({ category: categoryLabel, difference });
    } else if (item.actual < item.budgeted && item.budgeted > 0) {
      const difference = item.budgeted - item.actual;
      totalUnderspent += difference;
      underspentCategories.push({ category: categoryLabel, difference });
    } else if (item.actual > 0 && item.budgeted === 0) {
      // If there's actual spending but no budget set for this category
      unbudgetedSpending.push({ category: categoryLabel, amount: item.actual });
    }
  });

  // --- Cumulative Overall Insight ---
  if (totalBudgetedOverall > 0 || totalActualOverall > 0) {
    const overallDifference = totalBudgetedOverall - totalActualOverall;
    if (overallDifference > 0) {
      insights.push(
        <p
          key="overall-underspent"
          className="text-base font-semibold text-emerald-400 mb-3"
        >
          Overall, you are doing great! You've **spent ₹
          {overallDifference.toFixed(2)} less than your total budget** for this
          period. Keep up the good work!
        </p>
      );
    } else if (overallDifference < 0) {
      insights.push(
        <p
          key="overall-overspent"
          className="text-base font-semibold text-red-400 mb-3"
        >
          Overall, you've **spent ₹{(-overallDifference).toFixed(2)} more than
          your total budget** for this period. Consider reviewing your spending.
        </p>
      );
    } else {
      insights.push(
        <p
          key="overall-on-track"
          className="text-base font-semibold text-indigo-400 mb-3"
        >
          Overall, your spending is perfectly **on track with your total
          budget** for this period. Excellent!
        </p>
      );
    }
  }

  // --- Detailed Category Insights ---

  if (overspentCategories.length > 0) {
    insights.push(
      <div
        key="overspent-details"
        className="text-red-400 border-t pt-4 mt-4 border-slate-700"
      >
        <p className="font-semibold text-base mt-1 mb-2">
          Areas where you overspent:
        </p>
        <ul className="list-disc list-inside ml-4 space-y-1 text-slate-300 text-base">
          {overspentCategories.map((item) => (
            <li key={item.category}>
              <span className="font-medium">{item.category}</span>: You spent{" "}
              <span className="font-semibold">
                ₹{item.difference.toFixed(2)}
              </span>{" "}
              over budget. Consider where these extra costs came from.
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (underspentCategories.length > 0) {
    insights.push(
      <div
        key="underspent-details"
        className="text-emerald-400 border-t pt-4 mt-4 border-slate-700"
      >
        <p className="font-semibold text-base mt-1 mb-2">
          Categories where you saved:
        </p>
        <ul className="list-disc list-inside ml-4 space-y-1 text-slate-300 text-base">
          {underspentCategories.map((item) => (
            <li key={item.category}>
              <span className="font-medium">{item.category}</span>: You spent{" "}
              <span className="font-semibold">
                ₹{item.difference.toFixed(2)}
              </span>{" "}
              under budget. Great saving in this area!
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (unbudgetedSpending.length > 0) {
    insights.push(
      <div
        key="unbudgeted-details"
        className="text-purple-400 border-t pt-4 mt-4 border-slate-700" // Changed to purple-400 for consistency
      >
        <p className="font-semibold text-base mt-1 mb-2">
          Spending in unbudgeted categories:
        </p>
        <ul className="list-disc list-inside ml-4 space-y-1 text-slate-300 text-base">
          {unbudgetedSpending.map((item) => (
            <li key={item.category}>
              <span className="font-medium">{item.category}</span>: You spent{" "}
              <span className="font-semibold">₹{item.amount.toFixed(2)}</span>{" "}
              but didn't set a budget for it. Perhaps consider budgeting for
              this next time?
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (
    insights.length === 0 &&
    (totalBudgetedOverall > 0 || totalActualOverall > 0)
  ) {
    // This case handles when there's data but no significant over/under spending, and no unbudgeted.
    // The "overall-on-track" handles the perfect match. This might be for cases where actual=budget for all,
    // or very minor differences not captured by the exact conditions.
    insights.push(
      <p key="no-significant-activity" className="text-slate-400 text-base">
        Your spending is well-managed and aligned with your budget for this
        period. No major overspending or underspending trends detected.
      </p>
    );
  } else if (insights.length === 0) {
    // This handles the initial empty state if `budgetComparisonData` was not empty but contained no actionable items
    // (e.g., all 0s for budgeted and actual, which the initial check handles too).
    // This fallback ensures a message is always shown.
    insights.push(
      <p key="no-activity-fallback" className="text-slate-400 text-base">
        No significant budget activity to report. Either all spending is within
        budget, or there are no transactions/budgets for this period.
      </p>
    );
  }

  return (
    <div className="font-sans">
      <h3 className="text-xl font-semibold text-white mb-4">
        Spending Insights
      </h3>
      <div className="space-y-3">
        {insights.map((insight, index) =>
          // `insights` array can contain both JSX elements (for detailed sections)
          // and plain string paragraphs (for overall summaries and fallback).
          // We need to render them correctly.
          React.isValidElement(insight) ? (
            insight
          ) : (
            <p key={index} className="text-slate-300 text-base">
              {insight}
            </p>
          )
        )}
      </div>
    </div>
  );
};

export default SpendingInsights;
