// src/routes/customer.ts
import express, { Request, Response, NextFunction } from 'express';
import { createCustomer, updateCustomer, deleteCustomer, getAllCustomers, getCustomerById } from '../controllers/customerController';
import { check, validationResult } from 'express-validator';
import { asyncHandler } from '../utils/asyncHandler';
import { authorize } from '../middleware/authorization';

const router = express.Router();

/**
 * @swagger
 * /api/customers:
 *   post:
 *     summary: Cria um novo cliente
 *     tags: [Customer]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome do cliente
 *               email:
 *                 type: string
 *                 description: Email do cliente
 *     responses:
 *       201:
 *         description: Cliente criado com sucesso
 *       400:
 *         description: Erro de validação
 *       500:
 *         description: Erro ao criar o cliente
 */
router.post(
    '/',
    authorize(['admin']),
    [
        check('name').notEmpty().withMessage('O nome é obrigatório'),
        check('email').isEmail().withMessage('O email deve ser válido'),
    ],
    (req: Request, res: Response, next: NextFunction): void => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        next();
    },
    asyncHandler(createCustomer)
);

/**
 * @swagger
 * /api/customers/{customerId}:
 *   put:
 *     summary: Atualiza as informações de um cliente
 *     tags: [Customer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do cliente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome do cliente
 *               email:
 *                 type: string
 *                 description: Email do cliente
 *     responses:
 *       200:
 *         description: Cliente atualizado com sucesso
 *       400:
 *         description: Erro de validação
 *       404:
 *         description: Cliente não encontrado
 *       500:
 *         description: Erro ao atualizar o cliente
 */
router.put(
    '/:customerId',
    authorize(['admin']),
    [
        check('name').optional().notEmpty().withMessage('O nome não pode estar vazio'),
        check('email').optional().isEmail().withMessage('O email deve ser válido'),
    ],
    (req: Request, res: Response, next: NextFunction): void => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        next();
    },
    asyncHandler(updateCustomer)
);

/**
 * @swagger
 * /api/customers/{customerId}:
 *   delete:
 *     summary: Exclui um cliente
 *     tags: [Customer]
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
 *         description: Cliente excluído com sucesso
 *       404:
 *         description: Cliente não encontrado
 *       500:
 *         description: Erro ao excluir o cliente
 */
router.delete('/:customerId', authorize(['admin']), asyncHandler(deleteCustomer));

/**
 * @swagger
 * /api/customers:
 *   get:
 *     summary: Lista todos os clientes
 *     tags: [Customer]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de todos os clientes
 *       500:
 *         description: Erro ao buscar clientes
 */
router.get('/', authorize(['admin', 'user']), asyncHandler(getAllCustomers));

/**
 * @swagger
 * /api/customers/{customerId}:
 *   get:
 *     summary: Retorna as informações de um cliente específico
 *     tags: [Customer]
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
 *         description: Informações do cliente
 *       404:
 *         description: Cliente não encontrado
 *       500:
 *         description: Erro ao buscar o cliente
 */
router.get('/:customerId', authorize(['admin', 'user']), asyncHandler(getCustomerById));

export default router;