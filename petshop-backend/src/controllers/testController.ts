// src/controllers/testController.ts
import { Request, Response } from 'express';
import { addPoints } from './loyaltyController';

export const simulateAddPoints = async (req: Request, res: Response) => {
    const { customerId, points, date } = req.body;
    
    // Temporariamente substituir a data atual por uma data específica para teste
    const originalDateNow = Date.now;
    Date.now = () => new Date(date).getTime();

    try {
        await addPoints(req, res);
    } finally {
        // Restaurar a função original Date.now
        Date.now = originalDateNow;
    }
};