const normalizeId = (value) => {
  if (!value) return null;

  if (typeof value === 'object') {
    if (value._id && value._id !== value) {
      return normalizeId(value._id);
    }
    if (value.id && value.id !== value) {
      return normalizeId(value.id);
    }
    if (typeof value.toString === 'function') {
      return value.toString();
    }
  }

  return String(value);
};

const resolveProduct = (products, serviceRef) => {
  const serviceId = normalizeId(serviceRef);
  if (!serviceId) return null;
  return products.find((product) => normalizeId(product._id) === serviceId);
};

class FinancialCalculator {
  // Calcular faturamento bruto (agendamentos confirmados)
  static calculateGrossRevenue(appointments, products) {
    const confirmedAppointments = appointments.filter(
      (apt) => apt.status === 'confirmado' || apt.status === 'concluído'
    );

    let totalGross = 0;
    confirmedAppointments.forEach((appointment) => {
      const product = resolveProduct(products, appointment.service);
      if (product) {
        totalGross += appointment.totalPrice || product.price;
      }
    });

    return totalGross;
  }

  // Calcular faturamento líquido (agendamentos concluídos)
  static calculateNetRevenue(appointments, products) {
    const completedAppointments = appointments.filter((apt) => apt.status === 'concluído');

    let totalNet = 0;
    let totalMaterialCost = 0;

    completedAppointments.forEach((appointment) => {
      const product = resolveProduct(products, appointment.service);
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
    const allAppointments = appointments.filter(
      (apt) => apt.status === 'confirmado' || apt.status === 'concluído'
    );

    let totalMaterialCost = 0;
    allAppointments.forEach((appointment) => {
      const product = resolveProduct(products, appointment.service);
      if (product) {
        totalMaterialCost += product.materialCost || 0;
      }
    });

    return totalMaterialCost;
  }

  // Obter métricas financeiras completas
  static getFinancialMetrics(appointments, products) {
    const grossRevenue = this.calculateGrossRevenue(appointments, products);
    const netData = this.calculateNetRevenue(appointments, products);
    const totalMaterialCost = this.calculateTotalMaterialCost(appointments, products);

    return {
      grossRevenue,
      netRevenue: netData.netRevenue,
      materialCost: totalMaterialCost,
      profitMargin: grossRevenue > 0 ? ((netData.netRevenue / grossRevenue) * 100).toFixed(2) : 0,
      totalAppointments: appointments.length,
      confirmedAppointments: appointments.filter((apt) => apt.status === 'confirmado').length,
      completedAppointments: appointments.filter((apt) => apt.status === 'concluído').length,
      pendingAppointments: appointments.filter((apt) => apt.status === 'pendente').length
    };
  }

  // Obter faturamento por período
  static getRevenueByPeriod(appointments, products, startDate, endDate) {
    const filteredAppointments = appointments.filter((apt) => {
      const aptDate = new Date(apt.appointmentDate);
      return aptDate >= new Date(startDate) && aptDate <= new Date(endDate);
    });

    const grossRevenue = this.calculateGrossRevenue(filteredAppointments, products);
    const netData = this.calculateNetRevenue(filteredAppointments, products);

    return {
      period: { startDate, endDate },
      grossRevenue,
      netRevenue: netData.netRevenue,
      materialCost: netData.materialCost,
      appointmentsCount: filteredAppointments.length
    };
  }
}

module.exports = FinancialCalculator;
