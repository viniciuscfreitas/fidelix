// src/routes/order.ts
import express, { Request, Response, NextFunction } from 'express';
import { 
    createOrder, 
    getAllOrders, 
    getOrderById, 
    getOrdersByCustomerId, 
    getOrdersByDateRange, 
    getCustomerPurchaseHistory 
} from '../controllers/orderController';
import { check, validationResult } from 'express-validator';
import { authorize } from '../middleware/authorization';
import { asyncHandler } from '../utils/asyncHandler';
import rateLimit from 'express-rate-limit';

const router = express.Router();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Muitas requisições, por favor tente novamente mais tarde.'
});

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Retorna todos os pedidos
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de todos os pedidos
 *       500:
 *         description: Erro ao obter pedidos
 */
router.get('/', authorize(['admin']), asyncHandler(getAllOrders));

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Retorna detalhes de um pedido específico
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do pedido
 *     responses:
 *       200:
 *         description: Detalhes do pedido
 *       404:
 *         description: Pedido não encontrado
 *       500:
 *         description: Erro ao obter o pedido
 */
router.get('/:id', authorize(['admin', 'user']), asyncHandler(getOrderById));

/**
 * @swagger
 * /api/orders/customer/{customerId}:
 *   get:
 *     summary: Retorna todos os pedidos de um cliente específico
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do cliente
 *     responses:
 *       200:
 *         description: Lista de pedidos do cliente
 *       404:
 *         description: Cliente não encontrado
 *       500:
 *         description: Erro ao obter pedidos do cliente
 */
router.get('/customer/:customerId', authorize(['admin', 'user']), asyncHandler(getOrdersByCustomerId));

/**
 * @swagger
 * /api/orders/date-range:
 *   get:
 *     summary: Retorna pedidos dentro de um intervalo de datas
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Data de início do intervalo
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Data de fim do intervalo
 *     responses:
 *       200:
 *         description: Lista de pedidos no intervalo especificado
 *       500:
 *         description: Erro ao obter pedidos
 */
router.get('/date-range', authorize(['admin', 'user']), asyncHandler(getOrdersByDateRange));

/**
 * @swagger
 * /api/orders/customer/{customerId}/history:
 *   get:
 *     summary: Retorna o histórico de compras de um cliente
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do cliente
 *     responses:
 *       200:
 *         description: Histórico de compras do cliente
 *       404:
 *         description: Cliente não encontrado
 *       500:
 *         description: Erro ao obter histórico de compras
 */
router.get('/customer/:customerId/history', authorize(['admin', 'user']), asyncHandler(getCustomerPurchaseHistory));

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Cria um novo pedido
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customerId:
 *                 type: integer
 *                 description: ID do cliente
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: integer
 *                       description: ID do produto
 *                     quantity:
 *                       type: integer
 *                       description: Quantidade do produto
 *               totalPrice:
 *                 type: number
 *                 description: Preço total do pedido
 *               deliveryAddress:
 *                 type: string
 *                 description: Endereço de entrega
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 *       400:
 *         description: Erro de validação
 *       500:
 *         description: Erro ao criar pedido
 */
router.post(
    '/',
    authorize(['admin', 'user']),
    [
        check('customerId').isInt().withMessage('O ID do cliente deve ser um número inteiro'),
        check('products').isArray({ min: 1 }).withMessage('Deve haver pelo menos um produto no pedido'),
        check('products.*.productId').isInt().withMessage('O ID do produto deve ser um número inteiro'),
        check('products.*.quantity').isInt({ gt: 0 }).withMessage('A quantidade do produto deve ser um número positivo'),
        check('totalPrice').isFloat({ gt: 0 }).withMessage('O preço total deve ser um número positivo'),
        check('deliveryAddress').notEmpty().withMessage('O endereço de entrega é obrigatório'),
    ],
    (req: Request, res: Response, next: NextFunction): void => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        next();
    },
    asyncHandler(createOrder)
);

export default router;