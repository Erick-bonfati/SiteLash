const express = require('express');
const { body } = require('express-validator');
const {
  getPublicProducts,
  getAllProducts,
  getProduct,
  createNewProduct,
  updateExistingProduct,
  removeProduct
} = require('../controllers/productController');
const authMiddleware = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router.get('/', getPublicProducts);
router.get('/all', authMiddleware, getAllProducts);
router.get('/:id', getProduct);

const productValidators = [
  body('name').notEmpty().withMessage('Nome é obrigatório'),
  body('description').notEmpty().withMessage('Descrição é obrigatória'),
  body('price').isNumeric().withMessage('Preço deve ser um número'),
  body('materialCost').optional().isNumeric().withMessage('Custo de material deve ser um número'),
  body('category').isIn(['produto', 'serviço']).withMessage('Categoria inválida'),
  body('duration')
    .if(body('category').equals('serviço'))
    .isInt({ min: 15 })
    .withMessage('Duração deve ser pelo menos 15 minutos')
];

const productUpdateValidators = [
  body('name').optional().notEmpty().withMessage('Nome não pode estar vazio'),
  body('description').optional().notEmpty().withMessage('Descrição não pode estar vazia'),
  body('price').optional().isNumeric().withMessage('Preço deve ser um número'),
  body('materialCost').optional().isNumeric().withMessage('Custo de material deve ser um número'),
  body('category').optional().isIn(['produto', 'serviço']).withMessage('Categoria inválida'),
  body('duration').optional().isInt({ min: 15 }).withMessage('Duração deve ser pelo menos 15 minutos')
];

router.post('/', authMiddleware, productValidators, validateRequest, createNewProduct);
router.put('/:id', authMiddleware, productUpdateValidators, validateRequest, updateExistingProduct);
router.delete('/:id', authMiddleware, removeProduct);

module.exports = router;
