// src/routes/customer.ts
import express from 'express';
import { createCustomer, updateCustomer, deleteCustomer, getAllCustomers, getCustomerById } from '../controllers/customerController';
import { asyncHandler } from '../utils/asyncHandler';
import { authorize } from '../middleware/authorization';

const router = express.Router();

// Rotas de CRUD para clientes
router.post('/', authorize(['admin']), asyncHandler(createCustomer));
router.put('/:customerId', authorize(['admin']), asyncHandler(updateCustomer));
router.delete('/:customerId', authorize(['admin']), asyncHandler(deleteCustomer));
router.get('/', authorize(['admin', 'user']), asyncHandler(getAllCustomers));
router.get('/:customerId', authorize(['admin', 'user']), asyncHandler(getCustomerById));

export default router;