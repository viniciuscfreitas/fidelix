// src/app.ts
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import deliveryRoutes from './routes/delivery';
import customerRoutes from './routes/customer';
import subscriptionRoutes from './routes/subscription';
import loyaltyRoutes from './routes/loyalty';
import productRoutes from './routes/product';
import orderRoutes from './routes/order';
import testRoutes from './routes/testRoutes';
import marketingRoutes from './routes/marketingRoutes';
import specialDateRoutes from './routes/specialDate';
import './scheduler/cronJobs';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3001',
        methods: ['GET', 'POST', 'PUT']
    }
});

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/delivery', deliveryRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/test', testRoutes);
app.use('/api/loyalty', loyaltyRoutes);
app.use('/api/special-date', specialDateRoutes);
app.use('/api/marketing', marketingRoutes);

// Tornar o io acessível em todos os controladores
app.set('io', io);

io.on('connection', (socket) => {
    console.log('Cliente conectado:', socket.id);

    socket.on('disconnect', () => {
        console.log('Cliente desconectado:', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});