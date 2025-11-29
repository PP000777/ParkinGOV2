🚗 ParkingGo API – Backend (Node.js + Express + PostgreSQL)

API moderna, segura e otimizada para gestão de usuários, vagas de estacionamento e reservas, construída com Node.js, Express, JWT Auth, PostgreSQL e arquitetura organizada em camadas.

🧱 Tecnologias principais

Node.js + Express

PostgreSQL (com pg)

JWT para autenticação

Bcrypt para hash de senhas

Helmet + CORS para segurança

Arquitetura MVC (routes, controllers, middleware, db)

Suporte a ambientes de produção (SSL condicional no banco)

📂 Estrutura do Projeto
src/
 ├── app.js
 ├── server.js
 ├── db/
 │    └── index.js (ou db.js)
 ├── middleware/
 │    └── auth.js
 ├── controllers/
 │    ├── authController.js
 │    ├── usuarioController.js
 │    ├── vagasController.js
 │    └── reservationController.js
 ├── routes/
 │    ├── authRoutes.js
 │    ├── usuarioRoutes.js
 │    ├── vagaRoutes.js
 │    └── reservationRoutes.js
 ├── utils/
 │    └── validators.js
.env

📦 Instalação
1️⃣ Clonar o repositório
git clone https://github.com/SeuUsuario/ParkingGo-API.git
cd ParkingGo-API

2️⃣ Instalar dependências
npm install

3️⃣ Criar arquivo .env

Use o exemplo:

PORT=4000

DATABASE_URL=postgres://postgres:12345@localhost:5432/parkinggodb

JWT_SECRET=uma_chave_secreta_bem_grande_e_unica
JWT_EXPIRES_IN=7d

🗄️ Configuração do PostgreSQL

Crie o banco:

CREATE DATABASE parkinggodb;


Rodar estrutura (exemplo):

CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  senha TEXT NOT NULL,
  plano TEXT DEFAULT 'Gratuito',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE vagas (
  id SERIAL PRIMARY KEY,
  numero INT UNIQUE NOT NULL,
  status VARCHAR(20) DEFAULT 'livre'
);

CREATE TABLE reservations (
  id SERIAL PRIMARY KEY,
  usuario_id INT REFERENCES usuarios(id),
  vaga_id INT REFERENCES vagas(id),
  criado_em TIMESTAMP DEFAULT NOW()
);

▶️ Rodar o servidor
Desenvolvimento:
npm run dev

Produção:
npm start

🔐 Autenticação

Toda requisição protegida deve incluir:

Authorization: Bearer SEU_TOKEN


O token é gerado no login.

📡 Endpoints da API
👤 Auth
Método	Rota	Descrição
POST	/auth/register	Criar usuário
POST	/auth/login	Login e obter token
🧑‍💼 Usuários (Protegido)
Método	Rota	Descrição
GET	/usuarios/	Listar usuários
GET	/usuarios/:id	Obter usuário
PUT	/usuarios/:id	Atualizar
DELETE	/usuarios/:id	Deletar
🅿️ Vagas
Método	Rota	Descrição
GET	/vagas/	Listar vagas
GET	/vagas/:id	Obter vaga

Gerenciamento (somente logados):

Método	Rota	Descrição
POST	/vagas/	Criar vaga
PUT	/vagas/:id	Atualizar
DELETE	/vagas/:id	Remover
PATCH	/vagas/:id/reservar	Reservar vaga
PATCH	/vagas/:id/liberar	Liberar vaga
📅 Reservas (Protegido)
Método	Rota	Descrição
POST	/reservations/:vagaId	Criar reserva
GET	/reservations/minhas	Ver minhas reservas
DELETE	/reservations/:id	Cancelar reserva
🔨 Otimizações Implementadas

✔ Banco com SSL automático para produção
✔ Estrutura MVC clara
✔ Controllers limpos e padronizados
✔ Middleware JWT seguro
✔ Helmet + CORS otimizados para Vite/React
✔ Rotas separadas (auth, vagas, usuários, reservas)
✔ Validações utilitárias melhoradas
✔ Fluxo de reserva completo (vaga + tabela reservations)
✔ Tratamento de erros centralizado
✔ Melhor organização de arquivos
✔ Suporte a múltiplos ambientes