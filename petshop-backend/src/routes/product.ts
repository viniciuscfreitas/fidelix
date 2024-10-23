// src/routes/product.ts
import express from 'express';
import { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct } from '../controllers/productController';
import { asyncHandler } from '../utils/asyncHandler';
import { authorize } from '../middleware/authorization';

const router = express.Router();

// Rotas de CRUD para produtos
router.post('/', authorize(['admin']), asyncHandler(createProduct));
router.get('/', asyncHandler(getAllProducts));
router.get('/:id', asyncHandler(getProductById));
router.put('/:id', authorize(['admin']), asyncHandler(updateProduct));
router.delete('/:id', authorize(['admin']), asyncHandler(deleteProduct));

export default router;