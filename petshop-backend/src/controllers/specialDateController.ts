// src/controllers/specialDateController.ts
import { Request, Response } from 'express';
import SpecialDate from '../models/SpecialDate';

// Função para adicionar uma data especial
export const addSpecialDate = async (req: Request, res: Response) => {
    const { name, startDate, endDate, multiplier } = req.body;
    try {
        const newSpecialDate = await SpecialDate.create({ name, startDate, endDate, multiplier });
        res.status(201).json({ message: 'Data especial adicionada com sucesso', specialDate: newSpecialDate });
    } catch (error) {
        console.error('Erro ao adicionar data especial:', error);
        res.status(500).json({ error: 'Erro ao adicionar data especial' });
    }
};

// Função para obter todas as datas especiais
export const getSpecialDates = async (req: Request, res: Response) => {
    try {
        const specialDates = await SpecialDate.findAll();
        res.status(200).json({ specialDates });
    } catch (error) {
        console.error('Erro ao obter datas especiais:', error);
        res.status(500).json({ error: 'Erro ao obter datas especiais' });
    }
};

