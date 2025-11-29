const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const SALT_ROUNDS = 10;

/**
 * Helper: Gera JWT para usuário
 */
function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

/**
 * Registro de usuário
 */
exports.register = async (req, res, next) => {
  try {
    const { nome, email, senha, plano } = req.body;

    // Validação básica
    if (!nome || !email || !senha) {
      return res.status(400).json({
        success: false,
        message: 'Nome, e-mail e senha são obrigatórios.',
      });
    }

    // Hash da senha
    const hashed = await bcrypt.hash(senha, SALT_ROUNDS);

    const result = await db.query(
      `INSERT INTO usuarios (nome, email, senha, plano)
       VALUES ($1, $2, $3, $4)
       RETURNING id, nome, email, plano, created_at`,
      [nome, email, hashed, plano || 'Gratuito']
    );

    const user = result.rows[0];

    return res.status(201).json({
      success: true,
      message: 'Usuário registrado com sucesso!',
      data: user,
    });

  } catch (err) {
    // Email duplicado
    if (err.code === '23505') {
      return res.status(400).json({
        success: false,
        message: 'E-mail já cadastrado.',
      });
    }

    next(err);
  }
};

/**
 * Login de usuário
 */
exports.login = async (req, res, next) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({
        success: false,
        message: 'E-mail e senha são obrigatórios.',
      });
    }

    // Busca usuário pelo e-mail
    const result = await db.query(
      'SELECT id, nome, email, senha, plano FROM usuarios WHERE email = $1',
      [email]
    );

    const user = result.rows[0];
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas.',
      });
    }

    // Compara senhas
    const match = await bcrypt.compare(senha, user.senha);
    if (!match) {
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas.',
      });
    }

    // Gera JWT
    const token = generateToken(user);

    return res.json({
      success: true,
      message: 'Login realizado com sucesso!',
      data: {
        token,
        user: {
          id: user.id,
          nome: user.nome,
          email: user.email,
          plano: user.plano,
        },
      },
    });

  } catch (err) {
    next(err);
  }
};
