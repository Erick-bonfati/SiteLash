const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const financialRoutes = require('./routes/financialRoutes');
const publicRoutes = require('./routes/publicRoutes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');
const { security } = require('./config/env');

const app = express();

const trustProxyValue =
  security.trustProxy === false || security.trustProxy === 'false'
    ? false
    : security.trustProxy || 'loopback';

if (trustProxyValue !== false) {
  app.set('trust proxy', trustProxyValue);
}

const corsOptions = security.allowedOrigins
  ? {
      origin(origin, callback) {
        if (!origin || security.allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        return callback(null, false);
      },
      credentials: true
    }
  : { origin: true, credentials: true };

const globalLimiter = rateLimit({
  windowMs: security.rateLimit.global.windowMs,
  max: security.rateLimit.global.max,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => res.status(429).json({ message: 'Muitas requisições. Tente novamente em instantes.' })
});

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
  })
);
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(globalLimiter);
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

app.use('/api/public', publicRoutes);
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
