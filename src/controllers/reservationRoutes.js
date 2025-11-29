const express = require('express');
const router = express.Router();

const reservationController = require('../controllers/reservationController');
const auth = require('../middleware/auth'); // garante que só usuários logados podem reservar

/**
 * Rotas de Reservas
 * -----------------
 * /reservations/
 *      POST /:vagaId       → Criar reserva
 *      GET  /minhas        → Listar reservas do usuário autenticado
 *      DELETE /:id         → Cancelar reserva específica
 */

// Criar nova reserva
router.post('/:vagaId', auth, reservationController.criarReserva);

// Listar reservas do usuário logado
router.get('/minhas', auth, reservationController.listarMinhasReservas);

// Cancelar reserva
router.delete('/:id', auth, reservationController.cancelarReserva);

module.exports = router;
