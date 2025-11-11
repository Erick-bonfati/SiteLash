const {
  getFinancialMetrics,
  getRevenueByPeriod,
  getMonthlyRevenue
} = require('../services/financialService');

const metrics = async (req, res, next) => {
  try {
    const data = await getFinancialMetrics();
    res.json(data);
  } catch (error) {
    next(error);
  }
};

const revenueByPeriod = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        message: 'Data de início e data de fim são obrigatórias'
      });
    }

    const data = await getRevenueByPeriod(startDate, endDate);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

const monthlyRevenue = async (req, res, next) => {
  try {
    const data = await getMonthlyRevenue();
    res.json(data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  metrics,
  revenueByPeriod,
  monthlyRevenue
};
