const {
  listActiveProducts,
  listAllProducts,
  findProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../services/productService');

const getPublicProducts = async (req, res, next) => {
  try {
    const products = await listActiveProducts();
    res.json(products);
  } catch (error) {
    next(error);
  }
};

const getAllProducts = async (req, res, next) => {
  try {
    const products = await listAllProducts();
    res.json(products);
  } catch (error) {
    next(error);
  }
};

const getProduct = async (req, res, next) => {
  try {
    const product = await findProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Produto/serviço não encontrado' });
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
};

const createNewProduct = async (req, res, next) => {
  try {
    const product = await createProduct(req.body);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

const updateExistingProduct = async (req, res, next) => {
  try {
    const product = await updateProduct(req.params.id, req.body);
    if (!product) {
      return res.status(404).json({ message: 'Produto/serviço não encontrado' });
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
};

const removeProduct = async (req, res, next) => {
  try {
    const deleted = await deleteProduct(req.params.id);
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
