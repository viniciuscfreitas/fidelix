// src/routes/product.ts
import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
} from '../controllers/productController';
import { check, validationResult } from 'express-validator';
import { authorize } from '../middleware/authorization';

const router = express.Router();

/**
 * Middleware to validate request data and send errors if validation fails.
 */
const validate = (validations: any[]): RequestHandler => async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return; // Ensure nothing is returned after sending the response
    }
    next();
};

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Cria um novo produto
 *     tags: [Products]
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
 *                 description: Nome do produto
 *               price:
 *                 type: number
 *                 description: Preço do produto
 *               description:
 *                 type: string
 *                 description: Descrição do produto
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 *       400:
 *         description: Erro de validação
 *       500:
 *         description: Erro ao criar produto
 */
router.post(
    '/',
    authorize(['admin']),
    validate([
        check('name').notEmpty().withMessage('O nome é obrigatório'),
        check('price').isFloat({ gt: 0 }).withMessage('O preço deve ser um número positivo'),
        check('description').optional().isString().withMessage('A descrição deve ser uma string'),
    ]),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await createProduct(req, res);
        } catch (err) {
            next(err);
        }
    }
);

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Retorna todos os produtos
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Lista de todos os produtos
 *       500:
 *         description: Erro ao obter produtos
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        await getAllProducts(req, res);
    } catch (err) {
        next(err);
    }
});

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Retorna um produto específico pelo ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: Detalhes do produto
 *       404:
 *         description: Produto não encontrado
 *       500:
 *         description: Erro ao obter produto
 */
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        await getProductById(req, res);
    } catch (err) {
        next(err);
    }
});

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Atualiza um produto pelo ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome do produto
 *               price:
 *                 type: number
 *                 description: Preço do produto
 *               description:
 *                 type: string
 *                 description: Descrição do produto
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso
 *       400:
 *         description: Erro de validação
 *       404:
 *         description: Produto não encontrado
 *       500:
 *         description: Erro ao atualizar produto
 */
router.put(
    '/:id',
    authorize(['admin']),
    validate([
        check('name').optional().notEmpty().withMessage('O nome não pode estar vazio'),
        check('price').optional().isFloat({ gt: 0 }).withMessage('O preço deve ser um número positivo'),
        check('description').optional().isString().withMessage('A descrição deve ser uma string'),
    ]),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await updateProduct(req, res);
        } catch (err) {
            next(err);
        }
    }
);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Exclui um produto pelo ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: Produto excluído com sucesso
 *       404:
 *         description: Produto não encontrado
 *       500:
 *         description: Erro ao excluir produto
 */
router.delete('/:id', authorize(['admin']), async (req: Request, res: Response, next: NextFunction) => {
    try {
        await deleteProduct(req, res);
    } catch (err) {
        next(err);
    }
});

export default router;