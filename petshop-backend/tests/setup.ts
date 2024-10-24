// tests/setup.ts
import { server } from '../src/app';

afterAll((done) => {
  server.close(done); // Encerra o servidor após todos os testes
});
