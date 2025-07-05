// backend/src/controllers/user.controller.js
import User from '../models/user.model.js';

/**
 * Finds a user by deviceId. If not found, creates a new user.
 * @param {Object} req - Express request object. Expects req.body.deviceId
 * @param {Object} res - Express response object.
 */
export const findOrCreateUser = async (req, res) => {
  try {
    const { deviceId } = req.body;

    if (!deviceId) {
      return res.status(400).json({ message: 'Device ID is required.' });
    }

    let user = await User.findOne({ deviceId });

    if (!user) {
      // If user doesn't exist, create a new one
      user = new User({ deviceId });
      await user.save();
      console.log(`New user created with deviceId: ${deviceId}`);
    } else {
      console.log(`Existing user found with deviceId: ${deviceId}`);
    }

    // Return the user document (including its MongoDB _id)
    res.status(200).json({ userId: user._id, deviceId: user.deviceId });

  } catch (error) {
    console.error('Error finding or creating user:', error);
    res.status(500).json({ message: 'Server error while processing user.' });
  }
};