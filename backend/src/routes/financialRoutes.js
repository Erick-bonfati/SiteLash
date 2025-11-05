const express = require('express');
const {
  metrics,
  revenueByPeriod,
  monthlyRevenue
} = require('../controllers/financialController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/metrics', authMiddleware, metrics);
router.get('/revenue-by-period', authMiddleware, revenueByPeriod);
router.get('/monthly-revenue', authMiddleware, monthlyRevenue);

module.exports = router;
