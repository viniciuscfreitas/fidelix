// src/controllers/orderController.ts
import { Request, Response } from 'express';
import Order from '../models/Order';
import { addPoints } from './loyaltyController';
import { Op } from 'sequelize';

// Função para criar um pedido
export const createOrder = async (req: Request, res: Response) => {
    const { customerId, products, totalPrice } = req.body;

    try {
        const newOrder = await Order.create({
            customerId,
            products: JSON.stringify(products),
            totalPrice,
            purchaseDate: new Date()
        });

        // Adicionar pontos ao cliente com a verificação de promoções
        addPoints({ body: { customerId, points: Math.floor(totalPrice) } } as Request, res)
            .catch((error) => console.error('Erro ao adicionar pontos:', error));

        res.status(201).json({ message: 'Pedido criado com sucesso', order: newOrder });
    } catch (error) {
        console.error('Erro ao criar pedido:', error);
        res.status(500).json({ error: 'Erro ao criar pedido' });
    }
};

// Função para listar todos os pedidos com paginação e filtros
export const getAllOrders = async (req: Request, res: Response) => {
    const { page = 1, limit = 10, minTotal, maxTotal, customerId } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const filters: any = {};
    if (customerId) filters.customerId = Number(customerId);
    if (minTotal) filters.totalPrice = { [Op.gte]: Number(minTotal) };
    if (maxTotal) filters.totalPrice = { ...filters.totalPrice, [Op.lte]: Number(maxTotal) };

    try {
        const orders = await Order.findAndCountAll({
            where: filters,
            limit: Number(limit),
            offset: offset,
        });

        const formattedOrders = orders.rows.map(order => ({
            ...order.toJSON(),
            products: JSON.parse(order.products),
        }));

        res.status(200).json({
            orders: formattedOrders,
            total: orders.count,
            page: Number(page),
            totalPages: Math.ceil(orders.count / Number(limit)),
        });
    } catch (error) {
        console.error('Erro ao buscar pedidos:', error);
        res.status(500).json({ error: 'Erro ao buscar pedidos' });
    }
};

// Função para buscar pedidos por intervalo de datas com paginação
export const getOrdersByDateRange = async (req: Request, res: Response) => {
    const { startDate, endDate, page = 1, limit = 10 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    try {
        const orders = await Order.findAndCountAll({
            where: {
                purchaseDate: {
                    [Op.between]: [new Date(startDate as string), new Date(endDate as string)]
                }
            },
            limit: Number(limit),
            offset: offset,
        });

        const formattedOrders = orders.rows.map(order => ({
            ...order.toJSON(),
            products: JSON.parse(order.products),
        }));

        res.status(200).json({
            orders: formattedOrders,
            total: orders.count,
            page: Number(page),
            totalPages: Math.ceil(orders.count / Number(limit)),
        });
    } catch (error) {
        console.error('Erro ao buscar pedidos por intervalo de datas:', error);
        res.status(500).json({ error: 'Erro ao buscar pedidos por intervalo de datas' });
    }
};

// Função para buscar um pedido por ID
export const getOrderById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const order = await Order.findByPk(id);
        if (!order) {
            return res.status(404).json({ error: 'Pedido não encontrado' });
        }
        res.status(200).json({ order });
    } catch (error) {
        console.error('Erro ao buscar pedido:', error);
        res.status(500).json({ error: 'Erro ao buscar pedido' });
    }
};

// Função para buscar pedidos por ID de cliente
export const getOrdersByCustomerId = async (req: Request, res: Response) => {
    const { customerId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    try {
        const orders = await Order.findAndCountAll({
            where: { customerId },
            limit: Number(limit),
            offset: offset,
        });

        const formattedOrders = orders.rows.map(order => ({
            ...order.toJSON(),
            products: JSON.parse(order.products),
        }));

        res.status(200).json({
            orders: formattedOrders,
            total: orders.count,
            page: Number(page),
            totalPages: Math.ceil(orders.count / Number(limit)),
        });
    } catch (error) {
        console.error('Erro ao buscar pedidos do cliente:', error);
        res.status(500).json({ error: 'Erro ao buscar pedidos do cliente' });
    }
};

// Função para buscar o histórico de compras de um cliente
export const getCustomerPurchaseHistory = async (req: Request, res: Response) => {
    const { customerId } = req.params;
    const { startDate, endDate } = req.query;

    try {
        const orders = await Order.findAll({
            where: {
                customerId,
                purchaseDate: {
                    [Op.between]: [new Date(startDate as string), new Date(endDate as string)]
                }
            }
        });

        res.status(200).json({ orders });
    } catch (error) {
        console.error('Erro ao buscar histórico de compras:', error);
        res.status(500).json({ error: 'Erro ao buscar histórico de compras' });
    }
};