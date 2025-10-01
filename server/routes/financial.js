const express = require('express');
const FinancialCalculator = require('../utils/financialCalculator');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/financial/metrics
// @desc    Obter métricas financeiras gerais
// @access  Private
router.get('/metrics', auth, (req, res) => {
  try {
    const metrics = FinancialCalculator.getFinancialMetrics();
    res.json(metrics);
  } catch (error) {
    console.error('Erro ao calcular métricas financeiras:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   GET /api/financial/revenue-by-period
// @desc    Obter faturamento por período
// @access  Private
router.get('/revenue-by-period', auth, (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ 
        message: 'Data de início e data de fim são obrigatórias' 
      });
    }

    const revenue = FinancialCalculator.getRevenueByPeriod(startDate, endDate);
    res.json(revenue);
  } catch (error) {
    console.error('Erro ao calcular faturamento por período:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   GET /api/financial/monthly-revenue
// @desc    Obter faturamento mensal dos últimos 12 meses
// @access  Private
router.get('/monthly-revenue', auth, (req, res) => {
  try {
    const monthlyData = [];
    const currentDate = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const startDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
      const endDate = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
      
      const revenue = FinancialCalculator.getRevenueByPeriod(
        startDate.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0]
      );
      
      monthlyData.push({
        month: monthDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' }),
        ...revenue
      });
    }
    
    res.json(monthlyData);
  } catch (error) {
    console.error('Erro ao calcular faturamento mensal:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

module.exports = router;
