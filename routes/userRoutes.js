import express from 'express';
import User from '../models/User.js';
import authenticate from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/profile', authenticate, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({ email: user.email });
});

router.put('/update', authenticate, async (req, res) => {
  const { email } = req.body;
  await User.findByIdAndUpdate(req.user.id, { email });
  res.json({ message: 'Profile updated' });
});

export default router;