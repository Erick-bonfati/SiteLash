const express = require('express');
const { body } = require('express-validator');
const { login, me } = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Email inválido'),
    body('password').isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres')
  ],
  validateRequest,
  login
);

router.get('/me', authMiddleware, me);

module.exports = router;
