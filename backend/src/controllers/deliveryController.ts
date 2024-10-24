// src/controllers/deliveryController.ts
import { Request, Response } from 'express';
import Delivery from '../models/Delivery';
import DeliveryLocation from '../models/DeliveryLocation';

export const scheduleDelivery = async (req: Request, res: Response) => {
    const { customerId, address, deliveryDate, items } = req.body;
    if (!customerId || !address || !deliveryDate || !items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'Dados inválidos para agendamento de entrega' });
    }

    try {
        const parsedDeliveryDate = new Date(deliveryDate);
        if (parsedDeliveryDate <= new Date()) {
            return res.status(400).json({ error: 'A data de entrega deve ser futura' });
        }

        const newDelivery = await Delivery.create({
            customerId,
            address,
            deliveryDate: parsedDeliveryDate,
            items,
            status: 'Pendente'
        });

        // Emitir evento para notificar sobre a nova entrega
        req.app.get('io').emit('deliveryScheduled', { 
            deliveryId: newDelivery.id, 
            message: 'Nova entrega agendada', 
            deliveryDate 
        });

        res.status(201).json({ message: 'Entrega agendada com sucesso', delivery: newDelivery });
    } catch (error) {
        console.error('Erro ao agendar a entrega:', error);
        res.status(500).json({ error: 'Erro ao agendar a entrega' });
    }
};

// Função para atualizar a localização da entrega
export const updateDeliveryLocation = async (req: Request, res: Response) => {
    const { deliveryId } = req.params;
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
        return res.status(400).json({ error: 'Latitude e longitude são necessários' });
    }

    try {
        const delivery = await Delivery.findByPk(deliveryId);
        if (!delivery) {
            return res.status(404).json({ error: 'Entrega não encontrada' });
        }

        const location = await DeliveryLocation.create({
            deliveryId: delivery.id,
            latitude,
            longitude,
        });

        req.app.get('io').emit('locationUpdate', { 
            deliveryId, 
            latitude, 
            longitude, 
            timestamp: location.createdAt 
        });

        res.status(200).json({ message: 'Localização atualizada com sucesso' });
    } catch (error) {
        console.error('Erro ao atualizar localização:', error);
        res.status(500).json({ error: 'Erro ao atualizar localização' });
    }
};

export const updateDeliveryStatus = async (req: Request, res: Response) => {
    const { deliveryId } = req.params;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ error: 'Status é necessário' });
    }

    try {
        const delivery = await Delivery.findByPk(deliveryId);
        if (!delivery) {
            return res.status(404).json({ error: 'Entrega não encontrada' });
        }

        delivery.status = status;
        await delivery.save();

        // Emitir evento para notificar sobre a atualização de status
        req.app.get('io').emit('statusUpdate', { 
            deliveryId, 
            status, 
            message: `Status atualizado para ${status}` 
        });

        res.status(200).json({ message: 'Status atualizado com sucesso', delivery });
    } catch (error) {
        console.error('Erro ao atualizar o status:', error);
        res.status(500).json({ error: 'Erro ao atualizar o status' });
    }
};

// Função para obter o histórico de localização da entrega
export const getDeliveryHistory = async (req: Request, res: Response) => {
    const { deliveryId } = req.params;

    try {
        const history = await DeliveryLocation.findAll({
            where: { deliveryId },
            order: [['createdAt', 'ASC']],
        });

        const formattedHistory = history.map(location => ({
            latitude: location.latitude,
            longitude: location.longitude,
            timestamp: location.createdAt, // Deve estar acessível após os ajustes no modelo
        }));

        if (!history.length) {
            return res.status(404).json({ error: 'Nenhum histórico encontrado para esta entrega' });
        }

        res.status(200).json({ deliveryId, history });
    } catch (error) {
        console.error('Erro ao buscar histórico de localização:', error);
        res.status(500).json({ error: 'Erro ao buscar histórico de localização' });
    }
};