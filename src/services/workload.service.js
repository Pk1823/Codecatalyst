const Duty = require("../models/Duty");

/**
 * Calculates total duty hours logged by a personnel member within a date range.
 */
const getTotalDutyHours = async (personnelId, startDate, endDate) => {
  const match = { personnel: personnelId };
  if (startDate || endDate) {
    match.startTime = {};
    if (startDate) match.startTime.$gte = new Date(startDate);
    if (endDate) match.startTime.$lte = new Date(endDate);
  }

  const duties = await Duty.find(match);
  const totalHours = duties.reduce(
    (sum, duty) => sum + (duty.hoursLogged || 0),
    0
  );

  return { totalHours, dutyCount: duties.length, duties };
};

const getWorkloadScore = async (personnelId) => {
  const now = new Date();
  const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);

  const intensityWeights = { low: 1, moderate: 1.3, high: 1.6, extreme: 2 };

  const recentDuties = await Duty.find({
    personnel: personnelId,
    startTime: { $gte: thirtyDaysAgo },
  });

  let weightedHours7d = 0;
  let weightedHours30d = 0;

  recentDuties.forEach((duty) => {
    const weight = intensityWeights[duty.intensity] || 1;
    const weightedHours = (duty.hoursLogged || 0) * weight;
    weightedHours30d += weightedHours;
    if (duty.startTime >= sevenDaysAgo) {
      weightedHours7d += weightedHours;
    }
  });

  const score7d = Math.min(100, (weightedHours7d / 60) * 100);
  const score30d = Math.min(100, (weightedHours30d / 240) * 100);

  const workloadScore = Math.round(score7d * 0.6 + score30d * 0.4);

  return {
    workloadScore,
    weightedHours7d: Math.round(weightedHours7d * 10) / 10,
    weightedHours30d: Math.round(weightedHours30d * 10) / 10,
  };
};

module.exports = { getTotalDutyHours, getWorkloadScore };
