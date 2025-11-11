const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/env');
const Admin = require('../models/Admin');

module.exports = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Token de acesso negado' });
    }

    const decoded = jwt.verify(token, jwtSecret);
    const admin = await Admin.findOne({
      _id: decoded.id,
      isActive: { $ne: false }
    }).lean();

    if (!admin) {
      return res.status(401).json({ message: 'Token inválido' });
    }

    req.admin = {
      id: admin._id?.toString(),
      username: admin.username,
      email: admin.email,
      role: admin.role
    };

    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};
