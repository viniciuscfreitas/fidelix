// src/routes/auth.ts
import express from 'express';
import { check } from 'express-validator';
import { asyncHandler } from '../utils/asyncHandler'; // Correção da importação
import { validate } from '../middleware/validate';
import User from '../models/User'; // Importação padrão corrigida
import { authorize } from '../middleware/authorization'; // Middleware de autorização
import rateLimit from 'express-rate-limit';
import { registerUser, loginUser, deleteUser } from '../controllers/authController';

const router = express.Router();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Muitas requisições, por favor tente novamente mais tarde.'
});
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registra um novo usuário
 *     tags:
 *       - Autenticação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Test User
 *               email:
 *                 type: string
 *                 example: testuser@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *               role:
 *                 type: string
 *                 example: user
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post(
  '/register',
  validate([
    check('name').notEmpty().withMessage('O nome é obrigatório'),
    check('email').isEmail().withMessage('O e-mail deve ser válido'),
    check('password').isLength({ min: 6 }).withMessage('A senha deve ter pelo menos 6 caracteres'),
    check('role').notEmpty().withMessage('O papel do usuário é obrigatório'),
  ]),
  asyncHandler(registerUser)
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Realiza o login do usuário
 *     tags:
 *       - Autenticação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: testuser@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       401:
 *         description: Credenciais inválidas
 */
router.post(
  '/login',
  validate([
    check('email').isEmail().withMessage('O e-mail deve ser válido'),
    check('password').notEmpty().withMessage('A senha é obrigatória'),
  ]),
  asyncHandler(loginUser)
);

/**
 * @swagger
 * /auth/delete-user:
 *   delete:
 *     summary: Exclui um usuário pelo e-mail (para fins de teste)
 *     tags:
 *       - Autenticação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: testuser@example.com
 *     responses:
 *       200:
 *         description: Usuário deletado com sucesso
 *       500:
 *         description: Erro ao deletar o usuário
 */
router.delete(
  '/delete-user',
  authorize(['admin']), // Apenas administradores podem deletar usuários
  validate([
    check('email').isEmail().withMessage('O e-mail deve ser válido'),
  ]),
  asyncHandler(async (req: express.Request, res: express.Response) => {
    const { email } = req.body;
    try {
      const userDeleted = await User.destroy({ where: { email } });
      if (userDeleted) {
        res.status(200).send({ message: 'Usuário deletado com sucesso' });
      } else {
        res.status(404).send({ error: 'Usuário não encontrado' });
      }
    } catch (error) {
      res.status(500).send({ error: 'Erro ao deletar o usuário' });
    }
  })
);

export default router;
