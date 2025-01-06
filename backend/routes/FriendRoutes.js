import express from 'express';
import { registerUser, loginUser, getAllUsers, addFriend, getRecommendations } from '../controllers/UserController.js';
import authMiddleware from "../middleware/authMiddleware.js"
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/', getAllUsers);
router.post('/addFriend', addFriend);
router.get('/recommendations/:userId',getRecommendations);

router.get('/protected-route', authMiddleware, (req, res) => {
    res.json({ message: 'You have access!', userId: req.userId });
  });

export default router;
