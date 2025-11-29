const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * @route POST /auth/register
 * @desc Registra um novo usuário
 * @access Público
 */
router.post('/register', authController.register);

/**
 * @route POST /auth/login
 * @desc Realiza login e retorna token JWT
 * @access Público
 */
router.post('/login', authController.login);

module.exports = router;
