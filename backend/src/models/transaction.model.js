// backend/src/models/transaction.model.js
import mongoose from 'mongoose';
import { categories } from '../services/category.service.js'; // Import categories

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required.'],
    min: [0, 'Amount must be positive.'],
  },
  date: {
    type: Date,
    required: [true, 'Date is required.'],
  },
  description: {
    type: String,
    trim: true,
    required: [true, 'Description is required.'],
    minlength: [3, 'Description must be at least 3 characters long.'],
    maxlength: [200, 'Description cannot exceed 200 characters.'],
  },
  category: { // New: Category field
    type: String,
    required: [true, 'Category is required.'],
    enum: categories.map(cat => cat.value), // Ensure category is one of the predefined values
    default: 'Other', // A sensible default if none provided (though it's required)
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;