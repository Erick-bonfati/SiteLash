const {
  getFinancialMetrics,
  getRevenueByPeriod,
  getMonthlyRevenue
} = require('../services/financialService');

const metrics = (req, res, next) => {
  try {
    res.json(getFinancialMetrics());
  } catch (error) {
    next(error);
  }
};

const revenueByPeriod = (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        message: 'Data de início e data de fim são obrigatórias'
      });
    }

    res.json(getRevenueByPeriod(startDate, endDate));
  } catch (error) {
    next(error);
  }
};

const monthlyRevenue = (req, res, next) => {
  try {
    res.json(getMonthlyRevenue());
  } catch (error) {
    next(error);
  }
};

module.exports = {
  metrics,
  revenueByPeriod,
  monthlyRevenue
};
