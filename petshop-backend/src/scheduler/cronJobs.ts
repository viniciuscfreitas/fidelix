import cron from 'node-cron';
import Subscription from '../models/Subscription';
import Delivery from '../models/Delivery';
import { Op } from 'sequelize';

if (process.env.NODE_ENV !== 'test') {
    // Agendar tarefa diária para verificar assinaturas
    cron.schedule('0 0 * * *', async () => {
        console.log('Executando tarefa de agendamento de entregas...');

        try {
            const subscriptions = await Subscription.findAll({
                where: {
                    nextDeliveryDate: {
                        [Op.lte]: new Date(), // Verificar assinaturas com data de entrega até hoje
                    },
                    status: 'Ativa',
                },
            });

            for (const subscription of subscriptions) {
                // Criar uma nova entrega com base na assinatura
                await Delivery.create({
                    customerId: subscription.customerId,
                    address: 'Endereço do Cliente', // Recuperar endereço do cliente se necessário
                    deliveryDate: subscription.nextDeliveryDate,
                    items: ['Produto associado à assinatura'], // Ajuste conforme a lógica do produto
                    status: 'Pendente',
                });

                // Atualizar a próxima data de entrega
                const newDeliveryDate = new Date(subscription.nextDeliveryDate);
                newDeliveryDate.setDate(newDeliveryDate.getDate() + (subscription.frequency === 'Semanal' ? 7 : 30));
                subscription.nextDeliveryDate = newDeliveryDate;
                await subscription.save();
            }

            console.log('Entregas programadas processadas com sucesso.');
        } catch (error) {
            console.error('Erro ao processar entregas programadas:', error);
        }
    });
}