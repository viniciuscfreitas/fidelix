// src/routes/testRoutes.ts
import express from 'express';
import { simulateAddPoints } from '../controllers/testController';
import { authorize } from '../middleware/authorization';

const router = express.Router();

router.post('/simulate-add-points', authorize(['admin']), simulateAddPoints);

export default router;