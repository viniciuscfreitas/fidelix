// src/controllers/deliveryController.ts
import { Request, Response } from 'express';
import Delivery from '../models/Delivery';
import DeliveryLocation from '../models/DeliveryLocation';

// Função para agendar entrega
export const scheduleDelivery = async (req: Request, res: Response) => {
    const { customerId, address, deliveryDate, items } = req.body;
    try {
        const newDelivery = await Delivery.create({
            customerId,
            address,
            deliveryDate,
            items,
            status: 'Pendente'
        });

        // Emitir evento para notificar sobre a nova entrega
        req.app.get('io').emit('deliveryScheduled', { 
            deliveryId: newDelivery.id, 
            message: 'Nova entrega agendada', 
            deliveryDate 
        });

        res.status(201).json({ message: 'Delivery agendado com sucesso', delivery: newDelivery });
    } catch (error) {
        console.error('Erro ao agendar a entrega:', error);
        res.status(500).json({ error: 'Erro ao agendar a entrega' });
    }
};

// Função para atualizar a localização da entrega
export const updateDeliveryLocation = async (req: Request, res: Response) => {
    const { deliveryId } = req.params;
    const { latitude, longitude } = req.body;

    try {
        const delivery = await Delivery.findByPk(deliveryId);
        if (!delivery) {
            return res.status(404).json({ error: 'Entrega não encontrada' });
        }

        await DeliveryLocation.create({
            deliveryId: delivery.id,
            latitude,
            longitude,
        });

        req.app.get('io').emit('locationUpdate', { deliveryId, latitude, longitude });

        res.status(200).json({ message: 'Localização atualizada com sucesso' });
    } catch (error) {
        console.error('Erro ao atualizar localização:', error);
        res.status(500).json({ error: 'Erro ao atualizar localização' });
    }
};

// Função para atualizar o status da entrega
export const updateDeliveryStatus = async (req: Request, res: Response) => {
    const { deliveryId } = req.params;
    const { status } = req.body;

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

        if (!history.length) {
            return res.status(404).json({ error: 'Nenhum histórico encontrado para esta entrega' });
        }

        res.status(200).json({ deliveryId, history });
    } catch (error) {
        console.error('Erro ao buscar histórico de localização:', error);
        res.status(500).json({ error: 'Erro ao buscar histórico de localização' });
    }
};