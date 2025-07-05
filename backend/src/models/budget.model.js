// backend/src/models/budget.model.js
import mongoose from 'mongoose';
import { categoryValues } from '../services/category.service.js'; // Import category values

const budgetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  category: {
    type: String,
    required: [true, 'Category is required.'],
    enum: categoryValues, // Must be one of the predefined categories
  },
  month: { // 1-12
    type: Number,
    required: [true, 'Month is required.'],
    min: 1,
    max: 12,
  },
  year: {
    type: Number,
    required: [true, 'Year is required.'],
    min: 2000, // Reasonable starting year
  },
  budgetedAmount: {
    type: Number,
    required: [true, 'Budgeted amount is required.'],
    min: [0, 'Budgeted amount cannot be negative.'],
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true }); // Add timestamps for automatic createdAt/updatedAt

// Ensure uniqueness: a user can only have one budget per category per month/year
budgetSchema.index({ userId: 1, category: 1, month: 1, year: 1 }, { unique: true });

const Budget = mongoose.model('Budget', budgetSchema);

export default Budget;