const mongoose = require('mongoose');

const RecommendationSchema = new mongoose.Schema(
  {
    personnel: { type: mongoose.Schema.Types.ObjectId, ref: 'Personnel', required: true },
    risk: { type: mongoose.Schema.Types.ObjectId, ref: 'Risk' },
    type: {
      type: String,
      enum: ['rest', 'medical_review', 'reassignment', 'leave', 'counseling', 'monitor'],
      required: true,
    },
    message: { type: String, required: true },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['open', 'acknowledged', 'actioned', 'dismissed'],
      default: 'open',
    },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Recommendation', RecommendationSchema);
