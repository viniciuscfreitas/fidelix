// src/middleware/authorization.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authorize = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            res.status(401).json({ error: 'Acesso negado' });
            return; // Adiciona return para finalizar o fluxo
        }

        try {
            const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
            if (!roles.includes(decoded.role)) {
                res.status(403).json({ error: 'Permissão negada' });
                return; // Adiciona return para finalizar o fluxo
            }

            next(); // Continua para o próximo middleware se o usuário for autorizado
        } catch (error) {
            res.status(401).json({ error: 'Token inválido' });
            return; // Adiciona return para finalizar o fluxo
        }
    };
};