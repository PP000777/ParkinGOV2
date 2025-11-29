-- schema.sql (Postgres) - versão otimizada do ParkingGo
-- Dei uma boa otimizada para melhor experiencia e claro, os comentarios para ficar algo mais claro....




-- ========================
-- TABELA DE USUÁRIOS
-- ========================

CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    plano VARCHAR(30) DEFAULT 'Gratuito', -- Gratuito | Premium | Ultra Plus
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);



-- ========================
-- TABELA DE VAGAS
-- ========================

CREATE TABLE IF NOT EXISTS vagas (
    id SERIAL PRIMARY KEY,
    numero VARCHAR(10) UNIQUE NOT NULL,
    setor VARCHAR(50),
    status VARCHAR(20) DEFAULT 'Disponível',   -- Disponível | Ocupada | Manutenção
    tipo VARCHAR(20) DEFAULT 'Normal',         -- Normal | PCD | Idoso | Reserva
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);



-- ========================
-- TABELA DE RESERVAS (NOVO PADRÃO IDEAL)
-- ========================

CREATE TABLE IF NOT EXISTS reservas (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    vaga_id INTEGER NOT NULL REFERENCES vagas(id) ON DELETE CASCADE,

    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    -- pending     = aguardando pagamento
    -- confirmed   = pago
    -- active      = usuário estacionou
    -- completed   = finalizado
    -- cancelled   = cancelado manualmente
    -- expired     = não pagou no prazo

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    -- Horários da reserva
    inicio TIMESTAMP NOT NULL,
    fim TIMESTAMP NOT NULL,

    -- Pagamento
    preco NUMERIC(10,2) DEFAULT 0,
    valor_pendente NUMERIC(10,2) DEFAULT 0,
    pagamento_obrigatorio BOOLEAN DEFAULT TRUE,

    -- Tempo de hold
    hold_expires_at TIMESTAMP
);



-- ========================
-- ÍNDICES IMPORTANTES
-- ========================

-- Busca reservas por vaga
CREATE INDEX IF NOT EXISTS idx_reservas_vaga_id ON reservas(vaga_id);

-- Busca reservas por status
CREATE INDEX IF NOT EXISTS idx_reservas_status ON reservas(status);

-- Busca reservas expiradas
CREATE INDEX IF NOT EXISTS idx_reservas_hold_expires ON reservas(hold_expires_at);

-- Busca rápido por usuário
CREATE INDEX IF NOT EXISTS idx_reservas_usuario_id ON reservas(usuario_id);
