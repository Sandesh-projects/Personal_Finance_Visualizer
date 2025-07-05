// backend/server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './src/config/db.js';
import userRoutes from './src/routes/user.routes.js';
import transactionRoutes from './src/routes/transaction.routes.js';
import budgetRoutes from './src/routes/budget.routes.js';
import fetch from 'node-fetch'; // Import node-fetch

dotenv.config();

connectDB();

const app = express();

app.use(cors({
  origin: '*', // Allows all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
}));

app.use(express.json()); // For parsing application/json

// Basic root route for health checks and pings
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Personal Finance Visualizer backend is running!' });
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);

const PORT = process.env.PORT || 3000;
const BACKEND_URL = process.env.BACKEND_URL || `http://localhost:${PORT}`; // Your deployed backend URL

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Backend URL for pings: ${BACKEND_URL}`);

  // Keep-alive ping every 14 minutes (14 * 60 * 1000 ms)
  setInterval(async () => {
    try {
      const response = await fetch(BACKEND_URL);
      if (response.ok) {
        console.log(`Ping successful to ${BACKEND_URL} at ${new Date().toLocaleString()}`);
      } else {
        console.warn(`Ping failed to ${BACKEND_URL} with status: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error during ping to ${BACKEND_URL}:`, error.message);
    }
  }, 14 * 60 * 1000); // 14 minutes
});