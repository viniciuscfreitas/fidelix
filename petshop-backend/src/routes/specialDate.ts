// src/routes/specialDate.ts
import express from 'express';
import { addSpecialDate, getSpecialDates } from '../controllers/specialDateController';
import { authorize } from '../middleware/authorization';

const router = express.Router();

router.post('/', authorize(['admin']), addSpecialDate);
router.get('/', authorize(['admin', 'user']), getSpecialDates);

export default router;