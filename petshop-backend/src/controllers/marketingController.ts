// src/controllers/marketingController.ts
import { Request, Response } from 'express';
import Order from '../models/Order';
import LoyaltyPoints from '../models/LoyaltyPoints';
import CampaignRegistration from '../models/CampaignRegistration';
import { Op, Sequelize } from 'sequelize';

// Função para segmentar clientes com base no histórico de compras e categorias
export const segmentCustomers = async (req: Request, res: Response) => {
    const { minTotalSpent = 0, minPurchaseCount = 0, periodInMonths = 12, minPoints = 0 } = req.query;
    try {
        const cutoffDate = new Date();
        cutoffDate.setMonth(cutoffDate.getMonth() - Number(periodInMonths));

        const customers = await Order.findAll({
            where: {
                purchaseDate: { [Op.gte]: cutoffDate },
            },
            attributes: [
                'customerId',
                [Sequelize.fn('SUM', Sequelize.col('totalPrice')), 'totalSpent'],
                [Sequelize.fn('COUNT', Sequelize.col('id')), 'purchaseCount']
            ],
            group: ['customerId'],
            having: Sequelize.literal(
                `SUM("totalPrice") >= ${minTotalSpent} AND COUNT("id") >= ${minPurchaseCount}`
            ),
        });

        const filteredCustomerIds = customers.map(c => c.customerId);
        res.status(200).json({ customers: filteredCustomerIds });
    } catch (error) {
        console.error('Erro ao segmentar clientes:', error);
        res.status(500).json({ error: 'Erro ao segmentar clientes' });
    }
};

// Função para calcular o Lifetime Value (LTV) dos clientes
export const calculateLTV = async (req: Request, res: Response) => {
    try {
        const ltvData = await Order.findAll({
            attributes: [
                'customerId',
                [Sequelize.fn('SUM', Sequelize.col('totalPrice')), 'lifetimeValue']
            ],
            group: ['customerId']
        });

        res.status(200).json({ ltvData });
    } catch (error) {
        console.error('Erro ao calcular LTV:', error);
        res.status(500).json({ error: 'Erro ao calcular LTV' });
    }
};

// Função para calcular a métrica de cliente valioso baseada em LTV e pontos acumulados
export const identifyHighValueCustomers = async (req: Request, res: Response) => {
    const { minLTV = 0, minPoints = 0 } = req.query;

    try {
        const customers = await Order.findAll({
            attributes: [
                'customerId',
                [Sequelize.fn('SUM', Sequelize.col('totalPrice')), 'lifetimeValue']
            ],
            group: ['customerId'],
            having: Sequelize.literal(`SUM("totalPrice") >= ${minLTV}`)
        });

        const customerIds = customers.map(c => c.customerId);

        const customersWithLoyalty = await LoyaltyPoints.findAll({
            where: {
                customerId: { [Op.in]: customerIds },
                points: { [Op.gte]: Number(minPoints) }
            },
            attributes: ['customerId', 'points']
        });

        res.status(200).json({ customers: customersWithLoyalty });
    } catch (error) {
        console.error('Erro ao identificar clientes de alto valor:', error);
        res.status(500).json({ error: 'Erro ao identificar clientes de alto valor' });
    }
};

// Atualizando a função registerCampaignForSegment
export const registerCampaignForSegment = async (req: Request, res: Response) => {
    const { campaignName, customerIds } = req.body;

    try {
        // Verificar se já existe uma campanha para esses clientes
        const existingRegistrations = await CampaignRegistration.findAll({
            where: {
                campaignName,
                customerId: { [Op.in]: customerIds }
            },
            attributes: ['customerId']
        });

        // Filtrar os clientes que ainda não estão registrados
        const alreadyRegisteredIds = existingRegistrations.map(reg => reg.customerId);
        const newCustomerIds = customerIds.filter((id: number) => !alreadyRegisteredIds.includes(id));

        // Registrar apenas os clientes que ainda não estão na campanha
        if (newCustomerIds.length > 0) {
            const campaignRegistrations = await CampaignRegistration.bulkCreate(
                newCustomerIds.map((customerId: number) => ({
                    customerId,
                    campaignName,
                    registeredAt: new Date(),
                }))
            );

            res.status(200).json({ message: 'Campanha registrada com sucesso', campaignRegistrations });
        } else {
            res.status(400).json({ message: 'Todos os clientes já estão registrados nesta campanha' });
        }
    } catch (error) {
        console.error('Erro ao registrar campanha:', error);
        res.status(500).json({ error: 'Erro ao registrar campanha' });
    }
};


// Listar todas as campanhas
export const getAllCampaigns = async (req: Request, res: Response) => {
    try {
        const campaigns = await CampaignRegistration.findAll();
        res.status(200).json({ campaigns });
    } catch (error) {
        console.error('Erro ao buscar campanhas:', error);
        res.status(500).json({ error: 'Erro ao buscar campanhas' });
    }
};

// Listar campanhas por cliente
export const getCampaignsByCustomer = async (req: Request, res: Response) => {
    const { customerId } = req.params;

    try {
        const campaigns = await CampaignRegistration.findAll({
            where: { customerId }
        });
        res.status(200).json({ campaigns });
    } catch (error) {
        console.error('Erro ao buscar campanhas do cliente:', error);
        res.status(500).json({ error: 'Erro ao buscar campanhas do cliente' });
    }
};