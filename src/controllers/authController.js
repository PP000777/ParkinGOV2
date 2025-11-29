const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { isEmail, isNotEmpty } = require('../utils/validators');
require('dotenv').config();

const SALT_ROUNDS = 10;

/**
 * Helper: gera JWT para o usuário
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

    // 🔍 Validações
    if (!isNotEmpty(nome) || !isNotEmpty(email) || !isNotEmpty(senha)) {
      return res.status(400).json({
        success: false,
        message: 'Nome, e-mail e senha são obrigatórios.'
      });
    }

    if (!isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Formato de e-mail inválido.'
      });
    }

    if (senha.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'A senha deve ter pelo menos 6 caracteres.'
      });
    }

    // Criptografa senha
    const hashed = await bcrypt.hash(senha, SALT_ROUNDS);

    // Insere usuário
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
      data: user
    });

  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({
        success: false,
        message: 'Este e-mail já está cadastrado.'
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

    if (!isNotEmpty(email) || !isNotEmpty(senha)) {
      return res.status(400).json({
        success: false,
        message: 'E-mail e senha são obrigatórios.'
      });
    }

    if (!isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Formato de e-mail inválido.'
      });
    }

    const result = await db.query(
      'SELECT id, nome, email, senha, plano FROM usuarios WHERE email = $1',
      [email]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas.'
      });
    }

    const match = await bcrypt.compare(senha, user.senha);

    if (!match) {
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas.'
      });
    }

    // JWT
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
          plano: user.plano
        }
      }
    });

  } catch (err) {
    next(err);
  }
};
