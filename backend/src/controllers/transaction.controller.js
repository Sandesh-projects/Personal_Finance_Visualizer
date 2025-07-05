// backend/src/controllers/transaction.controller.js
import Transaction from '../models/transaction.model.js';
import mongoose from 'mongoose';
import { categories } from '../services/category.service.js'; // Import categories for validation

// @desc    Get all transactions for a specific user
// @route   GET /api/transactions/:userId
// @access  Public (device-bound user)
export const getTransactions = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid User ID format.' });
        }

        const transactions = await Transaction.find({ userId }).sort({ date: -1, createdAt: -1 });
        res.status(200).json(transactions);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ message: 'Server error while fetching transactions.' });
    }
};

// @desc    Add a new transaction
// @route   POST /api/transactions
// @access  Public (device-bound user)
export const addTransaction = async (req, res) => {
    try {
        const { userId, amount, date, description, category } = req.body; // Added category

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid User ID format.' });
        }
        if (!amount || !date || !description || !category) { // Updated validation
            return res.status(400).json({ message: 'Please enter all fields: amount, date, description, and category.' });
        }
        if (isNaN(amount) || amount <= 0) {
            return res.status(400).json({ message: 'Amount must be a positive number.' });
        }
        if (!categories.map(cat => cat.value).includes(category)) { // Validate category against predefined list
            return res.status(400).json({ message: 'Invalid category selected.' });
        }

        const newTransaction = new Transaction({
            userId,
            amount,
            date,
            description,
            category, // Added category
        });

        const savedTransaction = await newTransaction.save();
        res.status(201).json(savedTransaction);
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        console.error('Error adding transaction:', error);
        res.status(500).json({ message: 'Server error while adding transaction.' });
    }
};

// @desc    Update a transaction
// @route   PUT /api/transactions/:id
// @access  Public (device-bound user)
export const updateTransaction = async (req, res) => {
    try {
        const { id } = req.params; // Transaction ID
        const { userId, amount, date, description, category } = req.body; // Added category

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid Transaction ID format.' });
        }
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid User ID format.' });
        }
        if (!amount || !date || !description || !category) { // Updated validation
            return res.status(400).json({ message: 'Please enter all fields: amount, date, description, and category.' });
        }
        if (isNaN(amount) || amount <= 0) {
            return res.status(400).json({ message: 'Amount must be a positive number.' });
        }
        if (!categories.map(cat => cat.value).includes(category)) { // Validate category
            return res.status(400).json({ message: 'Invalid category selected.' });
        }

        const transaction = await Transaction.findOne({ _id: id, userId });

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found or does not belong to this user.' });
        }

        transaction.amount = amount;
        transaction.date = date;
        transaction.description = description;
        transaction.category = category; // Added category update

        const updatedTransaction = await transaction.save();
        res.status(200).json(updatedTransaction);
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        console.error('Error updating transaction:', error);
        res.status(500).json({ message: 'Server error while updating transaction.' });
    }
};

// @desc    Delete a transaction
// @route   DELETE /api/transactions/:id
// @access  Public (device-bound user)
export const deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params; // Transaction ID
        const { userId } = req.query; // Expect userId as a query parameter for verification

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid Transaction ID format.' });
        }
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid User ID format.' });
        }

        const result = await Transaction.deleteOne({ _id: id, userId });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Transaction not found or does not belong to this user.' });
        }

        res.status(200).json({ message: 'Transaction deleted successfully.' });
    } catch (error) {
        console.error('Error deleting transaction:', error);
        res.status(500).json({ message: 'Server error while deleting transaction.' });
    }
};

// --- NEW/UPDATED AGGREGATION FUNCTION ---
// @desc    Get aggregated expenses for a specific user by day, month, or year
// @route   GET /api/transactions/:userId/aggregated-expenses?granularity=(day|month|year)
// @access  Public (device-bound user)
export const getAggregatedExpenses = async (req, res) => {
    try {
        const { userId } = req.params;
        const { granularity } = req.query; // 'day', 'month', 'year'

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid User ID format.' });
        }

        let groupStageId;
        let projectStageFields;
        let sortStageFields;

        switch (granularity) {
            case 'day':
                groupStageId = {
                    year: { $year: '$date' },
                    month: { $month: '$date' },
                    day: { $dayOfMonth: '$date' },
                };
                projectStageFields = {
                    _id: 0,
                    year: '$_id.year',
                    month: '$_id.month',
                    day: '$_id.day',
                    totalAmount: 1,
                };
                sortStageFields = {
                    '_id.year': 1,
                    '_id.month': 1,
                    '_id.day': 1,
                };
                break;
            case 'month':
                groupStageId = {
                    year: { $year: '$date' },
                    month: { $month: '$date' },
                };
                projectStageFields = {
                    _id: 0,
                    year: '$_id.year',
                    month: '$_id.month',
                    totalAmount: 1,
                };
                sortStageFields = {
                    '_id.year': 1,
                    '_id.month': 1,
                };
                break;
            case 'year':
                groupStageId = {
                    year: { $year: '$date' },
                };
                projectStageFields = {
                    _id: 0,
                    year: '$_id.year',
                    totalAmount: 1,
                };
                sortStageFields = {
                    '_id.year': 1,
                };
                break;
            default:
                return res.status(400).json({ message: 'Invalid granularity specified. Must be "day", "month", or "year".' });
        }

        const aggregatedExpenses = await Transaction.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId),
                    category: { $ne: 'Income' } // Exclude income from expense charts
                },
            },
            {
                $group: {
                    _id: groupStageId,
                    totalAmount: { $sum: '$amount' },
                },
            },
            {
                $sort: sortStageFields,
            },
            {
                $project: projectStageFields,
            },
        ]);

        res.status(200).json(aggregatedExpenses);
    } catch (error) {
        console.error('Error fetching aggregated expenses:', error);
        res.status(500).json({ message: 'Server error while fetching aggregated expenses.' });
    }
};

// @desc    Get category-wise breakdown for a specific user
// @route   GET /api/transactions/:userId/category-breakdown
// @access  Public (device-bound user)
export const getCategoryBreakdown = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid User ID format.' });
        }

        const categoryBreakdown = await Transaction.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId),
                    // Exclude income from expense breakdown for a cleaner pie chart
                    category: { $ne: 'Income' }
                }
            },
            {
                $group: {
                    _id: "$category",
                    totalAmount: { $sum: "$amount" },
                },
            },
            {
                $project: {
                    _id: 0, // Exclude the default _id field
                    category: "$_id",
                    totalAmount: "$totalAmount",
                },
            },
            {
                $sort: { totalAmount: -1 } // Sort by amount descending
            }
        ]);

        res.status(200).json(categoryBreakdown);
    } catch (error) {
        console.error('Error fetching category breakdown:', error);
        res.status(500).json({ message: 'Server error while fetching category breakdown.' });
    }
};


// New: @desc    Get a single transaction by ID for a specific user
// @route   GET /api/transactions/detail/:id
// @access  Public (device-bound user)
export const getOneTransaction = async (req, res) => {
    try {
        const { id } = req.params; // Transaction ID from URL path
        const { userId } = req.query; // User ID from query parameter for verification

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid Transaction ID format.' });
        }
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid User ID format.' });
        }

        // Find the transaction, ensuring it belongs to the correct user
        const transaction = await Transaction.findOne({ _id: id, userId });

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found or does not belong to this user.' });
        }

        res.status(200).json(transaction);
    } catch (error) {
        console.error('Error fetching single transaction:', error);
        res.status(500).json({ message: 'Server error while fetching transaction details.' });
    }
};