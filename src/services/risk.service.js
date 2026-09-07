const Wellness = require("../models/Wellness");
const Risk = require("../models/Risk");
const { getWorkloadScore } = require("./workload.service");

/**
 * Fetches the most recent wellness check-in for a personnel member.
 */
const getLatestWellness = async (personnelId) => {
  return Wellness.findOne({ personnel: personnelId }).sort({ checkInDate: -1 });
};

/**
 * Calculates a composite risk score (0-100) from workload and wellness data,
 * persists it as a Risk document, and returns the result.
 */
const calculateRisk = async (personnelId) => {
  const { workloadScore } = await getWorkloadScore(personnelId);
  const wellness = await getLatestWellness(personnelId);

  const factors = [{ name: "workload", weight: 0.4, value: workloadScore }];

  let wellnessRiskScore = 0;
  if (wellness) {
    const sleepDeficit = Math.max(0, 8 - (wellness.sleepHours ?? 8)) * 12.5; // 0-100
    const stress = (wellness.stressLevel ?? 1) * 10; // 0-100
    const fatigue = (wellness.physicalFatigue ?? 1) * 10; // 0-100
    const lowMood = (10 - (wellness.moodScore ?? 10)) * 10; // 0-100

    wellnessRiskScore =
      sleepDeficit * 0.25 + stress * 0.3 + fatigue * 0.25 + lowMood * 0.2;

    factors.push(
      { name: "sleepDeficit", weight: 0.15, value: Math.round(sleepDeficit) },
      { name: "stress", weight: 0.18, value: Math.round(stress) },
      { name: "fatigue", weight: 0.15, value: Math.round(fatigue) },
      { name: "lowMood", weight: 0.12, value: Math.round(lowMood) }
    );
  }

  const riskScore = Math.round(workloadScore * 0.4 + wellnessRiskScore * 0.6);

  let riskLevel = "low";
  if (riskScore >= 80) riskLevel = "critical";
  else if (riskScore >= 60) riskLevel = "high";
  else if (riskScore >= 35) riskLevel = "moderate";

  const risk = await Risk.create({
    personnel: personnelId,
    riskScore,
    riskLevel,
    factors,
    generatedBy: "system",
  });

  return risk;
};

module.exports = { calculateRisk, getLatestWellness };
