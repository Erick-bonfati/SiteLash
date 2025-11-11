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

const sanitizeDigits = (value) => (value ? String(value).replace(/\D/g, '') : '');

const emailConfig = {
  host: process.env.EMAIL_HOST,
  port: toNumber(process.env.EMAIL_PORT),
  secure: toBoolean(process.env.EMAIL_SECURE, toNumber(process.env.EMAIL_PORT) === 465),
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASS,
  from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
  replyTo: process.env.EMAIL_REPLY_TO || process.env.EMAIL_FROM || process.env.EMAIL_USER
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

  return {
    phone,
    display: phone,
    link: `https://api.whatsapp.com/send/?phone=${phone}`
  };
};

const securityConfig = {
  allowedOrigins: null,
  trustProxy: 'loopback',
  rateLimit: {
    global: {
      windowMs: 15 * 60 * 1000,
      max: 200
    },
    auth: {
      windowMs: 15 * 60 * 1000,
      max: 10
    },
    appointment: {
      windowMs: 60 * 60 * 1000,
      max: 30
    }
  }
};

module.exports = {
  port: 5000,
  nodeEnv: 'development',
  jwtSecret: DEFAULT_JWT_SECRET,
  security: securityConfig,
  contact: {
    whatsapp: buildWhatsappConfig(),
    supportEmail: emailConfig.replyTo || emailConfig.from || emailConfig.user
  },
  email: {
    ...emailConfig,
    enabled: toBoolean(process.env.EMAIL_ENABLED, hasEmailCredentials) && hasEmailCredentials
  }
};
