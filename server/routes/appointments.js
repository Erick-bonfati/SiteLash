const express = require('express');
const { body, validationResult } = require('express-validator');
const Appointment = require('../models/Appointment');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/appointments
// @desc    Criar novo agendamento
// @access  Public
router.post('/', [
  body('customerName').notEmpty().withMessage('Nome é obrigatório'),
  body('customerEmail').isEmail().normalizeEmail().withMessage('Email inválido'),
  body('customerPhone').notEmpty().withMessage('Telefone é obrigatório'),
  body('service').isMongoId().withMessage('ID do serviço inválido'),
  body('appointmentDate').isISO8601().withMessage('Data inválida'),
  body('appointmentTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Horário inválido'),
  body('notes').optional().isLength({ max: 300 }).withMessage('Observações muito longas')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { customerName, customerEmail, customerPhone, service, appointmentDate, appointmentTime, notes } = req.body;

    // Verificar se o serviço existe e está ativo
    const serviceData = await Product.findById(service);
    if (!serviceData || !serviceData.isActive || serviceData.category !== 'serviço') {
      return res.status(400).json({ message: 'Serviço não encontrado ou indisponível' });
    }

    // Verificar se o horário está dentro dos horários permitidos para o dia da semana
    const selectedDate = new Date(appointmentDate + 'T00:00:00');
    const dayOfWeek = selectedDate.getDay();
    
    let allowedTimes = [];
    if (dayOfWeek === 0) {
      // Domingo - fechado
      return res.status(400).json({ message: 'Não é possível agendar aos domingos - estamos fechados' });
    } else if (dayOfWeek === 6) {
      // Sábado - 3 horários: 8:00, 11:00, 14:00
      allowedTimes = ['08:00', '11:00', '14:00'];
    } else {
      // Segunda a sexta (1-5) - 4 horários: 9:00, 11:00, 15:00, 18:00
      allowedTimes = ['09:00', '11:00', '15:00', '18:00'];
    }
    
    if (!allowedTimes.includes(appointmentTime)) {
      return res.status(400).json({ 
        message: `Horário inválido. Horários disponíveis: ${allowedTimes.join(', ')}` 
      });
    }

    // Verificar se já existe agendamento no mesmo horário
    const existingAppointment = await Appointment.findOne({
      appointmentDate: new Date(appointmentDate),
      appointmentTime,
      status: { $in: ['pendente', 'confirmado'] }
    });

    if (existingAppointment) {
      return res.status(400).json({ message: 'Horário já está ocupado' });
    }

    // Verificar se a data não é no passado
    const appointmentDateTime = new Date(`${appointmentDate}T${appointmentTime}`);
    if (appointmentDateTime < new Date()) {
      return res.status(400).json({ message: 'Não é possível agendar para datas passadas' });
    }

    const appointment = new Appointment({
      customerName,
      customerEmail,
      customerPhone,
      service,
      appointmentDate: new Date(appointmentDate),
      appointmentTime,
      notes: notes || '',
      totalPrice: serviceData.price
    });

    await appointment.save();
    
    // Popular o serviço no retorno
    await appointment.populate('service', 'name description price duration');
    
    res.status(201).json(appointment);
  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   GET /api/appointments
// @desc    Obter todos os agendamentos (admin)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { status, date } = req.query;
    
    let filter = {};
    if (status) filter.status = status;
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      filter.appointmentDate = { $gte: startDate, $lt: endDate };
    }

    const appointments = await Appointment.find(filter)
      .populate('service', 'name description price duration')
      .sort({ appointmentDate: 1, appointmentTime: 1 });

    res.json(appointments);
  } catch (error) {
    console.error('Erro ao buscar agendamentos:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   GET /api/appointments/:id
// @desc    Obter agendamento por ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('service', 'name description price duration');
    
    if (!appointment) {
      return res.status(404).json({ message: 'Agendamento não encontrado' });
    }

    res.json(appointment);
  } catch (error) {
    console.error('Erro ao buscar agendamento:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   PUT /api/appointments/:id/status
// @desc    Atualizar status do agendamento
// @access  Private
router.put('/:id/status', auth, [
  body('status').isIn(['pendente', 'confirmado', 'cancelado', 'concluído']).withMessage('Status inválido')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Agendamento não encontrado' });
    }

    appointment.status = req.body.status;
    await appointment.save();
    
    await appointment.populate('service', 'name description price duration');
    
    res.json(appointment);
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   GET /api/appointments/available-times/:date
// @desc    Obter horários disponíveis para uma data
// @access  Public
router.get('/available-times/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const { serviceId } = req.query;

    if (!serviceId) {
      return res.status(400).json({ message: 'ID do serviço é obrigatório' });
    }

    // Verificar se o serviço existe
    const service = await Product.findById(serviceId);
    if (!service || !service.isActive || service.category !== 'serviço') {
      return res.status(400).json({ message: 'Serviço não encontrado' });
    }

    // Verificar o dia da semana da data selecionada
    const selectedDate = new Date(date + 'T00:00:00');
    const dayOfWeek = selectedDate.getDay(); // 0 = domingo, 1 = segunda, ..., 6 = sábado
    
    let workingHours = [];
    
    if (dayOfWeek === 0) {
      // Domingo - fechado
      workingHours = [];
    } else if (dayOfWeek === 6) {
      // Sábado - 3 horários: 8:00, 11:00, 14:00
      workingHours = ['08:00', '11:00', '14:00'];
    } else {
      // Segunda a sexta (1-5) - 4 horários: 9:00, 11:00, 15:00, 18:00
      workingHours = ['09:00', '11:00', '15:00', '18:00'];
    }

    // Buscar agendamentos existentes para a data
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);

    const existingAppointments = await Appointment.find({
      appointmentDate: { $gte: startDate, $lt: endDate },
      status: { $in: ['pendente', 'confirmado'] }
    }).select('appointmentTime');

    const occupiedTimes = existingAppointments.map(apt => apt.appointmentTime);
    const availableTimes = workingHours.filter(time => !occupiedTimes.includes(time));

    res.json({ availableTimes, serviceDuration: service.duration });
  } catch (error) {
    console.error('Erro ao buscar horários disponíveis:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

module.exports = router;
