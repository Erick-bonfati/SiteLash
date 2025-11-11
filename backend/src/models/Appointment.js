const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true, trim: true },
    customerEmail: { type: String, required: true, trim: true, lowercase: true },
    customerPhone: { type: String, required: true, trim: true },
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    appointmentDate: { type: Date, required: true },
    appointmentTime: { type: String, required: true },
    notes: { type: String, trim: true },
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pendente', 'confirmado', 'concluído', 'cancelado'],
      default: 'pendente'
    }
  },
  { timestamps: true }
);

appointmentSchema.index({ appointmentDate: 1, appointmentTime: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
