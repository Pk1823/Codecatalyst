const mongoose = require("mongoose");

const WellnessSchema = new mongoose.Schema(
  {
    personnel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Personnel",
      required: true,
    },
    checkInDate: {
      type: Date,
      default: Date.now,
    },
    sleepHours: { type: Number, min: 0, max: 24 },
    stressLevel: { type: Number, min: 1, max: 10 },
    moodScore: { type: Number, min: 1, max: 10 },
    physicalFatigue: { type: Number, min: 1, max: 10 },
    notes: { type: String },
    submittedBy: {
      type: String,
      enum: ["self", "medical", "commander"],
      default: "self",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Wellness", WellnessSchema);
