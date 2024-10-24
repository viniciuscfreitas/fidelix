// src/middleware/validate.ts
import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';

/**
 * Middleware para validar os dados da requisição e enviar erros se houver falhas de validação.
 * @param validations - Lista de validações a serem aplicadas.
 */
export const validate = (validations: ValidationChain[]) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        await Promise.all(validations.map(validation => validation.run(req)));

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return; // Para garantir que o fluxo não continue após retornar o erro.
        }

        next(); // Chama o próximo middleware se não houver erros.
    };
};