const mongoose = require('mongoose');

const DEFAULT_URI = 'mongodb://127.0.0.1:27017/sitelash';

mongoose.set('strictQuery', true);

const getSafeUriLabel = (uri) => {
  try {
    const parsed = new URL(uri);
    return `${parsed.protocol}//${parsed.hostname}${parsed.port ? `:${parsed.port}` : ''}${parsed.pathname}`;
  } catch (error) {
    return 'mongodb';
  }
};

const connectDatabase = async () => {
  const uri = process.env.MONGODB_URI || DEFAULT_URI;

  try {
    await mongoose.connect(uri);
    console.log(`🍃 Conectado ao MongoDB (${getSafeUriLabel(uri)})`);
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDatabase;
