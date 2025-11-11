const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    materialCost: { type: Number, default: 0, min: 0 },
    category: {
      type: String,
      enum: ['produto', 'serviço'],
      required: true
    },
    duration: { type: Number, min: 0 },
    image: { type: String, default: '' },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

productSchema.pre('validate', function validateDuration(next) {
  if (this.category === 'serviço' && !this.duration) {
    return next(new Error('Serviços precisam ter uma duração definida'));
  }
  if (this.category === 'produto') {
    this.duration = undefined;
  }
  return next();
});

module.exports = mongoose.model('Product', productSchema);
