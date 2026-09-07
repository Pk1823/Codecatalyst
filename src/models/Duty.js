const mongoose = require('mongoose');

const DutySchema = new mongoose.Schema(
  {
    personnel: { type: mongoose.Schema.Types.ObjectId, ref: 'Personnel', required: true },
    dutyType: { type: String, required: true, trim: true },
    location: { type: String, trim: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    hoursLogged: { type: Number, default: 0 },
    intensity: {
      type: String,
      enum: ['low', 'moderate', 'high', 'extreme'],
      default: 'moderate',
    },
    notes: { type: String },
  },
  { timestamps: true }
);

DutySchema.pre('save', function (next) {
  if (this.startTime && this.endTime) {
    this.hoursLogged = Math.max(0, (this.endTime - this.startTime) / (1000 * 60 * 60));
  }
  next();
});

module.exports = mongoose.model('Duty', DutySchema);
