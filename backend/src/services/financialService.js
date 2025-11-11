const FinancialCalculator = require('../utils/financialCalculator');
const Appointment = require('../models/Appointment');
const Product = require('../models/Product');

const loadFinancialData = async () => {
  const [appointments, products] = await Promise.all([
    Appointment.find().lean(),
    Product.find().lean()
  ]);

  return { appointments, products };
};

const getFinancialMetrics = async () => {
  const { appointments, products } = await loadFinancialData();
  return FinancialCalculator.getFinancialMetrics(appointments, products);
};

const getRevenueByPeriod = async (startDate, endDate) => {
  const { appointments, products } = await loadFinancialData();
  return FinancialCalculator.getRevenueByPeriod(appointments, products, startDate, endDate);
};

const getMonthlyRevenue = async () => {
  const { appointments, products } = await loadFinancialData();
  const monthlyData = [];
  const currentDate = new Date();

  for (let i = 11; i >= 0; i -= 1) {
    const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const startDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
    const endDate = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);

    const revenue = FinancialCalculator.getRevenueByPeriod(
      appointments,
      products,
      startDate.toISOString().split('T')[0],
      endDate.toISOString().split('T')[0]
    );

    monthlyData.push({
      month: monthDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' }),
      ...revenue
    });
  }

  return monthlyData;
};

module.exports = {
  getFinancialMetrics,
  getRevenueByPeriod,
  getMonthlyRevenue
};
