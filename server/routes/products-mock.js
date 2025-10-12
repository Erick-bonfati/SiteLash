const express = require('express');
const { body, validationResult } = require('express-validator');
const dataManager = require('../utils/dataManager');

const router = express.Router();

// Middleware de autenticação simples
const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Token de acesso negado' });
    }

    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, 'sua_chave_secreta_super_segura_aqui_2023');
    const admin = global.mockData.admins.find(a => a._id === decoded.id && a.isActive);
    
    if (!admin) {
      return res.status(401).json({ message: 'Token inválido' });
    }

    req.admin = admin;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido' });
  }
};

router.get('/', (req, res) => {
  try {
    const products = global.mockData.products.filter(p => p.isActive);
    res.json(products);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

router.get('/all', auth, (req, res) => {
  try {
    const products = [...global.mockData.products];
    res.json(products);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

router.get('/:id', (req, res) => {
  try {
    const product = global.mockData.products.find(p => p._id === req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Produto/serviço não encontrado' });
    }

    res.json(product);
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

router.post('/', auth, [
  body('name').notEmpty().withMessage('Nome é obrigatório'),
  body('description').notEmpty().withMessage('Descrição é obrigatória'),
  body('price').isNumeric().withMessage('Preço deve ser um número'),
  body('materialCost').optional().isNumeric().withMessage('Custo de material deve ser um número'),
  body('category').isIn(['produto', 'serviço']).withMessage('Categoria inválida'),
  body('duration').optional().isInt({ min: 15 }).withMessage('Duração deve ser pelo menos 15 minutos')
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, price, materialCost, category, duration, image } = req.body;

    // Validar duração para serviços
    if (category === 'serviço' && !duration) {
      return res.status(400).json({ message: 'Duração é obrigatória para serviços' });
    }

    const newProduct = {
      _id: dataManager.generateId(global.mockData.products),
      name,
      description,
      price: parseFloat(price),
      materialCost: parseFloat(materialCost) || 0,
      category,
      duration: category === 'serviço' ? parseInt(duration) : undefined,
      image: image || '',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    global.mockData.products.push(newProduct);
    
    // Salvar no arquivo JSON
    dataManager.saveProducts(global.mockData.products);
    
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

router.put('/:id', auth, [
  body('name').optional().notEmpty().withMessage('Nome não pode estar vazio'),
  body('description').optional().notEmpty().withMessage('Descrição não pode estar vazia'),
  body('price').optional().isNumeric().withMessage('Preço deve ser um número'),
  body('category').optional().isIn(['produto', 'serviço']).withMessage('Categoria inválida'),
  body('duration').optional().isInt({ min: 15 }).withMessage('Duração deve ser pelo menos 15 minutos')
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const productIndex = global.mockData.products.findIndex(p => p._id === req.params.id);
    
    if (productIndex === -1) {
      return res.status(404).json({ message: 'Produto/serviço não encontrado' });
    }

    const product = global.mockData.products[productIndex];
    const { name, description, price, category, duration, image, isActive } = req.body;

    // Atualizar campos
    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = parseFloat(price);
    if (category !== undefined) product.category = category;
    if (duration !== undefined) product.duration = parseInt(duration);
    if (image !== undefined) product.image = image;
    if (isActive !== undefined) product.isActive = isActive;
    
    product.updatedAt = new Date();

    // Salvar no arquivo JSON
    dataManager.saveProducts(global.mockData.products);

    res.json(product);
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

router.delete('/:id', auth, (req, res) => {
  try {
    const productIndex = global.mockData.products.findIndex(p => p._id === req.params.id);
    
    if (productIndex === -1) {
      return res.status(404).json({ message: 'Produto/serviço não encontrado' });
    }

    global.mockData.products.splice(productIndex, 1);
    
    // Salvar no arquivo JSON
    dataManager.saveProducts(global.mockData.products);
    
    res.json({ message: 'Produto/serviço deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar produto:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

module.exports = router;
