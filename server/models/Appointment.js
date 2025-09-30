const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: [true, 'Nome do cliente é obrigatório'],
    trim: true,
    maxlength: [100, 'Nome não pode ter mais de 100 caracteres']
  },
  customerEmail: {
    type: String,
    required: [true, 'Email é obrigatório'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido']
  },
  customerPhone: {
    type: String,
    required: [true, 'Telefone é obrigatório'],
    trim: true,
    match: [/^[\d\s\(\)\-\+]+$/, 'Telefone inválido']
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Serviço é obrigatório']
  },
  appointmentDate: {
    type: Date,
    required: [true, 'Data do agendamento é obrigatória']
  },
  appointmentTime: {
    type: String,
    required: [true, 'Horário é obrigatório'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de horário inválido']
  },
  status: {
    type: String,
    enum: ['pendente', 'confirmado', 'cancelado', 'concluído'],
    default: 'pendente'
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [300, 'Observações não podem ter mais de 300 caracteres']
  },
  totalPrice: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

// Índice para evitar conflitos de horário
appointmentSchema.index({ appointmentDate: 1, appointmentTime: 1 }, { unique: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
