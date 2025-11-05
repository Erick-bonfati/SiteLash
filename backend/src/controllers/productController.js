const {
  listActiveProducts,
  listAllProducts,
  findProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../services/productService');

const getPublicProducts = (req, res, next) => {
  try {
    const products = listActiveProducts();
    res.json(products);
  } catch (error) {
    next(error);
  }
};

const getAllProducts = (req, res, next) => {
  try {
    const products = listAllProducts();
    res.json(products);
  } catch (error) {
    next(error);
  }
};

const getProduct = (req, res, next) => {
  try {
    const product = findProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Produto/serviço não encontrado' });
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
};

const createNewProduct = (req, res, next) => {
  try {
    const product = createProduct(req.body);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

const updateExistingProduct = (req, res, next) => {
  try {
    const product = updateProduct(req.params.id, req.body);
    if (!product) {
      return res.status(404).json({ message: 'Produto/serviço não encontrado' });
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
};

const removeProduct = (req, res, next) => {
  try {
    const deleted = deleteProduct(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Produto/serviço não encontrado' });
    }
    res.json({ message: 'Produto/serviço deletado com sucesso' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPublicProducts,
  getAllProducts,
  getProduct,
  createNewProduct,
  updateExistingProduct,
  removeProduct
};
