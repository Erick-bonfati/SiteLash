const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const financialRoutes = require('./routes/financialRoutes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/financial', financialRoutes);

app.get('/api/test', (req, res) => {
  res.json({ message: 'API funcionando corretamente!' });
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;
