const express = require('express');
const router = express.Router();

const usuarioController = require('../controllers/usuarioController');
const auth = require('../middleware/auth');

/**
 * ROTAS DE USUÁRIOS
 * -------------------------------
 * GET    /usuarios/        → Listar todos os usuários (somente autenticado)
 * GET    /usuarios/:id     → Obter usuário por ID
 * PUT    /usuarios/:id     → Atualizar dados do usuário
 * DELETE /usuarios/:id     → Deletar usuário
 *
 * Todas exigem autenticação — ajuste se quiser permitir algo público.
 */

// Listar todos
router.get('/', auth, usuarioController.listar);

// Obter usuário pelo ID
router.get('/:id', auth, usuarioController.obter);

// Atualizar usuário
router.put('/:id', auth, usuarioController.atualizar);

// Deletar usuário
router.delete('/:id', auth, usuarioController.deletar);

module.exports = router;
