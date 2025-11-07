const {
  getAppointments,
  setAppointments,
  generateId
} = require('./dataStore');
const { findProductById } = require('./productService');

const normalizeDateString = (date) => new Date(date).toISOString().split('T')[0];

const getAllowedTimesForDay = (date) => {
  const dayOfWeek = date.getDay(); // 0=domingo ... 6=sábado

  if (dayOfWeek === 0 || dayOfWeek === 1) {
    return []; // Domingo e segunda sem atendimento
  }

  if (dayOfWeek === 6) {
    return ['08:00', '11:00', '14:00'];
  }

  return ['09:00', '13:00', '15:30', '18:00'];
};

const ensureServiceExists = (serviceId) => {
  const service = findProductById(serviceId);
  if (!service || service.isActive === false || service.category !== 'serviço') {
    const error = new Error('Serviço não encontrado ou indisponível');
    error.statusCode = 400;
    throw error;
  }
  return service;
};

const filterActiveAppointmentsByDay = (appointments, dateString) =>
  appointments.filter((appointment) => {
    const sameDay =
      normalizeDateString(appointment.appointmentDate) === dateString &&
      ['pendente', 'confirmado'].includes(appointment.status);
    return sameDay;
  });

const isSlotAlreadyTaken = (dayAppointments, appointmentTime) =>
  dayAppointments.some(
    (appointment) => appointment.appointmentTime === appointmentTime
  );

const hasConflict = (appointments, dateString, appointmentTime, durationInMinutes) => {
  const dayAppointments = filterActiveAppointmentsByDay(appointments, dateString);

  // Se já existe alguém exatamente nesse horário, bloqueia imediatamente,
  // independentemente do serviço ou duração.
  if (isSlotAlreadyTaken(dayAppointments, appointmentTime)) {
    return true;
  }

  const [timeHour, timeMinute] = appointmentTime.split(':').map(Number);
  const requestedStart = timeHour * 60 + timeMinute;
  const requestedEnd = requestedStart + durationInMinutes;

  return dayAppointments.some((appointment) => {
    const [appointmentHour, appointmentMinute] = appointment.appointmentTime
      .split(':')
      .map(Number);
    const appointmentStart = appointmentHour * 60 + appointmentMinute;

    const service = findProductById(appointment.service);
    const appointmentDuration = service?.duration || 30;
    const appointmentEnd = appointmentStart + appointmentDuration;

    return requestedStart < appointmentEnd && requestedEnd > appointmentStart;
  });
};

const formatAppointment = (appointment) => {
  const service = findProductById(appointment.service);
  return {
    ...appointment,
    service: service || { name: 'Serviço não encontrado' }
  };
};

const createAppointment = ({
  customerName,
  customerEmail,
  customerPhone,
  service: serviceId,
  appointmentDate,
  appointmentTime,
  notes = ''
}) => {
  const service = ensureServiceExists(serviceId);

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

  const appointments = getAppointments();
  const dateString = normalizeDateString(scheduleDate);
  const durationInMinutes = Number(service.duration);
  if (!durationInMinutes) {
    const error = new Error('Serviço sem duração configurada');
    error.statusCode = 400;
    throw error;
  }

  if (hasConflict(appointments, dateString, appointmentTime, durationInMinutes)) {
    const error = new Error('Horário já está ocupado ou conflita com outro agendamento');
    error.statusCode = 400;
    throw error;
  }

  const now = new Date();
  const newAppointment = {
    _id: generateId(appointments),
    customerName,
    customerEmail,
    customerPhone,
    service: service._id,
    appointmentDate: new Date(appointmentDate),
    appointmentTime,
    notes,
    totalPrice: service.price,
    status: 'pendente',
    createdAt: now,
    updatedAt: now
  };

  setAppointments([...appointments, newAppointment]);
  return formatAppointment(newAppointment);
};

const listAppointments = ({ status, date } = {}) => {
  let appointments = [...getAppointments()];

  if (status) {
    appointments = appointments.filter((appointment) => appointment.status === status);
  }

  if (date) {
    appointments = appointments.filter(
      (appointment) => normalizeDateString(appointment.appointmentDate) === date
    );
  }

  return appointments.map(formatAppointment);
};

const getAppointmentById = (appointmentId) => {
  const appointment = getAppointments().find((item) => item._id === appointmentId);
  return appointment ? formatAppointment(appointment) : null;
};

const updateAppointmentStatus = (appointmentId, status) => {
  const appointments = getAppointments();
  const index = appointments.findIndex((item) => item._id === appointmentId);

  if (index === -1) {
    return null;
  }

  appointments[index].status = status;
  appointments[index].updatedAt = new Date();

  setAppointments([...appointments]);
  return formatAppointment(appointments[index]);
};

const getAvailableTimes = (date, serviceId) => {
  const service = ensureServiceExists(serviceId);
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

  const appointments = getAppointments();
  const dateString = normalizeDateString(scheduleDate);

  return allowedTimes.filter((time) => {
    const scheduleDateTime = new Date(`${date}T${time}`);
    const isPast = scheduleDateTime < new Date();
    if (isPast) {
      return false;
    }
    return !hasConflict(appointments, dateString, time, serviceDuration);
  });
};

module.exports = {
  createAppointment,
  listAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  getAvailableTimes
};
