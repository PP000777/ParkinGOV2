-- seed.sql

INSERT INTO usuarios (nome, email, senha, plano)
VALUES
('Ruan Motorista Premium', 'ruan.premium@parkinggo.com', '$2b$10$replace_with_hashed_pw', 'Ultra Plus'),
('Pedro Motorista', 'pedro.normal@parkinggo.com', '$2b$10$replace_with_hashed_pw', 'Gratuito')
ON CONFLICT (email) DO NOTHING;

-- OBS: iremos criar contas reais via endpoint /auth/register (ou gerar hash localmente)
INSERT INTO vagas (numero, setor, status, tipo) VALUES
('T01', 'Térreo', 'Disponível', 'Reserva'),
('T02', 'Térreo', 'Ocupada', 'Normal'),
('T03', 'Térreo', 'Disponível', 'Normal'),
('S01', 'Subsolo', 'Disponível', 'PCD'),
('S02', 'Subsolo', 'Ocupada', 'Normal')
ON CONFLICT (numero) DO NOTHING;
