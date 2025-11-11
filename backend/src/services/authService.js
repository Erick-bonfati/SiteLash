const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const { jwtSecret } = require('../config/env');

const sanitizeAdmin = (admin) => ({
  id: admin._id?.toString(),
  username: admin.username,
  email: admin.email,
  role: admin.role
});

const authenticate = async (email, password) => {
  const admin = await Admin.findOne({
    email: email?.toLowerCase(),
    isActive: { $ne: false }
  }).lean();

  if (!admin) {
    const error = new Error('Credenciais inválidas');
    error.statusCode = 400;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    const error = new Error('Credenciais inválidas');
    error.statusCode = 400;
    throw error;
  }

  const payload = {
    id: admin._id?.toString(),
    username: admin.username,
    role: admin.role
  };

  const token = jwt.sign(payload, jwtSecret, { expiresIn: '24h' });

  return {
    token,
    admin: sanitizeAdmin(admin)
  };
};

module.exports = {
  authenticate,
  sanitizeAdmin
};
