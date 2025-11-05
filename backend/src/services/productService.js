const {
  getProducts,
  setProducts,
  generateId
} = require('./dataStore');

const cloneProduct = (product) => ({
  ...product,
  createdAt: product.createdAt ? new Date(product.createdAt) : undefined,
  updatedAt: product.updatedAt ? new Date(product.updatedAt) : undefined
});

const listActiveProducts = () =>
  getProducts().filter((product) => product.isActive !== false).map(cloneProduct);

const listAllProducts = () => getProducts().map(cloneProduct);

const findProductById = (productId) => {
  const product = getProducts().find((item) => item._id === productId);
  return product ? cloneProduct(product) : null;
};

const createProduct = ({
  name,
  description,
  price,
  materialCost = 0,
  category,
  duration,
  image = '',
  isActive = true
}) => {
  const products = getProducts();
  const now = new Date();

  const newProduct = {
    _id: generateId(products),
    name,
    description,
    price: Number(price),
    materialCost: Number(materialCost) || 0,
    category,
    duration: category === 'serviço' ? Number(duration) : undefined,
    image,
    isActive,
    createdAt: now,
    updatedAt: now
  };

  setProducts([...products, newProduct]);
  return cloneProduct(newProduct);
};

const updateProduct = (productId, updates) => {
  const products = getProducts();
  const index = products.findIndex((item) => item._id === productId);

  if (index === -1) {
    return null;
  }

  const product = products[index];

  if (updates.name !== undefined) product.name = updates.name;
  if (updates.description !== undefined) product.description = updates.description;
  if (updates.price !== undefined) product.price = Number(updates.price);
  if (updates.materialCost !== undefined) {
    product.materialCost = Number(updates.materialCost) || 0;
  }
  if (updates.category !== undefined) product.category = updates.category;

  if (product.category === 'serviço') {
    if (updates.duration !== undefined) {
      product.duration = Number(updates.duration);
    }
  } else {
    product.duration = undefined;
  }

  if (updates.image !== undefined) product.image = updates.image;
  if (updates.isActive !== undefined) product.isActive = updates.isActive;

  product.updatedAt = new Date();

  setProducts([...products]);
  return cloneProduct(product);
};

const deleteProduct = (productId) => {
  const products = getProducts();
  const index = products.findIndex((item) => item._id === productId);

  if (index === -1) {
    return false;
  }

  const updatedProducts = products.filter((product) => product._id !== productId);
  setProducts(updatedProducts);
  return true;
};

module.exports = {
  listActiveProducts,
  listAllProducts,
  findProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
