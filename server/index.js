require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dataManager = require('./utils/dataManager');

// Importar rotas (versão mock sem banco de dados)
const authRoutes = require('./routes/auth-mock');
const productRoutes = require('./routes/products-mock');
const appointmentRoutes = require('./routes/appointments-mock');
const uploadRoutes = require('./routes/upload');
const financialRoutes = require('./routes/financial');

const app = express();
const PORT = process.env.PORT || 5000;

// Carregar dados do sistema de persistência JSON
global.mockData = dataManager.loadData();

console.log('📝 Usando sistema de persistência JSON');
console.log(`📁 Dados salvos em: ${dataManager.dataDir}`);

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// As imagens agora são servidas pelo frontend na pasta public/images

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/financial', financialRoutes);

// Rota de teste
app.get('/api/test', (req, res) => {
  res.json({ message: 'API funcionando corretamente!' });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Algo deu errado!' });
});

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Rota não encontrada' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
});
