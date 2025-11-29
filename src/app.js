const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const authRoutes = require('./routes/authRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const vagaRoutes = require('./routes/vagaRoutes');
const reservationRoutes = require('./routes/reservationRoutes'); // NOVO

const app = express();

// Segurança
app.use(helmet());

// CORS liberado (bom para o React + Vite)
app.use(cors({
  origin: '*', // pode ajustar para o domínio do frontend depois
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

// JSON parser
app.use(express.json());

// Rotas
app.use('/auth', authRoutes);
app.use('/usuarios', usuarioRoutes);
app.use('/vagas', vagaRoutes);
app.use('/reservations', reservationRoutes); // NOVO

// Rota inicial
app.get('/', (req, res) => {
  res.json({
    service: 'ParkingGo API',
    status: 'ok',
    version: '2.0',
  });
});

// Middleware global de erros (sempre por último)
app.use((err, req, res, next) => {
  console.error('ERRO NO SERVIDOR:', err);

  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Erro interno no servidor.',
  });
});

module.exports = app;
