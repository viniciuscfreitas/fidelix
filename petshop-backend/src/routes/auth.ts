// src/routes/auth.ts
import express, { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const router = express.Router();

// Função auxiliar para lidar com erros em funções assíncronas
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
    (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };

// Registro de usuário
router.post('/register', asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password, role = 'user' } = req.body; // Incluindo o campo 'role' com valor padrão 'user'
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        return res.status(400).json({ error: 'Email já está em uso' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword, role });

    res.status(201).json({ message: 'Usuário registrado com sucesso', user: newUser });
}));

// Login de usuário
router.post('/login', asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({ error: 'Senha inválida' });
    }

    // Incluindo o campo 'role' no token JWT
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '1h' });
    res.json({ message: 'Login realizado com sucesso', token });
}));

export default router;