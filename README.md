```markdown
# 🚗 ParkingGo! — Backend API
> Backend RESTful em **Node.js + Express + PostgreSQL (Sequelize)** para o sistema de estacionamento inteligente **ParkingGo!** — gestão de vagas, reservas e integração com sensores. Projeto preparado para adicionar autenticação JWT e políticas de planos (ex.: Ultra Plus).

---

## 🧠 Visão Geral

O ParkingGo! fornece uma API para:

- Monitoramento em tempo real do status das vagas;
- Reserva temporária (ex.: plano Ultra Plus — 15 minutos de tolerância);
- Receber atualizações de sensores/hardware (status: `Disponível`, `Ocupada`, `Manutenção`);
- Base pronta para autenticação JWT e autorização por plano.

---

## ✨ Destaques

- Código organizado em camadas: `controllers`, `services`, `models`, `routes`.
- Regras de negócio isoladas em `services/` (fácil testabilidade).
- Script SQL (`create_db.sql`) para criar enums/tabelas + dados de teste.
- Configuração via `.env` (dotenv).
- Nodemon para dev.
---

## 🛠️ Pré-requisitos

- Node.js >= 16  
- npm >= 8  
- PostgreSQL >= 12  
- (Opcional) Docker & Docker Compose

---

## 🚀 Instalação Rápida

```bash
git clone https://github.com/seuusuario/parkinggo-backend.git
cd parkinggo-backend
npm install
cp .env.example .env
# ajuste .env conforme seu ambiente
psql -U <seu_usuario> -f create_db.sql
npm run dev   # nodemon
# ou npm start
````

---

## 🔧 Configuração (`.env`)

Exemplo (`.env.example`):

```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=parkinggodb
DB_USER=postgres
DB_PASSWORD=sua_senha_secreta

JWT_SECRET=UM_SEGREDO_MUITO_FORTE_E_ALEATORIO_PARA_JWT
```

> **Nunca** comite `.env` com credenciais reais.

---

## 🗄️ Banco de Dados

* Execute `create_db.sql` para criar tipos ENUM (`vaga_status`, `vaga_tipo`), tabelas `vagas` e `usuarios` e inserir dados de exemplo.
* Em produção, **use migrations** (ex.: `sequelize-cli` ou um sistema de migração), não `sequelize.sync({ force: true })`.

---

## 🐳 Rodando com Docker (exemplo rápido)

`docker-compose.yml` mínimo sugerido:

```yaml
version: "3.8"
services:
  db:
    image: postgres:14
    environment:
      POSTGRES_DB: parkinggodb
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: sua_senha_secreta
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  api:
    build: .
    command: npm run dev
    environment:
      - DB_HOST=db
      - DB_USER=postgres
      - DB_PASSWORD=sua_senha_secreta
      - DB_NAME=parkinggodb
    ports:
      - "3000:3000"
    depends_on:
      - db

volumes:
  pgdata:
```

---

## 📡 Endpoints Principais

Base: `http://localhost:3000`

* `GET  /` — health check
* `GET  /api/vagas` — lista todas as vagas
* `GET  /api/vagas/resumo` — resumo por setor (total / disponíveis)
* `POST /api/vagas/reservar` — reservar vaga (body: `{ vagaId, usuarioId }`)
* `PUT  /api/vagas/:id/status` — atualizar status (body: `{ status }`)

---

## 🔁 Exemplos (curl)

Listar vagas:

```bash
curl http://localhost:3000/api/vagas
```

Reservar vaga:

```bash
curl -X POST http://localhost:3000/api/vagas/reservar \
  -H "Content-Type: application/json" \
  -d '{"vagaId":1,"usuarioId":"uid_premium_1"}'
```

Atualizar status (sensor):

```bash
curl -X PUT http://localhost:3000/api/vagas/2/status \
  -H "Content-Type: application/json" \
  -d '{"status":"Disponível"}'
```

---

## 🧩 Regras de Negócio (essenciais)

* Reserva só se `status === 'Disponível'` e sem reserva ativa.
* Tempo de tolerância da reserva: **15 minutos** (constante `TEMPO_RESERVA_MINUTOS`).
* Quando sensor reporta `Disponível`, reserva é limpa (`reservada_por_usuario_id = null`, `expira_em = null`).
* Códigos HTTP usados: `200`, `400`, `404`, `409`, `500`.

---

## 🔒 Segurança & Próximos Passos

Prioridades:

1. Implementar **autenticação JWT** (login, refresh tokens).
2. Autorização por plano: somente `Ultra Plus` pode reservar.
3. Proteger rota de sensores (`/api/vagas/:id/status`) com token/assinatura específica do hardware.
4. Input validation (Joi/Zod), rate limiting, CORS, logs estruturados e monitoramento (Sentry/Prometheus).

> Posso implementar um fluxo básico de JWT + middleware de autorização agora, se quiser.

---

## 🧪 Testes & CI

* Recomendado criar testes unitários para `services/` (reserva/expiração) e `controllers/`.
* Ex.: GitHub Actions com Node matrix (16, 18), execução de lint + testes.

---

## 🤝 Contribuição

1. Fork → branch `feature/<nome>` → PR claro com descrição e testes.
2. Use `eslint` + `prettier` para manter consistência de estilo.
3. Documente alterações no `CHANGELOG.md`.


