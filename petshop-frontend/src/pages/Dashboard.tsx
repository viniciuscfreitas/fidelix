// src/pages/Dashboard.tsx
import React from 'react';

const Dashboard: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
            <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-4xl">
                <h2 className="text-3xl font-bold mb-6 text-center">Dashboard</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-500 text-white p-4 rounded">
                        <h3 className="text-xl font-semibold">Número de Usuários</h3>
                        <p className="text-2xl">45</p>
                    </div>
                    <div className="bg-green-500 text-white p-4 rounded">
                        <h3 className="text-xl font-semibold">Serviços Realizados</h3>
                        <p className="text-2xl">120</p>
                    </div>
                    <div className="bg-yellow-500 text-white p-4 rounded">
                        <h3 className="text-xl font-semibold">Agendamentos Pendentes</h3>
                        <p className="text-2xl">30</p>
                    </div>
                    <div className="bg-red-500 text-white p-4 rounded">
                        <h3 className="text-xl font-semibold">Feedbacks Recebidos</h3>
                        <p className="text-2xl">75</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;