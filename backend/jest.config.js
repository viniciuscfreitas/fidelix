/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'], // Mapeamento para os arquivos de teste
  moduleFileExtensions: ['ts', 'js'],
  setupFilesAfterEnv: ['./jest.setup.js'],
  bail: false, // Não interromper após a primeira falha
  verbose: true,
  forceExit: true, // Forçar saída do Jest após completar os testes
  detectOpenHandles: false, // Não tentar detectar handles abertos
  errorOnDeprecated: false, // Ignorar avisos de APIs obsoletas
};
