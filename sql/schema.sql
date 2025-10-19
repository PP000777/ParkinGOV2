-- schema.sql (Postgres)

CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    plano VARCHAR(20) DEFAULT 'Gratuito',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vagas (
    id SERIAL PRIMARY KEY,
    numero VARCHAR(10) UNIQUE NOT NULL,
    setor VARCHAR(50),
    status VARCHAR(20) DEFAULT 'Disponível', -- Disponível | Ocupada | Manutenção
    tipo VARCHAR(20) DEFAULT 'Normal',       -- Normal | PCD | Idoso | Reserva
    reservada_por INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
    data_reserva TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
