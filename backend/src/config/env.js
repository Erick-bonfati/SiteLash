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

module.exports = {
  port: toNumber(process.env.PORT, 5000),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || DEFAULT_JWT_SECRET,
  email: {
    ...emailConfig,
    enabled: toBoolean(process.env.EMAIL_ENABLED, hasEmailCredentials) && hasEmailCredentials
  }
};
