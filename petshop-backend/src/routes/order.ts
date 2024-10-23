// src/routes/order.ts
import express from 'express';
import { 
    createOrder, 
    getAllOrders, 
    getOrderById, 
    getOrdersByCustomerId, 
    getOrdersByDateRange, 
    getCustomerPurchaseHistory 
} from '../controllers/orderController';
import { asyncHandler } from '../utils/asyncHandler';
import { authorize } from '../middleware/authorization';

const router = express.Router();

// Rota para histórico de compras de um cliente
router.get('/customer/:customerId/history', authorize(['admin', 'user']), asyncHandler(getCustomerPurchaseHistory));
router.get('/date-range', authorize(['admin', 'user']), asyncHandler(getOrdersByDateRange));
router.get('/', authorize(['admin']), asyncHandler(getAllOrders));
router.get('/customer/:customerId', authorize(['admin', 'user']), asyncHandler(getOrdersByCustomerId));
router.get('/:id', authorize(['admin', 'user']), asyncHandler(getOrderById));
router.post('/', authorize(['admin', 'user']), asyncHandler(createOrder));

export default router;