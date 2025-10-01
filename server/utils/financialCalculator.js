const dataManager = require('./dataManager');

class FinancialCalculator {
  // Calcular faturamento bruto (agendamentos confirmados)
  static calculateGrossRevenue(appointments, products) {
    const confirmedAppointments = appointments.filter(apt => 
      apt.status === 'confirmado' || apt.status === 'concluído'
    );

    let totalGross = 0;
    confirmedAppointments.forEach(appointment => {
      const product = products.find(p => p._id === appointment.service);
      if (product) {
        totalGross += appointment.totalPrice || product.price;
      }
    });

    return totalGross;
  }

  // Calcular faturamento líquido (agendamentos concluídos)
  static calculateNetRevenue(appointments, products) {
    const completedAppointments = appointments.filter(apt => 
      apt.status === 'concluído'
    );

    let totalNet = 0;
    let totalMaterialCost = 0;

    completedAppointments.forEach(appointment => {
      const product = products.find(p => p._id === appointment.service);
      if (product) {
        const price = appointment.totalPrice || product.price;
        const materialCost = product.materialCost || 0;
        
        totalNet += price - materialCost;
        totalMaterialCost += materialCost;
      }
    });

    return {
      netRevenue: totalNet,
      materialCost: totalMaterialCost,
      grossRevenue: totalNet + totalMaterialCost
    };
  }

  // Calcular custo total de materiais
  static calculateTotalMaterialCost(appointments, products) {
    const allAppointments = appointments.filter(apt => 
      apt.status === 'confirmado' || apt.status === 'concluído'
    );

    let totalMaterialCost = 0;
    allAppointments.forEach(appointment => {
      const product = products.find(p => p._id === appointment.service);
      if (product) {
        totalMaterialCost += product.materialCost || 0;
      }
    });

    return totalMaterialCost;
  }

  // Obter métricas financeiras completas
  static getFinancialMetrics() {
    const data = dataManager.loadData();
    const appointments = data.appointments;
    const products = data.products;

    const grossRevenue = this.calculateGrossRevenue(appointments, products);
    const netData = this.calculateNetRevenue(appointments, products);
    const totalMaterialCost = this.calculateTotalMaterialCost(appointments, products);

    return {
      grossRevenue,
      netRevenue: netData.netRevenue,
      materialCost: totalMaterialCost,
      profitMargin: grossRevenue > 0 ? ((netData.netRevenue / grossRevenue) * 100).toFixed(2) : 0,
      totalAppointments: appointments.length,
      confirmedAppointments: appointments.filter(apt => apt.status === 'confirmado').length,
      completedAppointments: appointments.filter(apt => apt.status === 'concluído').length,
      pendingAppointments: appointments.filter(apt => apt.status === 'pendente').length
    };
  }

  // Obter faturamento por período
  static getRevenueByPeriod(startDate, endDate) {
    const data = dataManager.loadData();
    const appointments = data.appointments.filter(apt => {
      const aptDate = new Date(apt.appointmentDate);
      return aptDate >= new Date(startDate) && aptDate <= new Date(endDate);
    });
    const products = data.products;

    const grossRevenue = this.calculateGrossRevenue(appointments, products);
    const netData = this.calculateNetRevenue(appointments, products);

    return {
      period: { startDate, endDate },
      grossRevenue,
      netRevenue: netData.netRevenue,
      materialCost: netData.materialCost,
      appointmentsCount: appointments.length
    };
  }
}

module.exports = FinancialCalculator;
