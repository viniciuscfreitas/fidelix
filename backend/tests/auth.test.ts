import request from 'supertest';
import app, { server } from '../src/app'; // Importando o app e server corretamente
import User from '../src/models/User';

describe('Teste das rotas de autenticação', () => {
  let email: string;

  beforeEach(async () => {
    await User.destroy({ where: {} });
    email = `testuser_${Date.now()}@example.com`;
  });

  afterAll((done) => {
    server.close(done); // Certifique-se de fechar o servidor após todos os testes
  });

  it('deve registrar um novo usuário', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email,
        password: 'password123',
        role: 'user',
      });

    console.log(response.body);

    expect(response.status).toBe(201);
    if (response.body.error) {
      throw new Error(response.body.error);
    }
  });
});