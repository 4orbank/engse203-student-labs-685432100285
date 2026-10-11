import { Router } from 'express';
import { findUsers } from '../services/requestService.js';

const router = Router();

// Challenge: GET /api/users
router.get('/', (req, res) => {
  const users = findUsers();
  res.status(200).json(users);
});

export default router;