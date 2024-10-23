// tests/customer.test.ts
import request from 'supertest';
import app from '../src/app'; // Caminho para a configuração do seu app Express

describe('Customer API', () => {
    let customerId: number;

    it('deve cadastrar um novo cliente', async () => {
        const response = await request(app)
            .post('/api/customers')
            .send({
                name: 'Cliente Teste',
                email: 'teste@cliente.com',
                phoneNumber: '123456789',
                address: 'Rua Teste, 123'
            });

        expect(response.status).toBe(201);
        expect(response.body.customer).toHaveProperty('id');
        customerId = response.body.customer.id;
    });

    it('deve retornar todos os clientes', async () => {
        const response = await request(app).get('/api/customers');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body.customers)).toBeTruthy();
    });

    it('deve retornar um cliente por ID', async () => {
        const response = await request(app).get(`/api/customers/${customerId}`);
        expect(response.status).toBe(200);
        expect(response.body.customer).toHaveProperty('id', customerId);
    });

    it('deve atualizar um cliente', async () => {
        const response = await request(app)
            .put(`/api/customers/${customerId}`)
            .send({
                name: 'Cliente Atualizado',
                email: 'atualizado@cliente.com',
                phoneNumber: '987654321',
                address: 'Rua Nova, 456'
            });

        expect(response.status).toBe(200);
        expect(response.body.customer).toHaveProperty('name', 'Cliente Atualizado');
    });

    it('deve excluir um cliente', async () => {
        const response = await request(app).delete(`/api/customers/${customerId}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Cliente excluído com sucesso');
    });
});