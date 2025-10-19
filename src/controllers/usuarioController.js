const db = require('../db');
const bcrypt = require('bcrypt');

exports.listar = async (req, res, next) => {
  try {
    const result = await db.query('SELECT id, nome, email, plano, created_at FROM usuarios ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

exports.obter = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT id, nome, email, plano, created_at FROM usuarios WHERE id = $1', [id]);
    if (!result.rows[0]) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.atualizar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nome, plano } = req.body;
    const result = await db.query('UPDATE usuarios SET nome = COALESCE($1, nome), plano = COALESCE($2, plano), updated_at = NOW() WHERE id = $3 RETURNING id, nome, email, plano', [nome, plano, id]);
    if (!result.rows[0]) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.deletar = async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM usuarios WHERE id = $1', [id]);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
