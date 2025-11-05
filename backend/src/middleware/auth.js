const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/env');
const { getAdmins } = require('../services/dataStore');

module.exports = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Token de acesso negado' });
    }

    const decoded = jwt.verify(token, jwtSecret);
    const admin = getAdmins().find(
      (item) => item._id === decoded.id && item.isActive !== false
    );

    if (!admin) {
      return res.status(401).json({ message: 'Token inválido' });
    }

    req.admin = {
      id: admin._id,
      username: admin.username,
      email: admin.email,
      role: admin.role
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};
