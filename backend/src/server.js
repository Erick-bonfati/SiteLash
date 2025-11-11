require('dotenv').config();

const app = require('./app');
const { port, nodeEnv } = require('./config/env');
const connectDatabase = require('./config/database');
const initializeDatabase = require('./services/databaseInitializer');

const startServer = async () => {
  await connectDatabase();
  await initializeDatabase();

  app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
    console.log(`Ambiente: ${nodeEnv}`);
    console.log('🗄️ Persistência: MongoDB');
  });
};

startServer().catch((error) => {
  console.error('Erro ao iniciar o servidor:', error);
  process.exit(1);
});
