// src/config/swaggerConfig.ts
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'PetPoints API',
        version: '1.0.0',
        description: 'Documentação da API do PetPoints Backend',
    },
    servers: [
        {
            url: 'http://localhost:3000/',
            description: 'Servidor de Desenvolvimento',
        },
    ],
};

const options = {
    swaggerDefinition,
    apis: ['./src/routes/*.ts'], // Especifique o caminho correto para os arquivos de rotas
};

const swaggerSpec = swaggerJSDoc(options);

export { swaggerUi, swaggerSpec };

// Função para configurar o Swagger
export const setupSwagger = (app: Express) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};