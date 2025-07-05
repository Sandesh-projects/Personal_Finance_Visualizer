// backend/src/routes/user.routes.js
import express from 'express';
import { findOrCreateUser } from '../controllers/user.controller.js';

const router = express.Router();

// POST route to find or create a user based on deviceId
router.post('/', findOrCreateUser);

export default router;