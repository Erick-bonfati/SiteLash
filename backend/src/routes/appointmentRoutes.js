const express = require('express');
const { body } = require('express-validator');
const {
  create,
  list,
  findOne,
  updateStatus,
  availableTimes
} = require('../controllers/appointmentController');
const authMiddleware = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');
const { appointmentLimiter } = require('../middleware/rateLimiters');

const router = express.Router();

const baseValidations = [
  body('customerName').notEmpty().withMessage('Nome é obrigatório'),
  body('customerEmail').isEmail().withMessage('Email inválido'),
  body('customerPhone').notEmpty().withMessage('Telefone é obrigatório'),
  body('service').notEmpty().withMessage('ID do serviço é obrigatório'),
  body('appointmentDate').isISO8601().withMessage('Data inválida'),
  body('appointmentTime')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Horário inválido'),
  body('notes').optional().isLength({ max: 300 }).withMessage('Observações muito longas')
];

router.post('/', appointmentLimiter, baseValidations, validateRequest, create);
router.get('/', authMiddleware, list);
router.get('/available-times/:date', appointmentLimiter, availableTimes);
router.get('/:id', authMiddleware, findOne);
router.put(
  '/:id/status',
  authMiddleware,
  [body('status').isIn(['pendente', 'confirmado', 'cancelado', 'concluído']).withMessage('Status inválido')],
  validateRequest,
  updateStatus
);

module.exports = router;
