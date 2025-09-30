const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const Admin = require('../models/Admin');
const auth = require('../middleware/auth');

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

    // Verificar se o admin existe
    const admin = await Admin.findOne({ email, isActive: true });
    if (!admin) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }

    // Verificar senha
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }

    // Gerar token JWT
    const payload = {
      id: admin._id,
      username: admin.username,
      role: admin.role
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || 'sua_chave_secreta_super_segura_aqui_2023', {
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
router.get('/me', auth, async (req, res) => {
  try {
    res.json({
      admin: {
        id: req.admin._id,
        username: req.admin.username,
        email: req.admin.email,
        role: req.admin.role
      }
    });
  } catch (error) {
    console.error('Erro ao obter dados do admin:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   POST /api/auth/register
// @desc    Registrar novo admin (apenas para desenvolvimento)
// @access  Public (em produção, deve ser protegido)
router.post('/register', [
  body('username').isLength({ min: 3 }).withMessage('Nome de usuário deve ter pelo menos 3 caracteres'),
  body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    // Verificar se já existe
    const existingAdmin = await Admin.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin já existe com este email ou nome de usuário' });
    }

    // Criar novo admin
    const admin = new Admin({
      username,
      email,
      password
    });

    await admin.save();

    // Gerar token
    const payload = {
      id: admin._id,
      username: admin.username,
      role: admin.role
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || 'sua_chave_secreta_super_segura_aqui_2023', {
      expiresIn: '24h'
    });

    res.status(201).json({
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

module.exports = router;
