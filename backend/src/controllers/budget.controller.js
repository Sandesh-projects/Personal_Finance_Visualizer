// backend/src/controllers/budget.controller.js
import Budget from '../models/budget.model.js';
import Transaction from '../models/transaction.model.js'; // To fetch actual spending
import { categoryValues } from '../services/category.service.js';
import mongoose from 'mongoose';

// @desc    Get all budgets for a specific user, optionally for a given month/year
// @route   GET /api/budgets/:userId
// @access  Public (device-bound user)
export const getBudgets = async (req, res) => {
  try {
    const { userId } = req.params;
    const { month, year } = req.query; // Optional filters

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid User ID format.' });
    }

    let query = { userId };
    if (month) {
      query.month = parseInt(month);
    }
    if (year) {
      query.year = parseInt(year);
    }

    const budgets = await Budget.find(query).sort({ year: 1, month: 1, category: 1 });
    res.status(200).json(budgets);
  } catch (error) {
    console.error('Error fetching budgets:', error);
    res.status(500).json({ message: 'Server error while fetching budgets.' });
  }
};

// @desc    Set or update a budget for a specific category, month, and year
// @route   POST /api/budgets
// @access  Public (device-bound user)
export const setBudget = async (req, res) => {
  try {
    const { userId, category, month, year, budgetedAmount } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid User ID format.' });
    }
    if (!category || !month || !year || budgetedAmount === undefined || budgetedAmount === null) {
      return res.status(400).json({ message: 'Please provide userId, category, month, year, and budgetedAmount.' });
    }
    if (!categoryValues.includes(category)) {
      return res.status(400).json({ message: 'Invalid category provided.' });
    }
    if (month < 1 || month > 12) {
      return res.status(400).json({ message: 'Month must be between 1 and 12.' });
    }
    if (year < 2000) { // arbitrary sensible minimum year
      return res.status(400).json({ message: 'Year is invalid.' });
    }
    if (budgetedAmount < 0) {
      return res.status(400).json({ message: 'Budgeted amount cannot be negative.' });
    }

    // Find and update if exists, otherwise create new
    const budget = await Budget.findOneAndUpdate(
      { userId, category, month, year },
      { budgetedAmount, updatedAt: Date.now() },
      { new: true, upsert: true, runValidators: true } // upsert: create if not found
    );

    res.status(200).json(budget);
  } catch (error) {
    if (error.code === 11000) { // Duplicate key error (though unique index should be handled by findOneAndUpdate with upsert)
        return res.status(409).json({ message: 'A budget for this category, month, and year already exists for this user.' });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    console.error('Error setting budget:', error);
    res.status(500).json({ message: 'Server error while setting budget.' });
  }
};

// @desc    Delete a budget entry
// @route   DELETE /api/budgets/:id
// @access  Public (device-bound user)
export const deleteBudget = async (req, res) => {
    try {
        const { id } = req.params; // Budget ID
        const { userId } = req.query; // userId for verification

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid Budget ID format.' });
        }
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid User ID format.' });
        }

        const result = await Budget.deleteOne({ _id: id, userId });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Budget not found or does not belong to this user.' });
        }

        res.status(200).json({ message: 'Budget deleted successfully.' });
    } catch (error) {
        console.error('Error deleting budget:', error);
        res.status(500).json({ message: 'Server error while deleting budget.' });
    }
};


// @desc    Get budget vs actual spending comparison for a specific user and month/year
// @route   GET /api/budgets/:userId/comparison
// @access  Public (device-bound user)
export const getBudgetComparison = async (req, res) => {
  try {
    const { userId } = req.params;
    const { month, year } = req.query;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid User ID format.' });
    }
    if (!month || !year) {
      return res.status(400).json({ message: 'Month and year are required for budget comparison.' });
    }

    const currentMonth = parseInt(month);
    const currentYear = parseInt(year);

    if (currentMonth < 1 || currentMonth > 12 || currentYear < 2000) {
      return res.status(400).json({ message: 'Invalid month or year provided.' });
    }

    // 1. Fetch budgets for the specified month and year
    const budgets = await Budget.find({ userId, month: currentMonth, year: currentYear });

    // 2. Calculate actual spending for the same month and year, by category (excluding income)
    const actualSpending = await Transaction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          date: {
            $gte: new Date(currentYear, currentMonth - 1, 1), // Start of the month
            $lt: new Date(currentYear, currentMonth, 1),     // Start of next month
          },
          category: { $ne: 'Income' } // Exclude income from spending
        },
      },
      {
        $group: {
          _id: "$category",
          totalSpent: { $sum: "$amount" },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          totalSpent: "$totalSpent",
        },
      },
    ]);

    // 3. Combine budget and actual data
    const comparisonData = [];
    const allRelevantCategories = new Set([
        ...budgets.map(b => b.category),
        ...actualSpending.map(s => s.category)
    ].filter(cat => cat !== 'Income')); // Ensure income is never in expense comparison

    // Populate with budgeted values first
    allRelevantCategories.forEach(cat => {
        const budgetEntry = budgets.find(b => b.category === cat);
        comparisonData.push({
            category: cat,
            budgeted: budgetEntry ? budgetEntry.budgetedAmount : 0,
            actual: 0 // Initialize actual to 0, will update from actualSpending
        });
    });

    // Update with actual spending
    actualSpending.forEach(spentItem => {
        let entry = comparisonData.find(d => d.category === spentItem.category);
        if (entry) {
            entry.actual = spentItem.totalSpent;
        } else {
            // This case handles categories with spending but no budget set
            // It should already be handled by allRelevantCategories, but good for robustness
            comparisonData.push({
                category: spentItem.category,
                budgeted: 0,
                actual: spentItem.totalSpent
            });
        }
    });

    res.status(200).json(comparisonData);

  } catch (error) {
    console.error('Error fetching budget comparison:', error);
    res.status(500).json({ message: 'Server error while fetching budget comparison.' });
  }
};