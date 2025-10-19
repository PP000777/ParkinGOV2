const db = require('../db');

exports.listar = async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM vagas ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

exports.obter = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM vagas WHERE id = $1', [id]);
    if (!result.rows[0]) return res.status(404).json({ error: 'Vaga não encontrada' });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.criar = async (req, res, next) => {
  try {
    const { numero, setor, tipo } = req.body;
    if (!numero) return res.status(400).json({ error: 'numero é obrigatório' });

    const result = await db.query(
      'INSERT INTO vagas (numero, setor, tipo) VALUES ($1, $2, $3) RETURNING *',
      [numero, setor || null, tipo || 'Normal']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(400).json({ error: 'Número da vaga já existe' });
    next(err);
  }
};

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
       WHERE id = $5 RETURNING *`,
      [numero, setor, status, tipo, id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Vaga não encontrada' });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.deletar = async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM vagas WHERE id = $1', [id]);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

/*
 Reservar vaga:
 - Requer autenticação (req.user.id)
 - Só permite reservar se status == 'Disponível'
*/
exports.reservar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const usuarioId = req.user && req.user.id;
    if (!usuarioId) return res.status(401).json({ error: 'Usuário não autenticado' });

    // Verifica status
    const vagaRes = await db.query('SELECT id, status FROM vagas WHERE id = $1', [id]);
    if (!vagaRes.rows[0]) return res.status(404).json({ error: 'Vaga não encontrada' });

    if (vagaRes.rows[0].status !== 'Disponível') {
      return res.status(400).json({ error: 'Vaga não está disponível para reserva' });
    }

    const result = await db.query(
      'UPDATE vagas SET status = $1, reservada_por = $2, data_reserva = NOW(), updated_at = NOW() WHERE id = $3 RETURNING *',
      ['Ocupada', usuarioId, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

/*
 Liberar vaga (tornar Disponível)
 - Requer autenticação
 - Se liberada, remove reservada_por/data_reserva e seta status Disponível
*/
exports.liberar = async (req, res, next) => {
  try {
    const { id } = req.params;
    // opcional: verificar se req.user.id é quem reservou (aqui deixamos aberto para gestor)
    const result = await db.query(
      'UPDATE vagas SET status = $1, reservada_por = NULL, data_reserva = NULL, updated_at = NOW() WHERE id = $2 RETURNING *',
      ['Disponível', id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Vaga não encontrada' });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};
