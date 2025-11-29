const db = require('../db');

/**
 * Criar uma reserva para uma vaga
 * Requer:
 *  - usuário autenticado (req.user.id)
 *  - vaga disponível
 */
exports.criarReserva = async (req, res, next) => {
  try {
    const usuarioId = req.user?.id;
    const { vagaId } = req.params;

    if (!usuarioId) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não autenticado.',
      });
    }

    // Verifica se a vaga existe e está disponível
    const vagaRes = await db.query(
      `SELECT id, status
       FROM vagas
       WHERE id = $1`,
      [vagaId]
    );

    if (!vagaRes.rows[0]) {
      return res.status(404).json({
        success: false,
        message: 'Vaga não encontrada.',
      });
    }

    if (vagaRes.rows[0].status !== 'Disponível') {
      return res.status(400).json({
        success: false,
        message: 'A vaga já está ocupada ou reservada.',
      });
    }

    // Cria reserva
    const reservaResult = await db.query(
      `INSERT INTO reservas (usuario_id, vaga_id)
       VALUES ($1, $2)
       RETURNING id, usuario_id, vaga_id, created_at, status`,
      [usuarioId, vagaId]
    );

    // Atualiza status da vaga
    await db.query(
      `UPDATE vagas
       SET status = 'Ocupada', reservada_por = $1, data_reserva = NOW()
       WHERE id = $2`,
      [usuarioId, vagaId]
    );

    return res.status(201).json({
      success: true,
      message: 'Reserva criada com sucesso.',
      data: reservaResult.rows[0],
    });

  } catch (err) {
    next(err);
  }
};

/**
 * Listar reservas do usuário autenticado
 */
exports.minhasReservas = async (req, res, next) => {
  try {
    const usuarioId = req.user?.id;

    if (!usuarioId) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não autenticado.',
      });
    }

    const result = await db.query(
      `SELECT r.id, r.vaga_id, r.status, r.created_at,
              v.numero AS vaga_numero, v.setor, v.tipo
       FROM reservas r
       LEFT JOIN vagas v ON v.id = r.vaga_id
       WHERE r.usuario_id = $1
       ORDER BY r.created_at DESC`,
      [usuarioId]
    );

    return res.json({
      success: true,
      message: 'Reservas carregadas com sucesso.',
      data: result.rows,
    });

  } catch (err) {
    next(err);
  }
};

/**
 * Cancelar uma reserva do usuário
 */
exports.cancelarReserva = async (req, res, next) => {
  try {
    const usuarioId = req.user?.id;
    const { id } = req.params; // id da reserva

    if (!usuarioId) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não autenticado.',
      });
    }

    // Busca a reserva
    const reservaRes = await db.query(
      `SELECT id, vaga_id, usuario_id
       FROM reservas
       WHERE id = $1`,
      [id]
    );

    const reserva = reservaRes.rows[0];

    if (!reserva) {
      return res.status(404).json({
        success: false,
        message: 'Reserva não encontrada.',
      });
    }

    // Apenas o dono da reserva pode cancelar
    if (reserva.usuario_id !== usuarioId) {
      return res.status(403).json({
        success: false,
        message: 'Você não tem permissão para cancelar esta reserva.',
      });
    }

    // Deleta a reserva
    await db.query(
      `DELETE FROM reservas
       WHERE id = $1`,
      [id]
    );

    // Libera a vaga
    await db.query(
      `UPDATE vagas
       SET status = 'Disponível',
           reservada_por = NULL,
           data_reserva = NULL
       WHERE id = $1`,
      [reserva.vaga_id]
    );

    return res.json({
      success: true,
      message: 'Reserva cancelada com sucesso.',
      data: { id },
    });

  } catch (err) {
    next(err);
  }
};
