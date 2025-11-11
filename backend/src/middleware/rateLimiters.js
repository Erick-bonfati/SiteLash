const rateLimit = require('express-rate-limit');
const { security } = require('../config/env');

const buildLimiter = ({ windowMs, max, message }) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message },
    handler: (req, res) => {
      res.status(429).json({ message });
    }
  });

const authLimiter = buildLimiter({
  windowMs: security.rateLimit.auth.windowMs,
  max: security.rateLimit.auth.max,
  message: 'Muitas tentativas de login. Tente novamente em alguns minutos.'
});

const appointmentLimiter = buildLimiter({
  windowMs: security.rateLimit.appointment.windowMs,
  max: security.rateLimit.appointment.max,
  message: 'Muitas tentativas de agendamento detectadas. Aguarde e tente novamente.'
});

module.exports = {
  authLimiter,
  appointmentLimiter
};
