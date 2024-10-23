// src/routes/loyalty.ts
import express from 'express';
import { addPoints, redeemPoints, getCustomerLoyaltyPoints, getAllLoyaltyPoints } from '../controllers/loyaltyController';
import { asyncHandler } from '../utils/asyncHandler';
import { authorize } from '../middleware/authorization';

const router = express.Router();

// Rota para adicionar pontos de fidelidade
router.post('/add', authorize(['admin']), asyncHandler((req, res) => addPoints(req, res, false)));

// Rota para resgatar pontos de fidelidade
router.post('/redeem', authorize(['admin', 'user']), asyncHandler(redeemPoints));

// Rota para listar pontos de fidelidade de um cliente
router.get('/:customerId', authorize(['admin', 'user']), asyncHandler(getCustomerLoyaltyPoints));

// Rota para listar todos os pontos de fidelidade
router.get('/', authorize(['admin']), asyncHandler(getAllLoyaltyPoints));

export default router;