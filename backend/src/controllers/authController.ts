// src/controllers/authController.ts
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'defaultsecret';

// Função para registrar um novo usuário
export const registerUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role = 'user' } = req.body; // Define "user" como padrão
        
        // Validação básica
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
        }

        // Verificar se o e-mail já está em uso
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'E-mail já está em uso' });
        }

        // Criptografar a senha
        const hashedPassword = await bcrypt.hash(password, 10);

        // Criar o usuário
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
        });

        res.status(201).json({
            message: 'Usuário registrado com sucesso',
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
            },
        });
    } catch (error) {
        console.error('Erro ao registrar o usuário:', error);
        res.status(500).json({ error: 'Erro ao registrar o usuário' });
    }
};

// Função para fazer login de um usuário
export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Verifica se o usuário existe
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ error: 'Credenciais inválidas' });
        }

        // Compara a senha fornecida com a senha criptografada no banco de dados
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Credenciais inválidas' });
        }

        // Gera um token JWT
        const token = jwt.sign(
            { userId: user.id, role: user.role },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: 'Login realizado com sucesso',
            token,
        });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao fazer login' });
    }
};

// Função para deletar ou desativar um usuário
export const deleteUser = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;
        const { action } = req.body; // 'delete' ou 'deactivate'

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        if (action === 'delete') {
            await user.destroy();
            return res.status(200).json({ message: 'Usuário deletado com sucesso' });
        } else if (action === 'deactivate') {
            user.active = false; // Supondo que exista um campo 'active' na tabela de usuários
            await user.save();
            return res.status(200).json({ message: 'Usuário desativado com sucesso' });
        } else {
            return res.status(400).json({ error: 'Ação inválida' });
        }
    } catch (error) {
        console.error('Erro ao deletar ou desativar usuário:', error);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
};