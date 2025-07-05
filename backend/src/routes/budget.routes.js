// backend/src/routes/budget.routes.js
import express from 'express';
import {
  getBudgets,
  setBudget,
  deleteBudget,
  getBudgetComparison
} from '../controllers/budget.controller.js';

const router = express.Router();

router.route('/:userId')
  .get(getBudgets); // Get all budgets for a user (or filtered by month/year)

router.route('/')
  .post(setBudget); // Set or update a budget

router.route('/:id')
  .delete(deleteBudget); // Delete a budget entry

router.route('/:userId/comparison')
  .get(getBudgetComparison); // Get budget vs actual comparison data

export default router;