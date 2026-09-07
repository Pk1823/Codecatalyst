const mongoose = require('mongoose');

const LeaveSchema = new mongoose.Schema(
  {
    personnel: { type: mongoose.Schema.Types.ObjectId, ref: 'Personnel', required: true },
    leaveType: {
      type: String,
      enum: ['annual', 'sick', 'emergency', 'medical', 'compassionate', 'unpaid'],
      required: true,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    daysRequested: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'cancelled'],
      default: 'pending',
    },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reason: { type: String },
  },
  { timestamps: true }
);

LeaveSchema.pre('save', function (next) {
  if (this.startDate && this.endDate) {
    const diff = (this.endDate - this.startDate) / (1000 * 60 * 60 * 24);
    this.daysRequested = Math.max(1, Math.round(diff) + 1);
  }
  next();
});

module.exports = mongoose.model('Leave', LeaveSchema);
