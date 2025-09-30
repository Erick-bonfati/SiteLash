const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// @route   POST /api/auth/login
// @desc    Login do admin
// @access  Public
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Buscar admin nos dados mock
    const admin = global.mockData.admins.find(a => a.email === email && a.isActive);
    if (!admin) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }

    // Verificar senha (para admin@sitelash.com a senha é admin123)
    const isMatch = email === 'admin@sitelash.com' && password === 'admin123';
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }

    // Gerar token JWT
    const payload = {
      id: admin._id,
      username: admin.username,
      role: admin.role
    };

    const token = jwt.sign(payload, 'sua_chave_secreta_super_segura_aqui_2023', {
      expiresIn: '24h'
    });

    res.json({
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   GET /api/auth/me
// @desc    Obter dados do admin logado
// @access  Private
router.get('/me', (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Token de acesso negado' });
    }

    const decoded = jwt.verify(token, 'sua_chave_secreta_super_segura_aqui_2023');
    const admin = global.mockData.admins.find(a => a._id === decoded.id && a.isActive);
    
    if (!admin) {
      return res.status(401).json({ message: 'Token inválido' });
    }

    res.json({
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    res.status(401).json({ message: 'Token inválido' });
  }
});

module.exports = router;
