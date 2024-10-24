// src/routes/testRoutes.ts
import express from 'express';
import { simulateAddPoints } from '../controllers/testController';
import { authorize } from '../middleware/authorization';
import { validate } from '../middleware/validate';
import { check } from 'express-validator';

const router = express.Router();

/**
 * @swagger
 * /api/test/simulate-add-points:
 *   post:
 *     summary: Simular a adição de pontos
 *     tags: [Test]
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
 *         description: Erro no servidor
 */
router.post(
    '/simulate-add-points',
    authorize(['admin']),
    validate([
        check('customerId').isInt().withMessage('ID do cliente deve ser um número inteiro.'),
        check('points').isInt({ gt: 0 }).withMessage('Pontos devem ser um número inteiro positivo.')
    ]),
    simulateAddPoints
);

export default router;