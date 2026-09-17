import express from 'express';
import { getUsers, createUser, deleteUser } from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/', getUsers);
router.post('/', createUser);
router.delete('/:id', deleteUser);

export default router;
