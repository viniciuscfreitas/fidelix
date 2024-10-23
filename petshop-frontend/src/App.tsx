// src/App.tsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { io } from 'socket.io-client';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
    useEffect(() => {
        const socket = io('http://localhost:3000'); // URL do backend

        socket.on('connect', () => {
            console.log('Conectado ao servidor Socket.io:', socket.id);
        });

        socket.on('deliveryScheduled', (data) => {
            console.log('Nova entrega agendada:', data);
            alert(`Nova entrega agendada para o dia ${data.deliveryDate}`);
        });

        socket.on('locationUpdate', (data) => {
            console.log('Atualização de localização:', data);
            alert(`Localização da entrega atualizada: Lat ${data.latitude}, Lng ${data.longitude}`);
        });

        socket.on('statusUpdate', (data) => {
            console.log('Atualização de status:', data);
            alert(`Status da entrega atualizado para: ${data.status}`);
        });

        socket.on('disconnect', () => {
            console.log('Desconectado do servidor Socket.io');
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<ProtectedRoute />}>
                    <Route path="" element={<Dashboard />} />
                </Route>
                <Route path="*" element={<h1>Página não encontrada</h1>} />
            </Routes>
        </Router>
    );
};

export default App;