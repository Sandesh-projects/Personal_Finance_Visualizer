// frontend/src/components/DashboardSummary.jsx

const DashboardSummary = ({
  totalExpenses,
  totalIncome,
  mostRecentTransactions,
}) => {
  const transactionsToShow = mostRecentTransactions.slice(0, 5); // Limit to 5 most recent transactions

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 font-sans">
      {/* Total Expenses Card */}
      <div className="bg-slate-800/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-slate-700/50 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Total Expenses
          </h3>
          <p className="text-4xl font-bold text-red-400">
            ₹{totalExpenses.toFixed(2)}
          </p>
        </div>
        <p className="text-base text-slate-400 mt-2">Sum of all expenses.</p>
      </div>
      {/* Total Income Card */}
      <div className="bg-slate-800/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-slate-700/50 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Total Income
          </h3>
          <p className="text-4xl font-bold text-emerald-400">
            ₹{totalIncome.toFixed(2)}
          </p>
        </div>
        <p className="text-base text-slate-400 mt-2">Sum of all income.</p>
      </div>
      <div className="bg-slate-800/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-slate-700/50 flex flex-col">
        {/* Card Title */}
        <h3 className="text-xl font-semibold text-white mb-4">
          Recent Transactions
        </h3>
        {transactionsToShow && transactionsToShow.length > 0 ? (
          // If transactions exist, render a list of them
          <ul className="space-y-4 flex-grow">
            {/* Map over the transactions array to render each one */}
            {transactionsToShow.map((transaction) => (
              <li
                key={transaction._id} // Unique key for each list item, essential for React lists
                className="flex justify-between items-start text-base text-slate-300"
              >
                {/* Transaction Date and Description */}
                <span className="flex-1 overflow-hidden break-words pr-2">
                  {/* Format the date to a user-friendly string */}
                  {new Date(transaction.date).toLocaleDateString("en-IN")}:{" "}
                  {/* Display the transaction description */}
                  {transaction.description}
                </span>

                {/* Transaction Amount, with conditional styling for Income/Expense */}
                <span
                  className={`font-semibold shrink-0 ${
                    transaction.category === "Income"
                      ? "text-emerald-400" // Green for income
                      : "text-red-400" // Red for expenses
                  }`}
                >
                  {/* Display the amount with Indian Rupee symbol, formatted to 2 decimal places */}
                  ₹{transaction.amount.toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          // If no transactions exist, display a message
          <p className="text-base text-slate-400 flex-grow flex items-center justify-center">
            No recent transactions to display.
          </p>
        )}
      </div>
    </div>
  );
};

export default DashboardSummary;
