const mongoose = require('mongoose');
const Admin = require('../models/Admin');
require('dotenv').config();

const createAdmin = async () => {
  try {
    // Conectar ao MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sitelash');
    console.log('Conectado ao MongoDB');

    // Verificar se já existe um admin
    const existingAdmin = await Admin.findOne({ email: 'admin@sitelash.com' });
    
    if (existingAdmin) {
      console.log('Admin já existe!');
      console.log('Email: admin@sitelash.com');
      console.log('Senha: admin123');
      process.exit(0);
    }

    // Criar admin padrão
    const admin = new Admin({
      username: 'admin',
      email: 'admin@sitelash.com',
      password: 'admin123',
      role: 'admin'
    });

    await admin.save();
    console.log('✅ Admin criado com sucesso!');
    console.log('Email: admin@sitelash.com');
    console.log('Senha: admin123');
    
  } catch (error) {
    console.error('❌ Erro ao criar admin:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

createAdmin();
