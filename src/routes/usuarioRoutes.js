const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const auth = require('../middleware/auth');

// Rotas públicas/privadas conforme desejar
router.get('/', auth, usuarioController.listar);
router.get('/:id', auth, usuarioController.obter);
router.put('/:id', auth, usuarioController.atualizar);
router.delete('/:id', auth, usuarioController.deletar);

module.exports = router;
