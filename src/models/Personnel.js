const mongoose = require('mongoose');

const PersonnelSchema = new mongoose.Schema(
  {
    serviceId: { type: String, required: true, unique: true, trim: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    rank: { type: String, required: true, trim: true },
    unit: { type: String, required: true, trim: true },
    dateOfBirth: { type: Date },
    dateOfEnlistment: { type: Date },
    contact: {
      phone: { type: String },
      email: { type: String },
      emergencyContact: { type: String },
    },
    status: {
      type: String,
      enum: ['active', 'on_leave', 'deployed', 'medical', 'discharged'],
      default: 'active',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Personnel', PersonnelSchema);
