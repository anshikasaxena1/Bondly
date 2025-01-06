import express from 'express';
import { registerUser, loginUser, getAllUsers, addFriend } from '../controllers/UserController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/', getAllUsers);
router.post('/addFriend', addFriend);

export default router;
