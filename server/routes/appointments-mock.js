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

router.post('/', [
  body('customerName').notEmpty().withMessage('Nome é obrigatório'),
  body('customerEmail').isEmail().normalizeEmail().withMessage('Email inválido'),
  body('customerPhone').notEmpty().withMessage('Telefone é obrigatório'),
  body('service').notEmpty().withMessage('ID do serviço é obrigatório'),
  body('appointmentDate').isISO8601().withMessage('Data inválida'),
  body('appointmentTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Horário inválido'),
  body('notes').optional().isLength({ max: 300 }).withMessage('Observações muito longas')
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { customerName, customerEmail, customerPhone, service, appointmentDate, appointmentTime, notes } = req.body;

    // Verificar se o serviço existe e está ativo
    const serviceData = global.mockData.products.find(p => p._id === service);
    if (!serviceData || !serviceData.isActive || serviceData.category !== 'serviço') {
      return res.status(400).json({ message: 'Serviço não encontrado ou indisponível' });
    }

    // Verificar se já existe agendamento conflitante no mesmo horário
    const targetDate = new Date(appointmentDate).toISOString().split('T')[0];
    const existingAppointments = global.mockData.appointments.filter(apt => {
      const aptDate = apt.appointmentDate.toISOString().split('T')[0];
      return aptDate === targetDate && ['pendente', 'confirmado'].includes(apt.status);
    });

    // Verificar se o horário está dentro dos períodos permitidos
    const [timeHour, timeMinute] = appointmentTime.split(':').map(Number);
    const timeInMinutes = timeHour * 60 + timeMinute;
    const serviceDurationInMinutes = serviceData.duration;
    
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

    const hasConflict = existingAppointments.some(apt => {
      const [aptHour, aptMinute] = apt.appointmentTime.split(':').map(Number);
      const aptTimeInMinutes = aptHour * 60 + aptMinute;
      const aptDurationInMinutes = apt.service ? 
        global.mockData.products.find(p => p._id === apt.service)?.duration || 30 : 30;
      
      // Verificar sobreposição de horários
      const aptEndTime = aptTimeInMinutes + aptDurationInMinutes;
      const timeEndTime = timeInMinutes + serviceDurationInMinutes;
      
      return timeInMinutes < aptEndTime && timeEndTime > aptTimeInMinutes;
    });

    if (hasConflict) {
      return res.status(400).json({ message: 'Horário já está ocupado ou conflita com outro agendamento' });
    }

    // Verificar se a data não é no passado
    const appointmentDateTime = new Date(`${appointmentDate}T${appointmentTime}`);
    if (appointmentDateTime < new Date()) {
      return res.status(400).json({ message: 'Não é possível agendar para datas passadas' });
    }

    const newAppointment = {
      _id: dataManager.generateId(global.mockData.appointments),
      customerName,
      customerEmail,
      customerPhone,
      service: serviceData._id,
      appointmentDate: new Date(appointmentDate),
      appointmentTime,
      notes: notes || '',
      totalPrice: serviceData.price,
      status: 'pendente',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    global.mockData.appointments.push(newAppointment);
    
    // Salvar no arquivo JSON
    dataManager.saveAppointments(global.mockData.appointments);
    
    // Adicionar dados do serviço no retorno
    const response = {
      ...newAppointment,
      service: serviceData
    };
    
    res.status(201).json(response);
  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

router.get('/', auth, (req, res) => {
  try {
    const { status, date } = req.query;
    
    let appointments = [...global.mockData.appointments];
    
    if (status) {
      appointments = appointments.filter(apt => apt.status === status);
    }
    
    if (date) {
      const targetDate = new Date(date).toISOString().split('T')[0];
      appointments = appointments.filter(apt => 
        apt.appointmentDate.toISOString().split('T')[0] === targetDate
      );
    }

    // Adicionar dados do serviço
    const appointmentsWithService = appointments.map(apt => {
      const service = global.mockData.products.find(p => p._id === apt.service);
      return {
        ...apt,
        service: service || { name: 'Serviço não encontrado' }
      };
    });

    res.json(appointmentsWithService);
  } catch (error) {
    console.error('Erro ao buscar agendamentos:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

router.get('/:id', auth, (req, res) => {
  try {
    const appointment = global.mockData.appointments.find(apt => apt._id === req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Agendamento não encontrado' });
    }

    const service = global.mockData.products.find(p => p._id === appointment.service);
    const response = {
      ...appointment,
      service: service || { name: 'Serviço não encontrado' }
    };

    res.json(response);
  } catch (error) {
    console.error('Erro ao buscar agendamento:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

router.put('/:id/status', auth, [
  body('status').isIn(['pendente', 'confirmado', 'cancelado', 'concluído']).withMessage('Status inválido')
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const appointmentIndex = global.mockData.appointments.findIndex(apt => apt._id === req.params.id);
    
    if (appointmentIndex === -1) {
      return res.status(404).json({ message: 'Agendamento não encontrado' });
    }

    const appointment = global.mockData.appointments[appointmentIndex];
    appointment.status = req.body.status;
    appointment.updatedAt = new Date();
    
    // Salvar no arquivo JSON
    dataManager.saveAppointments(global.mockData.appointments);
    
    const service = global.mockData.products.find(p => p._id === appointment.service);
    const response = {
      ...appointment,
      service: service || { name: 'Serviço não encontrado' }
    };
    
    res.json(response);
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

router.get('/available-times/:date', (req, res) => {
  try {
    const { date } = req.params;
    const { serviceId } = req.query;

    if (!serviceId) {
      return res.status(400).json({ message: 'ID do serviço é obrigatório' });
    }

    // Verificar se o serviço existe
    const service = global.mockData.products.find(p => p._id === serviceId);
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
    const targetDate = new Date(date).toISOString().split('T')[0];
    const existingAppointments = global.mockData.appointments.filter(apt => {
      const aptDate = apt.appointmentDate.toISOString().split('T')[0];
      return aptDate === targetDate && ['pendente', 'confirmado'].includes(apt.status);
    });

    // Verificar conflitos considerando a duração do serviço
    const isTimeAvailable = (time) => {
      const [timeHour, timeMinute] = time.split(':').map(Number);
      const timeInMinutes = timeHour * 60 + timeMinute;
      const serviceDurationInMinutes = service.duration;
      
      // Verificar se o horário está dentro de um período ocupado
      for (const apt of existingAppointments) {
        const [aptHour, aptMinute] = apt.appointmentTime.split(':').map(Number);
        const aptTimeInMinutes = aptHour * 60 + aptMinute;
        const aptDurationInMinutes = apt.service ? 
          global.mockData.products.find(p => p._id === apt.service)?.duration || 30 : 30;
        
        // Verificar sobreposição de horários
        const aptEndTime = aptTimeInMinutes + aptDurationInMinutes;
        const timeEndTime = timeInMinutes + serviceDurationInMinutes;
        
        if (timeInMinutes < aptEndTime && timeEndTime > aptTimeInMinutes) {
          return false; // Conflito de horário
        }
      }
      return true;
    };

    const availableTimes = workingHours.filter(time => isTimeAvailable(time));

    res.json({ availableTimes, serviceDuration: service.duration });
  } catch (error) {
    console.error('Erro ao buscar horários disponíveis:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

module.exports = router;
