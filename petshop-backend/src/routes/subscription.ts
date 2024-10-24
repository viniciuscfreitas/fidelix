// src/routes/subscription.ts
import express from 'express';
import { createSubscription, getAllSubscriptions, cancelSubscription, renewSubscription, renewSubscriptionWithDiscount } from '../controllers/subscriptionController';
import { asyncHandler } from '../utils/asyncHandler';
import { check } from 'express-validator';
import { validate } from '../middleware/validate';
import rateLimit from 'express-rate-limit';

const router = express.Router();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Muitas requisições, por favor tente novamente mais tarde.'
});

/**
 * @swagger
 * /api/subscriptions:
 *   post:
 *     summary: Cria uma nova assinatura
 *     tags: [Subscription]
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
 *               plan:
 *                 type: string
 *                 description: Tipo de plano de assinatura
 *     responses:
 *       201:
 *         description: Assinatura criada com sucesso
 *       400:
 *         description: Erro de validação
 *       500:
 *         description: Erro ao criar assinatura
 */
router.post(
    '/',
    validate([
        check('customerId').isInt().withMessage('O ID do cliente deve ser um número inteiro.'),
        check('plan').notEmpty().withMessage('O plano é obrigatório.')
    ]),
    asyncHandler(createSubscription)
);

/**
 * @swagger
 * /api/subscriptions:
 *   get:
 *     summary: Retorna todas as assinaturas
 *     tags: [Subscription]
 *     responses:
 *       200:
 *         description: Lista de todas as assinaturas
 *       500:
 *         description: Erro ao obter assinaturas
 */
router.get('/', asyncHandler(getAllSubscriptions));

/**
 * @swagger
 * /api/subscriptions/cancel/{id}:
 *   put:
 *     summary: Cancela uma assinatura
 *     tags: [Subscription]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da assinatura
 *     responses:
 *       200:
 *         description: Assinatura cancelada com sucesso
 *       404:
 *         description: Assinatura não encontrada
 *       500:
 *         description: Erro ao cancelar assinatura
 */
router.put('/cancel/:id', asyncHandler(cancelSubscription));

/**
 * @swagger
 * /api/subscriptions/renew/{id}:
 *   put:
 *     summary: Renova uma assinatura
 *     tags: [Subscription]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da assinatura
 *     responses:
 *       200:
 *         description: Assinatura renovada com sucesso
 *       404:
 *         description: Assinatura não encontrada
 *       500:
 *         description: Erro ao renovar assinatura
 */
router.put('/renew/:id', asyncHandler(renewSubscription));

/**
 * @swagger
 * /api/subscriptions/renew-with-discount/{id}:
 *   put:
 *     summary: Renova uma assinatura com desconto
 *     tags: [Subscription]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da assinatura
 *     responses:
 *       200:
 *         description: Assinatura renovada com desconto
 *       404:
 *         description: Assinatura não encontrada
 *       500:
 *         description: Erro ao renovar assinatura com desconto
 */
router.put('/renew-with-discount/:id', asyncHandler(renewSubscriptionWithDiscount));

export default router;