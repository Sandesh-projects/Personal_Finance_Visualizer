// backend/server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './src/config/db.js';
import userRoutes from './src/routes/user.routes.js';
import transactionRoutes from './src/routes/transaction.routes.js';
import budgetRoutes from './src/routes/budget.routes.js'; // New: Import budget routes

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json()); // For parsing application/json

// Routes
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes); // New: Use budget routes

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});