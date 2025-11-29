# ParkingGo API – Backend

API REST para gerenciamento de vagas, usuários e reservas de estacionamento.  
Desenvolvida com **Node.js**, **Express**, **PostgreSQL**, **JWT** e arquitetura organizada em camadas.

---

## 1. Tecnologias

- Node.js  
- Express  
- PostgreSQL (pg)  
- JWT  
- Bcrypt  
- Helmet  
- CORS  
- Dotenv  
- Arquitetura MVC  

---

## 2. Como rodar o projeto

### Clonar o repositório
```bash
git clone https://github.com/PP000777/ParkinGOV2
cd ParkinGOV2
```

### Instalar dependências
```bash
npm install
```

### Criar arquivo `.env`
Use como referência o `.env.example`:

```
PORT=4000
DATABASE_URL=postgres://postgres:12345@localhost:5432/parkinggodb
JWT_SECRET=sua_chave_unica
JWT_EXPIRES_IN=7d
```

---

## 3. Banco de dados

### Criar banco
```sql
CREATE DATABASE parkinggodb;
```

### Estruturas necessárias
```sql
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  senha TEXT NOT NULL,
  plano TEXT DEFAULT 'Gratuito',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE vagas (
  id SERIAL PRIMARY KEY,
  numero INT UNIQUE NOT NULL,
  setor TEXT,
  status VARCHAR(20) DEFAULT 'Disponível',
  tipo VARCHAR(20) DEFAULT 'Normal',
  reservada_por INT,
  data_reserva TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE reservations (
  id SERIAL PRIMARY KEY,
  usuario_id INT REFERENCES usuarios(id),
  vaga_id INT REFERENCES vagas(id),
  criado_em TIMESTAMP DEFAULT NOW()
);
```

---

## 4. Scripts

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm start
```

---

## 5. Estrutura do projeto

```
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
```

---

## 6. Autenticação

A API usa JWT.  
Em rotas protegidas, envie:

```
Authorization: Bearer SEU_TOKEN
```

---

## 7. Rotas da API

### Auth
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/auth/register` | Registrar usuário |
| POST | `/auth/login` | Login e geração de token |

---

### Usuários *(protected)*  
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/usuarios/` | Listar usuários |
| GET | `/usuarios/:id` | Obter usuário |
| PUT | `/usuarios/:id` | Atualizar |
| DELETE | `/usuarios/:id` | Remover |

---

### Vagas
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/vagas/` | Listar vagas |
| GET | `/vagas/:id` | Obter vaga |
| POST | `/vagas/` | Criar vaga *(auth)* |
| PUT | `/vagas/:id` | Atualizar vaga *(auth)* |
| DELETE | `/vagas/:id` | Remover vaga *(auth)* |
| PATCH | `/vagas/:id/reservar` | Reservar vaga *(legacy)* |
| PATCH | `/vagas/:id/liberar` | Liberar vaga *(legacy)* |

---

### Reservas (modelo novo)
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/reservations/:vagaId` | Criar reserva |
| GET | `/reservations/minhas` | Minhas reservas |
| DELETE | `/reservations/:id` | Cancelar reserva |

---

## 8. Implementado

- Autenticação JWT completa  
- CRUD de usuários  
- CRUD de vagas  
- Sistema **novo** de reservas usando tabela `reservations`  
- Middleware global de erros  
- Middleware de autenticação  
- SSL automático em produção  
- Separação completa entre controllers/routes  
- Validações centrais básicas  

---

## 9. Melhorias sugeridas

- Permissões por papéis (admin/usuário)  
- Swagger para documentação  
- Rate limiting  
- Logs (Winston)  

---

Pronto para uso e integração com o frontend React + Vite.
