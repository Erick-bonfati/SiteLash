const { authenticate } = require('../services/authService');

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authenticate(email, password);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const me = (req, res) => {
  res.json({ admin: req.admin });
};

module.exports = {
  login,
  me
};
