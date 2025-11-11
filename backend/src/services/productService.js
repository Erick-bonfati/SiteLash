const Product = require('../models/Product');

const toNumber = (value) => {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
};

const listActiveProducts = async () =>
  Product.find({ isActive: { $ne: false } }).sort({ createdAt: -1 }).lean();

const listAllProducts = async () => Product.find().sort({ createdAt: -1 }).lean();

const findProductById = async (productId) => Product.findById(productId).lean();

const createProduct = async (data) => {
  const payload = {
    name: data.name,
    description: data.description,
    price: toNumber(data.price),
    materialCost: toNumber(data.materialCost) || 0,
    category: data.category,
    duration: data.category === 'serviço' ? toNumber(data.duration) : undefined,
    image: data.image || '',
    isActive: data.isActive !== undefined ? data.isActive : true
  };

  const product = await Product.create(payload);
  return product.toObject();
};

const updateProduct = async (productId, updates) => {
  const product = await Product.findById(productId);
  if (!product) {
    return null;
  }

  if (updates.name !== undefined) product.name = updates.name;
  if (updates.description !== undefined) product.description = updates.description;
  if (updates.price !== undefined) product.price = toNumber(updates.price);
  if (updates.materialCost !== undefined) {
    product.materialCost = toNumber(updates.materialCost) || 0;
  }
  if (updates.category !== undefined) product.category = updates.category;

  if (product.category === 'serviço') {
    if (updates.duration !== undefined) {
      product.duration = toNumber(updates.duration);
    }
  } else {
    product.duration = undefined;
  }

  if (updates.image !== undefined) product.image = updates.image;
  if (updates.isActive !== undefined) product.isActive = updates.isActive;

  await product.save();
  return product.toObject();
};

const deleteProduct = async (productId) => {
  const product = await Product.findByIdAndDelete(productId);
  return Boolean(product);
};

module.exports = {
  listActiveProducts,
  listAllProducts,
  findProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
