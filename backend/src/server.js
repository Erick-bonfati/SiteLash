require('dotenv').config();

const app = require('./app');
const { port, nodeEnv } = require('./config/env');
const dataManager = require('./utils/dataManager');
require('./services/dataStore'); // garante o carregamento dos dados

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
  console.log(`Ambiente: ${nodeEnv}`);
  console.log('📝 Usando sistema de persistência JSON');
  console.log(`📁 Dados salvos em: ${dataManager.dataDir}`);
});
