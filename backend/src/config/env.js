const DEFAULT_JWT_SECRET = 'sua_chave_secreta_super_segura_aqui_2023';

const toNumber = (value, fallback) => {
  if (value === undefined) {
    return fallback;
  }
  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
};

const toBoolean = (value, fallback = false) => {
  if (value === undefined) {
    return fallback;
  }
  return ['true', '1', 'yes', 'on'].includes(String(value).toLowerCase());
};

const toList = (value) =>
  String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const sanitizeDigits = (value) => (value ? String(value).replace(/\D/g, '') : '');

const emailConfig = {
  host: process.env.EMAIL_HOST,
  port: toNumber(process.env.EMAIL_PORT),
  secure: toBoolean(process.env.EMAIL_SECURE, toNumber(process.env.EMAIL_PORT) === 465),
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASS,
  from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
  replyTo: process.env.EMAIL_REPLY_TO || process.env.EMAIL_FROM || process.env.EMAIL_USER,
  copyTo: process.env.EMAIL_COPY_TO
};

const hasEmailCredentials =
  Boolean(emailConfig.host) &&
  Boolean(emailConfig.port) &&
  Boolean(emailConfig.user) &&
  Boolean(emailConfig.pass);

const buildWhatsappConfig = () => {
  const phone = sanitizeDigits(process.env.CONTACT_WHATSAPP_NUMBER);
  if (!phone) {
    return null;
  }

  const display = process.env.CONTACT_WHATSAPP_DISPLAY || phone;
  return {
    phone,
    display,
    link: `https://api.whatsapp.com/send/?phone=${phone}`
  };
};

const parseTrustProxy = (value) => {
  if (value === undefined) {
    return 'loopback';
  }
  const normalized = String(value).toLowerCase();
  if (['true', '1', 'yes', 'on'].includes(normalized)) {
    return true;
  }
  if (['false', '0', 'no', 'off'].includes(normalized)) {
    return false;
  }
  const parsedNumber = Number(value);
  if (!Number.isNaN(parsedNumber)) {
    return parsedNumber;
  }
  return value;
};

const securityConfig = {
  allowedOrigins: (() => {
    const origins = toList(process.env.ALLOWED_ORIGINS);
    return origins.length ? origins : null; // null => allow all (backwards compatibility)
  })(),
  trustProxy: parseTrustProxy(process.env.TRUST_PROXY),
  rateLimit: {
    global: {
      windowMs: toNumber(process.env.RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000),
      max: toNumber(process.env.RATE_LIMIT_MAX, 200)
    },
    auth: {
      windowMs: toNumber(process.env.RATE_LIMIT_AUTH_WINDOW_MS, 15 * 60 * 1000),
      max: toNumber(process.env.RATE_LIMIT_AUTH_MAX, 10)
    },
    appointment: {
      windowMs: toNumber(process.env.RATE_LIMIT_APPOINTMENT_WINDOW_MS, 60 * 60 * 1000),
      max: toNumber(process.env.RATE_LIMIT_APPOINTMENT_MAX, 30)
    }
  }
};

module.exports = {
  port: toNumber(process.env.PORT, 5000),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || DEFAULT_JWT_SECRET,
  security: securityConfig,
  contact: {
    whatsapp: buildWhatsappConfig(),
    supportEmail: process.env.CONTACT_SUPPORT_EMAIL || emailConfig.replyTo || emailConfig.from
  },
  email: {
    ...emailConfig,
    enabled: toBoolean(process.env.EMAIL_ENABLED, hasEmailCredentials) && hasEmailCredentials
  }
};
