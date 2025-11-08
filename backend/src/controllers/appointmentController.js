const {
  createAppointment,
  listAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  getAvailableTimes
} = require('../services/appointmentService');
const { sendAppointmentConfirmation } = require('../services/emailService');

const create = (req, res, next) => {
  try {
    const appointment = createAppointment(req.body);
    res.status(201).json(appointment);
    sendAppointmentConfirmation(appointment);
  } catch (error) {
    next(error);
  }
};

const list = (req, res, next) => {
  try {
    const appointments = listAppointments(req.query);
    res.json(appointments);
  } catch (error) {
    next(error);
  }
};

const findOne = (req, res, next) => {
  try {
    const appointment = getAppointmentById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Agendamento não encontrado' });
    }
    res.json(appointment);
  } catch (error) {
    next(error);
  }
};

const updateStatus = (req, res, next) => {
  try {
    const appointment = updateAppointmentStatus(req.params.id, req.body.status);
    if (!appointment) {
      return res.status(404).json({ message: 'Agendamento não encontrado' });
    }
    res.json(appointment);
  } catch (error) {
    next(error);
  }
};

const availableTimes = (req, res, next) => {
  try {
    const { serviceId } = req.query;
    if (!serviceId) {
      return res.status(400).json({ message: 'ID do serviço é obrigatório' });
    }

    const times = getAvailableTimes(req.params.date, serviceId);
    res.json({ availableTimes: times });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create,
  list,
  findOne,
  updateStatus,
  availableTimes
};
