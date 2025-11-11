const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const Product = require('../models/Product');

const defaultProducts = [
  {
    name: 'Design de Sobrancelhas',
    description: 'Design personalizado para realçar seus olhos',
    price: 50,
    materialCost: 15,
    category: 'serviço',
    duration: 30,
    image:
      'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=300&h=300&fit=crop&crop=face'
  },
  {
    name: 'Extensão de Cílios',
    description: 'Cílios mais longos e volumosos',
    price: 120,
    materialCost: 35,
    category: 'serviço',
    duration: 90,
    image:
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=300&h=300&fit=crop&crop=face'
  },
  {
    name: 'Kit de Maquiagem',
    description: 'Kit completo com produtos de qualidade',
    price: 89.9,
    materialCost: 45,
    category: 'produto',
    image:
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=300&fit=crop'
  }
];

const ensureDefaultAdmin = async () => {
  const adminCount = await Admin.countDocuments();
  if (adminCount > 0) {
    return;
  }

  const username = process.env.DEFAULT_ADMIN_USERNAME || 'admin';
  const email = process.env.DEFAULT_ADMIN_EMAIL || 'admin@sitelash.com';
  const password = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123';
  const passwordHash = await bcrypt.hash(password, 10);

  await Admin.create({
    username,
    email,
    password: passwordHash,
    role: 'admin',
    isActive: true
  });

  console.log(
    `👤 Admin padrão criado (email: ${email}, senha: ${password}). Altere essas credenciais no painel assim que possível.`
  );
};

const ensureDefaultProducts = async () => {
  const productCount = await Product.countDocuments();
  if (productCount > 0) {
    return;
  }

  await Product.insertMany(
    defaultProducts.map((product) => ({
      ...product,
      createdAt: new Date(),
      updatedAt: new Date()
    }))
  );

  console.log('🛍️ Produtos/serviços padrão importados para o MongoDB.');
};

const initializeDatabase = async () => {
  await ensureDefaultAdmin();
  await ensureDefaultProducts();
};

module.exports = initializeDatabase;
