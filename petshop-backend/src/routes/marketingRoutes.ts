// src/routes/marketingRoutes.ts
import express, { Request, Response, NextFunction } from 'express';
import { registerCampaignForSegment, getAllCampaigns, getCampaignsByCustomer, segmentCustomers } from '../controllers/marketingController';
import { check, validationResult } from 'express-validator';
import { authorize } from '../middleware/authorization';
import rateLimit from 'express-rate-limit';
import { asyncHandler } from '../utils/asyncHandler';

const router = express.Router();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Muitas requisições, por favor tente novamente mais tarde.'
});

/**
 * @swagger
 * /api/marketing/segment-customers:
 *   get:
 *     summary: Segmenta clientes com base em critérios específicos
 *     tags: [Marketing]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: minTotalSpent
 *         schema:
 *           type: number
 *         description: Gasto mínimo do cliente
 *       - in: query
 *         name: minPurchaseCount
 *         schema:
 *           type: integer
 *         description: Número mínimo de compras
 *       - in: query
 *         name: periodInMonths
 *         schema:
 *           type: integer
 *         description: Período em meses para considerar os dados
 *       - in: query
 *         name: minPoints
 *         schema:
 *           type: integer
 *         description: Pontuação mínima do cliente
 *     responses:
 *       200:
 *         description: Lista de clientes segmentados
 *       500:
 *         description: Erro ao segmentar clientes
 */
router.get('/segment-customers', authorize(['admin']), asyncHandler(segmentCustomers));

/**
 * @swagger
 * /api/marketing/register-campaign:
 *   post:
 *     summary: Registra uma campanha de marketing para um grupo de clientes
 *     tags: [Marketing]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               campaignName:
 *                 type: string
 *                 description: Nome da campanha
 *               customerIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: Lista de IDs dos clientes
 *     responses:
 *       200:
 *         description: Campanha registrada com sucesso
 *       400:
 *         description: Erro de validação
 *       500:
 *         description: Erro ao registrar campanha
 */
router.post(
    '/register-campaign',
    authorize(['admin']),
    [
        check('campaignName').notEmpty().withMessage('O nome da campanha é obrigatório'),
        check('customerIds').isArray({ min: 1 }).withMessage('Deve haver pelo menos um cliente na lista'),
        check('customerIds.*').isInt().withMessage('Todos os IDs de clientes devem ser números inteiros'),
    ],
    (req: Request, res: Response, next: NextFunction): void => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        next();
    },
    asyncHandler(registerCampaignForSegment)
);

/**
 * @swagger
 * /api/marketing/campaigns:
 *   get:
 *     summary: Retorna todas as campanhas registradas
 *     tags: [Marketing]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de campanhas registradas
 *       500:
 *         description: Erro ao buscar campanhas
 */
router.get('/campaigns', authorize(['admin']), asyncHandler(getAllCampaigns));

/**
 * @swagger
 * /api/marketing/campaigns/customer/{customerId}:
 *   get:
 *     summary: Retorna as campanhas registradas para um cliente específico
 *     tags: [Marketing]
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
 *         description: Lista de campanhas do cliente
 *       404:
 *         description: Cliente não encontrado ou sem campanhas
 *       500:
 *         description: Erro ao buscar campanhas do cliente
 */
router.get('/campaigns/customer/:customerId', authorize(['admin']), asyncHandler(getCampaignsByCustomer));

export default router;