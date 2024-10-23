// src/controllers/loyaltyController.ts
import { Request, Response } from 'express';
import LoyaltyPoints from '../models/LoyaltyPoints';
import { Op } from 'sequelize';
import SpecialDate from '../models/SpecialDate';

// Função para adicionar pontos com lógica de bônus
export const addPoints = async (req: Request, res: Response, skipBonus = false) => {
    const { customerId, points } = req.body;
    let bonusMultiplier = 1;

    try {
        if (!skipBonus) {
            // Check for active special date if bonus calculation is not skipped
            const currentDate = new Date();
            const activeSpecialDate = await SpecialDate.findOne({
                where: {
                    startDate: { [Op.lte]: currentDate },
                    endDate: { [Op.gte]: currentDate }
                }
            });

            // Apply bonus multiplier
            if (activeSpecialDate) {
                bonusMultiplier = activeSpecialDate.multiplier || 1;
            }
        }

        const finalPoints = points * bonusMultiplier;
        let loyalty = await LoyaltyPoints.findOne({ where: { customerId } });
        if (loyalty) {
            loyalty.points += finalPoints;
            await loyalty.save();
        } else {
            await LoyaltyPoints.create({ customerId, points: finalPoints });
        }

        res.status(200).json({ message: 'Pontos adicionados com sucesso', finalPoints });
    } catch (error) {
        console.error('Erro ao adicionar pontos:', error);
        res.status(500).json({ error: 'Erro ao adicionar pontos' });
    }
};

// Função para resgatar pontos
export const redeemPoints = async (req: Request, res: Response) => {
    const { customerId, points } = req.body;
    const MIN_REDEEM_POINTS = 50;
    const MAX_REDEEM_POINTS = 1000;

    try {
        if (points < MIN_REDEEM_POINTS || points > MAX_REDEEM_POINTS) {
            return res.status(400).json({ error: `Quantidade de pontos para resgatar deve ser entre ${MIN_REDEEM_POINTS} e ${MAX_REDEEM_POINTS}` });
        }

        const loyalty = await LoyaltyPoints.findOne({ where: { customerId } });
        if (!loyalty || loyalty.points < points) {
            return res.status(400).json({ error: 'Pontos insuficientes' });
        }

        loyalty.points -= points;
        await loyalty.save();

        res.status(200).json({ message: 'Pontos resgatados com sucesso', loyalty });
    } catch (error) {
        console.error('Erro ao resgatar pontos:', error);
        res.status(500).json({ error: 'Erro ao resgatar pontos' });
    }
};

// Função para listar pontos de fidelidade de um cliente específico
export const getCustomerLoyaltyPoints = async (req: Request, res: Response) => {
    const { customerId } = req.params;

    try {
        const loyalty = await LoyaltyPoints.findOne({ where: { customerId } });
        if (!loyalty) {
            return res.status(404).json({ error: 'Cliente não encontrado ou sem pontos' });
        }

        res.status(200).json({ loyalty });
    } catch (error) {
        console.error('Erro ao buscar pontos de fidelidade:', error);
        res.status(500).json({ error: 'Erro ao buscar pontos de fidelidade' });
    }
};

// Função para listar todos os pontos de fidelidade
export const getAllLoyaltyPoints = async (req: Request, res: Response) => {
    try {
        const loyaltyPoints = await LoyaltyPoints.findAll();
        res.status(200).json({ loyaltyPoints });
    } catch (error) {
        console.error('Erro ao buscar todos os pontos de fidelidade:', error);
        res.status(500).json({ error: 'Erro ao buscar todos os pontos de fidelidade' });
    }
};

// Função para associar automaticamente os pontos ao renovar a assinatura
export const addPointsOnSubscriptionRenewal = async (customerId: number, points: number) => {
    try {
        let loyalty = await LoyaltyPoints.findOne({ where: { customerId } });
        if (!loyalty) {
            loyalty = await LoyaltyPoints.create({ customerId, points });
        } else {
            loyalty.points += points;
            await loyalty.save();
        }
        console.log('Pontos adicionados automaticamente após renovação de assinatura');
    } catch (error) {
        console.error('Erro ao adicionar pontos automaticamente:', error);
    }
};

export const addBonusPointsForCampaign = async (customerId: number, bonusPoints: number) => {
    try {
        let loyalty = await LoyaltyPoints.findOne({ where: { customerId } });
        if (!loyalty) {
            loyalty = await LoyaltyPoints.create({ customerId, points: bonusPoints });
        } else {
            loyalty.points += bonusPoints;
            await loyalty.save();
        }
        console.log('Pontos de bônus adicionados para campanha');
    } catch (error) {
        console.error('Erro ao adicionar pontos de bônus:', error);
    }
};