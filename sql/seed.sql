-- seed.sql
-- Popula o banco com usuários e vagas iniciais para desenvolvimento/testes.
-- IMPORTANTE: As senhas aqui são placeholders e devem ser substituídas por hashes reais gerados em /auth/register.

---------------------------------------------------------
-- 👤 SEED DE USUÁRIOS
---------------------------------------------------------

INSERT INTO usuarios (nome, email, senha, plano)
VALUES
    -- Usuário Premium para testar benefícios (desconto, prioridade etc.)
    ('Ruan Motorista Premium', 'ruan.premium@parkinggo.com', '$2b$10$replace_with_hashed_pw', 'Ultra Plus'),

    -- Usuário padrão
    ('Pedro Motorista', 'pedro.normal@parkinggo.com', '$2b$10$replace_with_hashed_pw', 'Gratuito')
ON CONFLICT (email) DO NOTHING; -- Evita erro se o seed for executado mais de uma vez


---------------------------------------------------------
-- 🅿️ SEED DE VAGAS
---------------------------------------------------------
-- Cada vaga tem: número, setor, status atual e tipo.
-- status: Disponível | Ocupada | Manutenção
-- tipo: Normal | PCD | Idoso | Reserva

INSERT INTO vagas (numero, setor, status, tipo)
VALUES
    -- Vaga reservável (para testes do fluxo de reservas)
    ('T01', 'Térreo', 'Disponível', 'Reserva'),

    -- Ocupada para validar mensagens e bloqueios
    ('T02', 'Térreo', 'Ocupada', 'Normal'),

    -- Vaga comum liberada
    ('T03', 'Térreo', 'Disponível', 'Normal'),

    -- Vaga PCD livre
    ('S01', 'Subsolo', 'Disponível', 'PCD'),

    -- Ocupada no subsolo
    ('S02', 'Subsolo', 'Ocupada', 'Normal')
ON CONFLICT (numero) DO NOTHING; -- Evita erro por duplicação ao rodar novamente
