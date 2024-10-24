// src/routes/specialDate.ts
import express, { Request, Response, NextFunction } from 'express';
import { addSpecialDate, getSpecialDates } from '../controllers/specialDateController';
import { check, validationResult } from 'express-validator';
import { authorize } from '../middleware/authorization';

const router = express.Router();

/**
 * @swagger
 * /api/special-date:
 *   post:
 *     summary: Adiciona uma data especial
 *     tags: [Special Dates]
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
 *                 description: Nome da data especial
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Data especial
 *     responses:
 *       201:
 *         description: Data especial adicionada com sucesso
 *       400:
 *         description: Erro de validação
 *       500:
 *         description: Erro ao adicionar a data especial
 */
router.post(
    '/',
    authorize(['admin']),
    [
        check('name').notEmpty().withMessage('O nome é obrigatório'),
        check('date').isISO8601().withMessage('A data deve estar no formato ISO 8601'),
    ],
    (req: Request, res: Response, next: NextFunction): void => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        next();
    },
    addSpecialDate
);

/**
 * @swagger
 * /api/special-date:
 *   get:
 *     summary: Retorna todas as datas especiais
 *     tags: [Special Dates]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de todas as datas especiais
 *       500:
 *         description: Erro ao obter datas especiais
 */
router.get('/', authorize(['admin', 'user']), getSpecialDates);

export default router;