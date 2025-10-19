const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const SALT_ROUNDS = 10;

exports.register = async (req, res, next) => {
  try {
    const { nome, email, senha, plano } = req.body;
    if (!nome || !email || !senha) return res.status(400).json({ error: 'nome, email e senha são obrigatórios' });

    const hashed = await bcrypt.hash(senha, SALT_ROUNDS);
    const result = await db.query(
      'INSERT INTO usuarios (nome, email, senha, plano) VALUES ($1, $2, $3, $4) RETURNING id, nome, email, plano, created_at',
      [nome, email, hashed, plano || 'Gratuito']
    );

    const user = result.rows[0];
    res.status(201).json({ user });
  } catch (err) {
    if (err.code === '23505') { // unique_violation
      return res.status(400).json({ error: 'E-mail já cadastrado' });
    }
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) return res.status(400).json({ error: 'email e senha são obrigatórios' });

    const result = await db.query('SELECT id, nome, email, senha, plano FROM usuarios WHERE email = $1', [email]);
    const user = result.rows[0];
    if (!user) return res.status(401).json({ error: 'Credenciais inválidas' });

    const match = await bcrypt.compare(senha, user.senha);
    if (!match) return res.status(401).json({ error: 'Credenciais inválidas' });

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

    res.json({ token, user: { id: user.id, nome: user.nome, email: user.email, plano: user.plano } });
  } catch (err) {
    next(err);
  }
};
