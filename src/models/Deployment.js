const mongoose = require("mongoose");

const DeploymentSchema = new mongoose.Schema(
  {
    personnel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Personnel",
      required: true,
    },
    missionName: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    status: {
      type: String,
      enum: ["scheduled", "active", "completed", "cancelled"],
      default: "scheduled",
    },
    riskLevel: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Deployment", DeploymentSchema);
 