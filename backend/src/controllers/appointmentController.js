const {
  createAppointment,
  listAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  getAvailableTimes
} = require('../services/appointmentService');
const { sendAppointmentConfirmation } = require('../services/emailService');

const create = async (req, res, next) => {
  try {
    const appointment = await createAppointment(req.body);
    res.status(201).json(appointment);
    sendAppointmentConfirmation(appointment);
  } catch (error) {
    next(error);
  }
};

const list = async (req, res, next) => {
  try {
    const appointments = await listAppointments(req.query);
    res.json(appointments);
  } catch (error) {
    next(error);
  }
};

const findOne = async (req, res, next) => {
  try {
    const appointment = await getAppointmentById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Agendamento não encontrado' });
    }
    res.json(appointment);
  } catch (error) {
    next(error);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const appointment = await updateAppointmentStatus(req.params.id, req.body.status);
    if (!appointment) {
      return res.status(404).json({ message: 'Agendamento não encontrado' });
    }
    res.json(appointment);
  } catch (error) {
    next(error);
  }
};

const availableTimes = async (req, res, next) => {
  try {
    const { serviceId } = req.query;
    if (!serviceId) {
      return res.status(400).json({ message: 'ID do serviço é obrigatório' });
    }

    const times = await getAvailableTimes(req.params.date, serviceId);
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
