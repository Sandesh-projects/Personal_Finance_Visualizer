// backend/src/routes/transaction.routes.js
import express from 'express';
import {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  // getMonthlyExpenses, // REMOVE or COMMENT OUT this import, as it will be replaced
  getAggregatedExpenses, // NEW: Import the new aggregated expenses function
  getCategoryBreakdown,
  getOneTransaction
} from '../controllers/transaction.controller.js';

const router = express.Router();

router.route('/:userId')
  .get(getTransactions); // Get all transactions for a specific user

router.route('/')
  .post(addTransaction); // Add a new transaction

router.route('/:id')
  .put(updateTransaction) // Update a transaction by ID
  .delete(deleteTransaction); // Delete a transaction by ID

// Route for fetching single transaction details
router.route('/detail/:id') // Using 'detail' prefix to avoid conflict with /:userId route
  .get(getOneTransaction);

// Updated: Route for fetching aggregated expense data for charts
// This route will now handle day, month, or year granularity based on a query parameter.
// It replaces the previous specific /monthly-expenses route.
router.route('/:userId/aggregated-expenses') // Changed from /monthly-expenses
  .get(getAggregatedExpenses); // Using the new, flexible controller function

router.route('/:userId/category-breakdown')
  .get(getCategoryBreakdown);

export default router;