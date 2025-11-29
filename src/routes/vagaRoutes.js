const express = require('express');
const router = express.Router();

const vagasController = require('../controllers/vagasController');
const auth = require('../middleware/auth');

/**
 * ROTAS DE VAGAS
 * ----------------------------------------
 * GET    /vagas/          → Listar todas as vagas (público)
 * GET    /vagas/:id       → Obter vaga específica (público)
 *
 * POST   /vagas/          → Criar vaga        (restrito a usuário autenticado)
 * PUT    /vagas/:id       → Atualizar vaga    (restrito)
 * DELETE /vagas/:id       → Deletar vaga      (restrito)
 *
 * ⚠️ Rotas de reservar/liberar foram depreciadas.
 * O fluxo correto está agora em:
 *    /reservations/
 */

// Rotas públicas
router.get('/', vagasController.listar);
router.get('/:id', vagasController.obter);

// Rotas protegidas (gestor/admin no futuro)
router.post('/', auth, vagasController.criar);
router.put('/:id', auth, vagasController.atualizar);
router.delete('/:id', auth, vagasController.deletar);

/**
 * ⚠️ LEGADO (DEPRECATED)
 * Essas rotas continuam existindo apenas para compatibilidade.
 * Mas TODA lógica deve migrar para reservationController.
 */
router.patch('/:id/reservar', auth, vagasController.reservar);   // não recomendado
router.patch('/:id/liberar', auth, vagasController.liberar);     // não recomendado

module.exports = router;
