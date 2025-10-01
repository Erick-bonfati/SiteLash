const express = require('express');
const { body, validationResult } = require('express-validator');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/products
// @desc    Obter todos os produtos/serviços ativos
// @access  Public
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   GET /api/products/all
// @desc    Obter todos os produtos/serviços (admin)
// @access  Private
router.get('/all', auth, async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   GET /api/products/:id
// @desc    Obter produto/serviço por ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Produto/serviço não encontrado' });
    }

    res.json(product);
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   POST /api/products
// @desc    Criar novo produto/serviço
// @access  Private
router.post('/', auth, [
  body('name').notEmpty().withMessage('Nome é obrigatório'),
  body('description').notEmpty().withMessage('Descrição é obrigatória'),
  body('price').isNumeric().withMessage('Preço deve ser um número'),
  body('materialCost').optional().isNumeric().withMessage('Custo de material deve ser um número'),
  body('category').isIn(['produto', 'serviço']).withMessage('Categoria inválida'),
  body('duration').optional().isInt({ min: 15 }).withMessage('Duração deve ser pelo menos 15 minutos')
], async (req, res) => {
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

    const product = new Product({
      name,
      description,
      price,
      materialCost: materialCost || 0,
      category,
      duration: category === 'serviço' ? duration : undefined,
      image: image || ''
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   PUT /api/products/:id
// @desc    Atualizar produto/serviço
// @access  Private
router.put('/:id', auth, [
  body('name').optional().notEmpty().withMessage('Nome não pode estar vazio'),
  body('description').optional().notEmpty().withMessage('Descrição não pode estar vazia'),
  body('price').optional().isNumeric().withMessage('Preço deve ser um número'),
  body('materialCost').optional().isNumeric().withMessage('Custo de material deve ser um número'),
  body('category').optional().isIn(['produto', 'serviço']).withMessage('Categoria inválida'),
  body('duration').optional().isInt({ min: 15 }).withMessage('Duração deve ser pelo menos 15 minutos')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Produto/serviço não encontrado' });
    }

    const { name, description, price, materialCost, category, duration, image, isActive } = req.body;

    // Atualizar campos
    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (materialCost !== undefined) product.materialCost = materialCost;
    if (category !== undefined) product.category = category;
    if (duration !== undefined) product.duration = duration;
    if (image !== undefined) product.image = image;
    if (isActive !== undefined) product.isActive = isActive;

    await product.save();
    res.json(product);
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   DELETE /api/products/:id
// @desc    Deletar produto/serviço
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Produto/serviço não encontrado' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Produto/serviço deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar produto:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

module.exports = router;
