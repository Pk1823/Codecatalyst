const mongoose = require('mongoose');

const RiskSchema = new mongoose.Schema(
  {
    personnel: { type: mongoose.Schema.Types.ObjectId, ref: 'Personnel', required: true },
    riskScore: { type: Number, min: 0, max: 100, required: true },
    riskLevel: {
      type: String,
      enum: ['low', 'moderate', 'high', 'critical'],
      required: true,
    },
    factors: [
      {
        name: { type: String },
        weight: { type: Number },
        value: { type: Number },
      },
    ],
    evaluatedAt: { type: Date, default: Date.now },
    generatedBy: {
      type: String,
      enum: ['system', 'manual'],
      default: 'system',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Risk', RiskSchema);
