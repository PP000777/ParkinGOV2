const db = require('../db');

/**
 * Lista todas as vagas
 */
exports.listar = async (req, res, next) => {
  try {
    const result = await db.query(`
      SELECT *
      FROM vagas
      ORDER BY id
    `);

    return res.json({
      success: true,
      message: 'Lista de vagas carregada com sucesso.',
      data: result.rows,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Obtém uma vaga específica
 */
exports.obter = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      'SELECT * FROM vagas WHERE id = $1',
      [id]
    );

    if (!result.rows[0]) {
      return res.status(404).json({
        success: false,
        message: 'Vaga não encontrada.',
      });
    }

    return res.json({
      success: true,
      message: 'Vaga encontrada com sucesso.',
      data: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Cria uma vaga nova
 */
exports.criar = async (req, res, next) => {
  try {
    const { numero, setor, tipo } = req.body;

    if (!numero) {
      return res.status(400).json({
        success: false,
        message: 'O campo "numero" é obrigatório.',
      });
    }

    const result = await db.query(
      `INSERT INTO vagas (numero, setor, tipo)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [numero, setor || null, tipo || 'Normal']
    );

    return res.status(201).json({
      success: true,
      message: 'Vaga criada com sucesso.',
      data: result.rows[0],
    });

  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({
        success: false,
        message: 'O número da vaga já existe.',
      });
    }
    next(err);
  }
};

/**
 * Atualiza uma vaga existente
 */
exports.atualizar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { numero, setor, status, tipo } = req.body;

    const result = await db.query(
      `UPDATE vagas SET
         numero = COALESCE($1, numero),
         setor = COALESCE($2, setor),
         status = COALESCE($3, status),
         tipo = COALESCE($4, tipo),
         updated_at = NOW()
       WHERE id = $5
       RETURNING *`,
      [numero, setor, status, tipo, id]
    );

    if (!result.rows[0]) {
      return res.status(404).json({
        success: false,
        message: 'Vaga não encontrada.',
      });
    }

    return res.json({
      success: true,
      message: 'Vaga atualizada com sucesso.',
      data: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Deleta uma vaga
 */
exports.deletar = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      'DELETE FROM vagas WHERE id = $1 RETURNING id',
      [id]
    );

    if (!result.rows[0]) {
      return res.status(404).json({
        success: false,
        message: 'Vaga não encontrada.',
      });
    }

    return res.json({
      success: true,
      message: 'Vaga deletada com sucesso.',
      data: { id },
    });

  } catch (err) {
    next(err);
  }
};

/*  
  IMPORTANTE:
  Estes métodos abaixo viram "deprecated".  
  O fluxo correto de reservas será movido para o reservationController.

  Mantemos aqui temporariamente apenas para não quebrar nada,
  mas a lógica real de reserva NÃO deve mais alterar diretamente a tabela vagas.
*/

/**
 * DEPRECATED — Reserva direta na tabela vagas (não recomendado)
 */
exports.reservar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const usuarioId = req.user?.id;

    if (!usuarioId) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não autenticado.',
      });
    }

    // Verifica status atual
    const vagaRes = await db.query(
      'SELECT id, status FROM vagas WHERE id = $1',
      [id]
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
        message: 'A vaga não está disponível para reserva.',
      });
    }

    // Atualiza status (não recomendado)
    const result = await db.query(
      `UPDATE vagas
       SET status = 'Ocupada',
           reservada_por = $1,
           data_reserva = NOW(),
           updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [usuarioId, id]
    );

    return res.json({
      success: true,
      message: 'Vaga reservada (modo legado).',
      data: result.rows[0],
    });

  } catch (err) {
    next(err);
  }
};

/**
 * DEPRECATED — Libera vaga diretamente (não recomendado)
 */
exports.liberar = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `UPDATE vagas
       SET status = 'Disponível',
           reservada_por = NULL,
           data_reserva = NULL,
           updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    if (!result.rows[0]) {
      return res.status(404).json({
        success: false,
        message: 'Vaga não encontrada.',
      });
    }

    return res.json({
      success: true,
      message: 'Vaga liberada (modo legado).',
      data: result.rows[0],
    });

  } catch (err) {
    next(err);
  }
};
