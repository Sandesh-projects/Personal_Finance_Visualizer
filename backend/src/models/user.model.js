// backend/src/models/user.model.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true,
    unique: true, // Ensure each deviceId maps to a unique user
  },
  // You can add other device-specific preferences or settings here later
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model('User', userSchema);

export default User;