const Appointment = require('../models/Appointment');
const Product = require('../models/Product');

const activeStatuses = ['pendente', 'confirmado'];

const getAllowedTimesForDay = (date) => {
  const dayOfWeek = date.getDay(); // 0=domingo ... 6=sábado

  if (dayOfWeek === 0 || dayOfWeek === 1) {
    return []; // Domingo e segunda sem atendimento
  }

  if (dayOfWeek === 6) {
    return ['08:00', '10:30', '13:00', '15:30'];
  }

  return ['09:00', '13:00', '15:30', '18:00'];
};

const getDayRange = (date) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return { start, end };
};

const ensureServiceExists = async (serviceId) => {
  const service = await Product.findOne({
    _id: serviceId,
    isActive: { $ne: false },
    category: 'serviço'
  }).lean();

  if (!service) {
    const error = new Error('Serviço não encontrado ou indisponível');
    error.statusCode = 400;
    throw error;
  }
  return service;
};

const fetchDayAppointments = async (scheduleDate) => {
  const { start, end } = getDayRange(scheduleDate);
  return Appointment.find({
    appointmentDate: { $gte: start, $lte: end },
    status: { $in: activeStatuses }
  })
    .populate('service')
    .lean();
};

const hasConflict = async (scheduleDate, appointmentTime, durationInMinutes) => {
  const appointments = await fetchDayAppointments(scheduleDate);

  const isSlotAlreadyTaken = appointments.some(
    (appointment) => appointment.appointmentTime === appointmentTime
  );
  if (isSlotAlreadyTaken) {
    return true;
  }

  const [timeHour, timeMinute] = appointmentTime.split(':').map(Number);
  const requestedStart = timeHour * 60 + timeMinute;
  const requestedEnd = requestedStart + durationInMinutes;

  return appointments.some((appointment) => {
    const [appointmentHour, appointmentMinute] = appointment.appointmentTime
      .split(':')
      .map(Number);
    const appointmentStart = appointmentHour * 60 + appointmentMinute;
    const appointmentDuration = appointment.service?.duration || 30;
    const appointmentEnd = appointmentStart + appointmentDuration;

    return requestedStart < appointmentEnd && requestedEnd > appointmentStart;
  });
};

const withServiceFallback = (appointment) => {
  if (!appointment) return null;
  if (!appointment.service) {
    return { ...appointment, service: { name: 'Serviço não encontrado' } };
  }
  return appointment;
};

const createAppointment = async ({
  customerName,
  customerEmail,
  customerPhone,
  service: serviceId,
  appointmentDate,
  appointmentTime,
  notes = ''
}) => {
  const service = await ensureServiceExists(serviceId);

  const scheduleDate = new Date(`${appointmentDate}T00:00:00`);
  if (Number.isNaN(scheduleDate.getTime())) {
    const error = new Error('Data inválida');
    error.statusCode = 400;
    throw error;
  }

  const allowedTimes = getAllowedTimesForDay(scheduleDate);
  if (allowedTimes.length === 0) {
    const error = new Error('Não é possível agendar aos domingos ou segundas - estamos fechados');
    error.statusCode = 400;
    throw error;
  }

  if (!allowedTimes.includes(appointmentTime)) {
    const error = new Error(
      `Horário inválido. Horários disponíveis: ${allowedTimes.join(', ')}`
    );
    error.statusCode = 400;
    throw error;
  }

  const scheduleDateTime = new Date(`${appointmentDate}T${appointmentTime}`);
  if (scheduleDateTime < new Date()) {
    const error = new Error('Não é possível agendar para datas passadas');
    error.statusCode = 400;
    throw error;
  }

  const durationInMinutes = Number(service.duration);
  if (!durationInMinutes) {
    const error = new Error('Serviço sem duração configurada');
    error.statusCode = 400;
    throw error;
  }

  if (await hasConflict(scheduleDate, appointmentTime, durationInMinutes)) {
    const error = new Error('Horário já está ocupado ou conflita com outro agendamento');
    error.statusCode = 400;
    throw error;
  }

  const appointment = await Appointment.create({
    customerName,
    customerEmail,
    customerPhone,
    service: service._id,
    appointmentDate: scheduleDate,
    appointmentTime,
    notes,
    totalPrice: service.price,
    status: 'pendente'
  });

  await appointment.populate('service');
  return withServiceFallback(appointment.toObject());
};

const listAppointments = async ({ status, date } = {}) => {
  const filters = {};

  if (status) {
    filters.status = status;
  }

  if (date) {
    const scheduleDate = new Date(`${date}T00:00:00`);
    if (!Number.isNaN(scheduleDate.getTime())) {
      const { start, end } = getDayRange(scheduleDate);
      filters.appointmentDate = { $gte: start, $lte: end };
    }
  }

  const appointments = await Appointment.find(filters)
    .sort({ appointmentDate: 1, appointmentTime: 1 })
    .populate('service')
    .lean();

  return appointments.map(withServiceFallback);
};

const getAppointmentById = async (appointmentId) => {
  const appointment = await Appointment.findById(appointmentId).populate('service').lean();
  return withServiceFallback(appointment);
};

const updateAppointmentStatus = async (appointmentId, status) => {
  const appointment = await Appointment.findById(appointmentId);
  if (!appointment) {
    return null;
  }

  appointment.status = status;
  appointment.updatedAt = new Date();

  await appointment.save();
  await appointment.populate('service');
  return withServiceFallback(appointment.toObject());
};

const getAvailableTimes = async (date, serviceId) => {
  const service = await ensureServiceExists(serviceId);
  const serviceDuration = Number(service.duration);
  if (!serviceDuration) {
    const error = new Error('Serviço sem duração configurada');
    error.statusCode = 400;
    throw error;
  }

  const scheduleDate = new Date(`${date}T00:00:00`);
  if (Number.isNaN(scheduleDate.getTime())) {
    const error = new Error('Data inválida');
    error.statusCode = 400;
    throw error;
  }

  const allowedTimes = getAllowedTimesForDay(scheduleDate);
  if (allowedTimes.length === 0) {
    return [];
  }

  const appointments = await fetchDayAppointments(scheduleDate);

  return allowedTimes.filter((time) => {
    const scheduleDateTime = new Date(`${date}T${time}`);
    if (scheduleDateTime < new Date()) {
      return false;
    }

    const [timeHour, timeMinute] = time.split(':').map(Number);
    const requestedStart = timeHour * 60 + timeMinute;
    const requestedEnd = requestedStart + serviceDuration;

    return !appointments.some((appointment) => {
      const [appointmentHour, appointmentMinute] = appointment.appointmentTime
        .split(':')
        .map(Number);
      const appointmentStart = appointmentHour * 60 + appointmentMinute;
      const appointmentDuration = appointment.service?.duration || 30;
      const appointmentEnd = appointmentStart + appointmentDuration;

      return requestedStart < appointmentEnd && requestedEnd > appointmentStart;
    });
  });
};

module.exports = {
  createAppointment,
  listAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  getAvailableTimes
};
