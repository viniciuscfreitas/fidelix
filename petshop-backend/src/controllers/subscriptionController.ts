// src/controllers/subscriptionController.ts
import { Request, Response } from 'express';
import Subscription from '../models/Subscription';
import { addPoints, redeemPoints } from './loyaltyController';

// Função para criar uma nova assinatura
export const createSubscription = async (req: Request, res: Response) => {
    const { customerId, productId, frequency, nextDeliveryDate } = req.body;

    try {
        const newSubscription = await Subscription.create({
            customerId,
            productId,
            frequency,
            nextDeliveryDate,
            status: 'Ativa'
        });
        // Adicionar pontos automaticamente ao criar a assinatura
        await addPoints({ body: { customerId, points: 50 } } as Request, res);

        res.status(201).json({ message: 'Assinatura criada com sucesso e pontos adicionados', subscription: newSubscription });
    } catch (error) {
        let errorMessage = 'Erro ao criar assinatura';
        if (error instanceof Error) {
            errorMessage += `: ${error.message}`;
        }
        console.error(errorMessage, error);
        res.status(500).json({ error: errorMessage });
    }
};

// Função para obter todas as assinaturas
export const getAllSubscriptions = async (req: Request, res: Response) => {
    try {
        const subscriptions = await Subscription.findAll();
        res.status(200).json({ subscriptions });
    } catch (error) {
        console.error('Erro ao buscar assinaturas:', error);
        res.status(500).json({ error: 'Erro ao buscar assinaturas' });
    }
};

// Função para cancelar uma assinatura
export const cancelSubscription = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const subscription = await Subscription.findByPk(id);
        if (!subscription) {
            return res.status(404).json({ error: 'Assinatura não encontrada' });
        }

        subscription.status = 'Cancelada';
        await subscription.save();

        res.status(200).json({ message: 'Assinatura cancelada com sucesso', subscription });
    } catch (error) {
        console.error('Erro ao cancelar assinatura:', error);
        res.status(500).json({ error: 'Erro ao cancelar assinatura' });
    }
};

// Função para renovar a assinatura
export const renewSubscription = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { pointsToAdd } = req.body;

    try {
        const subscription = await Subscription.findByPk(id);
        if (!subscription) {
            return res.status(404).json({ error: 'Assinatura não encontrada' });
        }

        // Calcular a próxima data de entrega com base na frequência
        const nextDate = calculateNextDeliveryDate(subscription.nextDeliveryDate, subscription.frequency);
        subscription.nextDeliveryDate = nextDate;
        await subscription.save();

        // Adicionar pontos de fidelidade ao renovar
        await addPoints({ body: { customerId: subscription.customerId, points: pointsToAdd } } as Request, res);

        res.status(200).json({ message: 'Assinatura renovada com sucesso e pontos adicionados', subscription });
    } catch (error) {
        console.error('Erro ao renovar assinatura:', error);
        res.status(500).json({ error: 'Erro ao renovar assinatura' });
    }
};

// Função para renovar a assinatura com desconto usando pontos
export const renewSubscriptionWithDiscount = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { pointsToRedeem } = req.body;

    try {
        const subscription = await Subscription.findByPk(id);
        if (!subscription) {
            return res.status(404).json({ error: 'Assinatura não encontrada' });
        }

        // Aplicar desconto com pontos resgatados
        const response = await redeemPoints({ body: { customerId: subscription.customerId, points: pointsToRedeem } } as Request, res);
        if (!response || res.statusCode !== 200) {
            return res.status(400).json({ error: 'Não foi possível aplicar o desconto' });
        }

        // Atualizar a próxima data de entrega
        const nextDate = calculateNextDeliveryDate(subscription.nextDeliveryDate, subscription.frequency);
        subscription.nextDeliveryDate = nextDate;
        await subscription.save();

        res.status(200).json({ message: 'Assinatura renovada com desconto aplicado', subscription });
    } catch (error) {
        console.error('Erro ao renovar assinatura com desconto:', error);
        res.status(500).json({ error: 'Erro ao renovar assinatura com desconto' });
    }
};

// Função auxiliar para calcular a próxima data de entrega
const calculateNextDeliveryDate = (currentDate: Date, frequency: string): Date => {
    const nextDate = new Date(currentDate);
    switch (frequency) {
        case 'semanal':
            nextDate.setDate(nextDate.getDate() + 7);
            break;
        case 'mensal':
            nextDate.setMonth(nextDate.getMonth() + 1);
            break;
        case 'bimestral':
            nextDate.setMonth(nextDate.getMonth() + 2);
            break;
        default:
            break;
    }
    return nextDate;
};