const express = require('express');
const router = express.Router();
const vagasController = require('../controllers/vagasController');
const auth = require('../middleware/auth');

router.get('/', vagasController.listar);
router.get('/:id', vagasController.obter);

router.post('/', auth, vagasController.criar); // criar vaga (gestor)
router.put('/:id', auth, vagasController.atualizar); // atualizar vaga (gestor)
router.delete('/:id', auth, vagasController.deletar); // deletar vaga (gestor)

/* Reservar / liberar */
router.patch('/:id/reservar', auth, vagasController.reservar);
router.patch('/:id/liberar', auth, vagasController.liberar);

module.exports = router;
