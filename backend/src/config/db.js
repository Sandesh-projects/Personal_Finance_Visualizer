// backend/config/db.js
import mongoose from 'mongoose';
import dotenv from 'dotenv'; // To load environment variables from .env

dotenv.config(); // Load environment variables

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      console.error('MongoDB URI not found in .env file!');
      process.exit(1); // Exit process with failure
    }

    const conn = await mongoose.connect(mongoURI);

    console.log('MongoDB connected successfully!', conn.connection.host);
  } catch (err) {
    console.error(`MongoDB connection error: ${err.message}`);
    // Exit process with failure if connection fails
    process.exit(1);
  }
};

export default connectDB;