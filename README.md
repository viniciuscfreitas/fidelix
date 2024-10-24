# PetPoints - Backend MVP

PetPoints é o backend MVP (Minimum Viable Product) de um sistema SaaS voltado para pet shops. Ele oferece uma solução completa para gerenciamento de logística, CRM com fidelidade e recompensas, além de assinaturas e entregas programadas. O objetivo do PetPoints é transformar a forma como pequenos pet shops operam, proporcionando uma plataforma unificada para melhorar a eficiência operacional e a experiência do cliente.

## Arquitetura do Projeto SaaS Integrado

### 1. Módulo de Delivery e Logística
- **Funcionalidades**:
  - Agendamento de entregas com rastreamento em tempo real.
  - Otimização de rotas para entregas múltiplas, reduzindo custos e tempo.
  - Entrega expressa para produtos mais urgentes.
- **Objetivo**: Facilitar a logística de entrega e melhorar a eficiência operacional do pet shop.

### 2. Módulo de CRM com Fidelidade e Recompensas
- **Funcionalidades**:
  - Registro detalhado de clientes e histórico de compras.
  - Segmentação de clientes com base em comportamento de compra, oferecendo promoções e descontos personalizados.
  - Programa de fidelidade, onde os clientes acumulam pontos para cada compra, que podem ser trocados por produtos ou serviços (banho e tosa, por exemplo).
- **Objetivo**: Aumentar a retenção de clientes e melhorar a experiência do cliente com campanhas personalizadas.

### 3. Módulo de Assinaturas e Entregas Programadas
- **Funcionalidades**:
  - Gestão de assinaturas para itens recorrentes, como ração e medicamentos.
  - Personalização da frequência de entregas de acordo com as preferências do cliente.
  - Recomendações automáticas de produtos complementares com base na assinatura (por exemplo, oferecer um desconto em petiscos na entrega de ração).
- **Objetivo**: Criar um fluxo de receita recorrente e previsível, além de melhorar a conveniência para os tutores.

## Funcionalidades Gerais do Sistema

- **Autenticação e Gerenciamento de Usuários**: Registro, login, gerenciamento de usuários e controle de acesso com base em funções.
- **Gestão de Clientes**: Cadastro, atualização, exclusão e listagem de clientes, com histórico detalhado.
- **Catálogo de Produtos**: Cadastro e gerenciamento de produtos, incluindo estoque e preços.
- **Sistema de Pontos de Fidelidade**: Acúmulo, resgate de pontos e bônus em datas especiais.
- **Gestão de Assinaturas e Entregas**: Automação de entregas programadas e tarefas agendadas.
- **Gerenciamento de Pedidos**: Criação, listagem e histórico de pedidos.
- **Campanhas de Marketing**: Segmentação de clientes e campanhas automatizadas.

## Tecnologias Utilizadas

- **Node.js** e **TypeScript**: Plataforma e linguagem de programação principal.
- **Express**: Framework para construção de APIs RESTful.
- **Sequelize**: ORM para interação com o banco de dados.
- **PostgreSQL** e **MongoDB**: Bancos de dados para armazenamento de dados.
- **JWT**: Autenticação baseada em token.
- **Swagger**: Documentação da API.
- **node-cron**: Para agendamento de tarefas.

## Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/seu-usuario/petpoints-backend.git
   ```

2. Entre no diretório do projeto:

   ```bash
   cd petpoints-backend
   ```

3. Instale as dependências:

   ```bash
   npm install
   ```

4. Configure o arquivo `.env` com as seguintes variáveis:

   ```
   PORT=3000
   JWT_SECRET=sua_chave_secreta
   DB_NAME=petpoints
   DB_USER=usuario
   DB_PASSWORD=senha
   DB_HOST=localhost
   ```

5. Inicie o servidor:

   ```bash
   npm start
   ```

## Módulos do Sistema

### Módulo de Delivery e Logística
- **Rastreamento em Tempo Real**: Acompanhe as entregas com atualização em tempo real.
- **Otimização de Rotas**: Reduza o custo e o tempo de entrega para múltiplas entregas.
- **Entrega Expressa**: Ofereça opções de entrega rápida para pedidos urgentes.

### Módulo de CRM e Fidelidade
- **Registro de Clientes**: Cadastro detalhado e histórico de compras.
- **Segmentação de Clientes**: Ofereça campanhas e promoções personalizadas.
- **Programa de Pontos**: Acumulação e resgate de pontos com benefícios exclusivos.

### Módulo de Assinaturas
- **Gestão de Assinaturas**: Renove automaticamente assinaturas de produtos recorrentes.
- **Sugestões Personalizadas**: Recomendações automáticas com base no histórico de compras.

## Tarefas Agendadas

O sistema utiliza `node-cron` para tarefas automáticas, como:
- **Renovação de Assinaturas**: Executa diariamente para renovar automaticamente as assinaturas.
- **Notificações**: Envia lembretes automáticos para clientes sobre próximas entregas.

## Estrutura do Projeto

```plaintext
petpoints-backend/
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

## Licença

Este projeto é licenciado sob a [MIT License](LICENSE).
