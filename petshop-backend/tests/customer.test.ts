import request from 'supertest';
import app, { server } from '../src/app';
import User from '../src/models/User';

describe('Customer API', () => {
  let token: string;
  let email: string;
  let customerId: number;

  beforeAll(async () => {
    await User.destroy({ where: {} });

    email = `testuser_${Date.now()}@example.com`;
    await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test Admin',
        email,
        password: 'password123',
        role: 'admin',
      });

    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email,
        password: 'password123',
      });

    token = loginResponse.body.token;
  });

  afterAll((done) => {
    server.close(done); // Certifique-se de fechar o servidor após todos os testes
  });

  it('deve cadastrar um novo cliente', async () => {
    const response = await request(app)
      .post('/api/customers')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Cliente Teste',
        email: `cliente_${Date.now()}@example.com`,
        phoneNumber: '123456789',
        address: 'Rua Teste, 123',
      });

    console.log(response.body);

    expect(response.status).toBe(201);
    if (response.body.error) {
      throw new Error(response.body.error);
    }

    customerId = response.body.customer.id;
  });
});