// src/controllers/purchaseHistoryController.ts
import { Request, Response } from 'express';
import { Op } from 'sequelize';
import PurchaseHistory from '../models/PurchaseHistory';

export const addPurchase = async (req: Request, res: Response) => {
    const { customerId, productId, quantity, totalAmount } = req.body;
    try {
        const newPurchase = await PurchaseHistory.create({ customerId, productId, quantity, totalAmount });
        res.status(201).json({ message: 'Compra registrada com sucesso', purchase: newPurchase });
    } catch (error) {
        console.error('Erro ao registrar a compra:', error);
        res.status(500).json({ error: 'Erro ao registrar a compra' });
    }
};

// src/controllers/purchaseHistoryController.ts
import { Op } from 'sequelize';

export const getCustomerPurchaseHistory = async (req: Request, res: Response) => {
    const { customerId } = req.params;
    const { startDate, endDate } = req.query;

    try {
        // Busca com filtro de intervalo de datas
        const purchases = await PurchaseHistory.findAll({
            where: {
                customerId,
                purchaseDate: {
                    [Op.between]: [new Date(startDate as string), new Date(endDate as string)]
                }
            }
        });

        res.status(200).json({ purchases });
    } catch (error) {
        console.error('Erro ao buscar histórico de compras:', error);
        res.status(500).json({ error: 'Erro ao buscar histórico de compras' });
    }
};