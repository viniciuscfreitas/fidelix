// src/routes/loyalty.ts
import express, { Request, Response, NextFunction } from 'express';
import { addPoints, redeemPoints, getCustomerLoyaltyPoints, getAllLoyaltyPoints } from '../controllers/loyaltyController';
import { check, validationResult } from 'express-validator';
import { asyncHandler } from '../utils/asyncHandler';
import rateLimit from 'express-rate-limit';
import { authorize } from '../middleware/authorization';

const router = express.Router();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Muitas requisições, por favor tente novamente mais tarde.'
});

/**
 * @swagger
 * /api/loyalty/add:
 *   post:
 *     summary: Adiciona pontos de fidelidade a um cliente
 *     tags: [Loyalty]
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
 *               points:
 *                 type: integer
 *                 description: Quantidade de pontos a adicionar
 *     responses:
 *       200:
 *         description: Pontos adicionados com sucesso
 *       400:
 *         description: Erro de validação
 *       500:
 *         description: Erro ao adicionar pontos
 */
router.post(
    '/add',
    authorize(['admin']),
    [
        check('customerId').isInt().withMessage('O ID do cliente deve ser um número inteiro'),
        check('points').isInt({ min: 1 }).withMessage('Os pontos devem ser um número inteiro positivo'),
    ],
    (req: Request, res: Response, next: NextFunction): void => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        next();
    },
    asyncHandler((req, res) => addPoints(req, res, false))
);

/**
 * @swagger
 * /api/loyalty/redeem:
 *   post:
 *     summary: Resgata pontos de fidelidade de um cliente
 *     tags: [Loyalty]
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
 *               points:
 *                 type: integer
 *                 description: Quantidade de pontos a resgatar
 *     responses:
 *       200:
 *         description: Pontos resgatados com sucesso
 *       400:
 *         description: Erro de validação
 *       500:
 *         description: Erro ao resgatar pontos
 */
router.post(
    '/redeem',
    authorize(['admin', 'user']),
    [
        check('customerId').isInt().withMessage('O ID do cliente deve ser um número inteiro'),
        check('points').isInt({ min: 1 }).withMessage('Os pontos devem ser um número inteiro positivo'),
    ],
    (req: Request, res: Response, next: NextFunction): void => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        next();
    },
    asyncHandler(redeemPoints)
);

/**
 * @swagger
 * /api/loyalty/{customerId}:
 *   get:
 *     summary: Retorna os pontos de fidelidade de um cliente
 *     tags: [Loyalty]
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
 *         description: Detalhes dos pontos de fidelidade do cliente
 *       404:
 *         description: Cliente não encontrado
 *       500:
 *         description: Erro ao buscar os pontos
 */
router.get('/:customerId', authorize(['admin', 'user']), asyncHandler(getCustomerLoyaltyPoints));

/**
 * @swagger
 * /api/loyalty:
 *   get:
 *     summary: Lista todos os pontos de fidelidade
 *     tags: [Loyalty]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de todos os pontos de fidelidade
 *       500:
 *         description: Erro ao buscar os pontos
 */
router.get('/', authorize(['admin']), asyncHandler(getAllLoyaltyPoints));

export default router;