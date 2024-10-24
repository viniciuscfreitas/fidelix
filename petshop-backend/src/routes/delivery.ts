// src/routes/delivery.ts
import express, { Request, Response, NextFunction } from 'express';
import { scheduleDelivery, updateDeliveryLocation, updateDeliveryStatus, getDeliveryHistory } from '../controllers/deliveryController';
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
 * /api/delivery/schedule:
 *   post:
 *     summary: Agenda uma nova entrega
 *     tags: [Delivery]
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
 *               address:
 *                 type: string
 *                 description: Endereço de entrega
 *               deliveryDate:
 *                 type: string
 *                 format: date
 *                 description: Data da entrega
 *               items:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Lista de itens para entrega
 *     responses:
 *       201:
 *         description: Entrega agendada com sucesso
 *       400:
 *         description: Erro de validação
 *       500:
 *         description: Erro ao agendar a entrega
 */
router.post(
    '/schedule',
    authorize(['user', 'admin']),
    [
        check('customerId').isInt().withMessage('ID do cliente deve ser um número inteiro'),
        check('address').notEmpty().withMessage('O endereço é obrigatório'),
        check('deliveryDate').isISO8601().withMessage('A data de entrega deve ser válida'),
        check('items').isArray({ min: 1 }).withMessage('A lista de itens deve ter pelo menos um item'),
    ],
    (req: Request, res: Response, next: NextFunction): void => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        next();
    },
    asyncHandler(scheduleDelivery)
);

/**
 * @swagger
 * /api/delivery/status/{deliveryId}:
 *   put:
 *     summary: Atualiza o status de uma entrega
 *     tags: [Delivery]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: deliveryId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da entrega
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: Novo status da entrega
 *     responses:
 *       200:
 *         description: Status atualizado com sucesso
 *       400:
 *         description: Erro de validação
 *       500:
 *         description: Erro ao atualizar o status
 */
router.put(
    '/status/:deliveryId',
    authorize(['admin']),
    [check('status').notEmpty().withMessage('O status é obrigatório')],
    (req: Request, res: Response, next: NextFunction): void => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        next();
    },
    asyncHandler(updateDeliveryStatus)
);

/**
 * @swagger
 * /api/delivery/history/{deliveryId}:
 *   get:
 *     summary: Retorna o histórico de localização de uma entrega
 *     tags: [Delivery]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: deliveryId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da entrega
 *     responses:
 *       200:
 *         description: Histórico de localização da entrega
 *       500:
 *         description: Erro ao buscar o histórico de localização
 */
router.get('/history/:deliveryId', authorize(['user', 'admin']), asyncHandler(getDeliveryHistory));

/**
 * @swagger
 * /api/delivery/location/{deliveryId}:
 *   put:
 *     summary: Atualiza a localização de uma entrega
 *     tags: [Delivery]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: deliveryId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da entrega
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               latitude:
 *                 type: number
 *                 description: Latitude atual
 *               longitude:
 *                 type: number
 *                 description: Longitude atual
 *     responses:
 *       200:
 *         description: Localização atualizada com sucesso
 *       400:
 *         description: Erro de validação
 *       500:
 *         description: Erro ao atualizar a localização
 */
router.put(
    '/location/:deliveryId',
    authorize(['user', 'admin']),
    [
        check('latitude').isFloat().withMessage('A latitude deve ser um número válido'),
        check('longitude').isFloat().withMessage('A longitude deve ser um número válido'),
    ],
    (req: Request, res: Response, next: NextFunction): void => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        next();
    },
    asyncHandler(updateDeliveryLocation)
);

export default router;