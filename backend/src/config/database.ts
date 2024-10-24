import dotenv from 'dotenv';
dotenv.config(); // Carregar as variáveis de ambiente antes de configurar o Sequelize

import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
    process.env.DB_NAME!, // Nome do banco de dados
    process.env.DB_USER!, // Usuário do banco de dados
    process.env.DB_PASSWORD!, // Senha do banco de dados
    {
        host: process.env.DB_HOST || 'localhost', // Host do banco de dados
        port: Number(process.env.DB_PORT) || 5432, // Porta do banco de dados
        dialect: 'postgres', // Dialeto do banco de dados
        logging: false, // Habilitar logs para depuração
    }
);

export default sequelize;