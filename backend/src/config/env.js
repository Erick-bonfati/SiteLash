const DEFAULT_JWT_SECRET = 'sua_chave_secreta_super_segura_aqui_2023';

module.exports = {
  port: process.env.PORT ? Number(process.env.PORT) : 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || DEFAULT_JWT_SECRET
};
