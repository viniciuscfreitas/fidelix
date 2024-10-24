# Pet Shop Backend

Este projeto é um backend para um sistema de gerenciamento de um pet shop, desenvolvido com Node.js e TypeScript, utilizando o framework Express. O sistema inclui funcionalidades para gerenciamento de clientes, produtos, assinaturas, pedidos, fidelidade e campanhas de marketing.

## Funcionalidades

- **Autenticação e Gerenciamento de Usuários**:
  - Registro, login e gerenciamento de usuários com suporte a JWT.
  - Controle de acesso baseado em funções (admin, usuário).

- **Gestão de Clientes**:
  - Cadastro, atualização, exclusão e listagem de clientes.
  
- **Catálogo de Produtos**:
  - Cadastro e gerenciamento de produtos (nome, descrição, preço, estoque).

- **Sistema de Pontos de Fidelidade**:
  - Acúmulo e resgate de pontos com regras de pontuação configuráveis.
  - Bônus em datas especiais.

- **Gerenciamento de Assinaturas e Entregas**:
  - Sistema automatizado para renovação e agendamento de entregas.
  - Tarefas diárias agendadas com cron jobs.

- **Gerenciamento de Pedidos**:
  - Criação, listagem e histórico de pedidos.

- **Campanhas de Marketing**:
  - Segmentação de clientes e cálculo do Lifetime Value (LTV).

- **Documentação da API**:
  - A API é documentada com Swagger e acessível via `/api-docs`.

## Tecnologias Utilizadas

- **Node.js** e **TypeScript**: Plataforma e linguagem de programação principal.
- **Express**: Framework para construção de APIs RESTful.
- **Sequelize**: ORM para gerenciamento do banco de dados relacional.
- **PostgreSQL** e **MongoDB**: Bancos de dados suportados.
- **JWT**: Autenticação baseada em token.
- **Swagger**: Documentação da API.
- **node-cron**: Agendamento de tarefas.

## Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/seu-usuario/petshop-backend.git
   ```

2. Entre no diretório do projeto:

   ```bash
   cd petshop-backend
   ```

3. Instale as dependências:

   ```bash
   npm install
   ```

4. Configure o arquivo `.env` com as seguintes variáveis:

   ```
   PORT=3000
   JWT_SECRET=sua_chave_secreta
   DB_NAME=petshop
   DB_USER=usuario
   DB_PASSWORD=senha
   DB_HOST=localhost
   ```

5. Inicie o servidor:

   ```bash
   npm start
   ```

## Tarefas Agendadas

O sistema utiliza `node-cron` para agendamento de tarefas automáticas. As tarefas agendadas incluem:

- **Renovação de Assinaturas**: Executa diariamente à meia-noite para verificar e renovar assinaturas.
- **Notificações de Entrega**: Pode ser configurado para enviar notificações de entrega.

## Documentação da API

A documentação da API está disponível em [http://localhost:3000/api-docs](http://localhost:3000/api-docs).

## Estrutura do Projeto

```plaintext
petshop-backend/
├── src/
│   ├── controllers/      # Lógica de controle das requisições
│   ├── routes/           # Definição das rotas da API
│   ├── models/           # Definição dos modelos de dados
│   ├── middleware/       # Middlewares para validação e autenticação
│   ├── utils/            # Funções utilitárias
│   ├── scheduler/        # Tarefas agendadas com cron jobs
│   └── config/           # Configurações do banco de dados
└── tests/                # Testes automatizados
```

## Sugestões de Melhorias Futuras

1. **Melhorias na Segurança**: Implementar políticas de expiração de tokens e proteção contra ataques de força bruta.
2. **Implementação de Testes Automatizados**: Cobrir todas as funcionalidades críticas com testes unitários e de integração.
3. **Cacheamento e Otimização de Consultas**: Melhorar o desempenho com cache e otimizações de banco de dados.
4. **Interface de Administração**: Criar uma interface web para facilitar o gerenciamento das operações do sistema.

## Licença

Este projeto é licenciado sob a [MIT License](LICENSE).