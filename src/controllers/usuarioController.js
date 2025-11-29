const db = require('../db');
const bcrypt = require('bcrypt');

/**
 * Lista todos os usuários
 */
exports.listar = async (req, res, next) => {
  try {
    const result = await db.query(`
      SELECT id, nome, email, plano, created_at
      FROM usuarios
      ORDER BY id
    `);

    return res.json({
      success: true,
      message: 'Lista de usuários carregada com sucesso.',
      data: result.rows,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Obtém um usuário pelo ID
 */
exports.obter = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `SELECT id, nome, email, plano, created_at 
       FROM usuarios 
       WHERE id = $1`,
      [id]
    );

    if (!result.rows[0]) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado.',
      });
    }

    return res.json({
      success: true,
      message: 'Usuário encontrado com sucesso.',
      data: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Atualiza nome ou plano de um usuário
 */
exports.atualizar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nome, plano } = req.body;

    const result = await db.query(
      `UPDATE usuarios 
       SET nome = COALESCE($1, nome),
           plano = COALESCE($2, plano),
           updated_at = NOW()
       WHERE id = $3
       RETURNING id, nome, email, plano`,
      [nome, plano, id]
    );

    if (!result.rows[0]) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado.',
      });
    }

    return res.json({
      success: true,
      message: 'Usuário atualizado com sucesso.',
      data: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Deleta um usuário pelo ID
 */
exports.deletar = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await db.query('DELETE FROM usuarios WHERE id = $1 RETURNING id', [id]);

    if (!result.rows[0]) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado.',
      });
    }

    return res.json({
      success: true,
      message: 'Usuário deletado com sucesso.',
      data: { id },
    });
  } catch (err) {
    next(err);
  }
};
