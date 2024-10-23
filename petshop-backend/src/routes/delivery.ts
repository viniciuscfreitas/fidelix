// src/routes/delivery.ts
import express from 'express';
import { scheduleDelivery, updateDeliveryLocation, updateDeliveryStatus, getDeliveryHistory } from '../controllers/deliveryController';
import { asyncHandler } from '../utils/asyncHandler';
import { authorize } from '../middleware/authorization';

const router = express.Router();

// Apenas 'user' e 'admin' podem agendar uma entrega
router.post('/schedule', authorize(['user', 'admin']), asyncHandler(scheduleDelivery));

// Apenas 'admin' pode atualizar o status da entrega
router.put('/status/:deliveryId', authorize(['admin']), asyncHandler(updateDeliveryStatus));

// Todos os usuários autenticados podem visualizar o histórico de localização
router.get('/history/:deliveryId', authorize(['user', 'admin']), asyncHandler(getDeliveryHistory));

// Atualização de localização pode ser feita por qualquer usuário autenticado
router.put('/location/:deliveryId', authorize(['user', 'admin']), asyncHandler(updateDeliveryLocation));

export default router;