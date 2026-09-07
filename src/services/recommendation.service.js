const Recommendation = require('../models/Recommendation');

const generateRecommendation = async (risk) => {
  let type = 'monitor';
  let priority = 'low';
  let message = 'Continue routine monitoring. No immediate action required.';

  switch (risk.riskLevel) {
    case 'critical':
      type = 'medical_review';
      priority = 'urgent';
      message =
        'Critical risk detected. Immediate medical and command review recommended, along with mandatory rest.';
      break;
    case 'high':
      type = 'rest';
      priority = 'high';
      message =
        'High risk indicators present. Recommend reduced duty load, rest period, and a wellness check-in within 48 hours.';
      break;
    case 'moderate':
      type = 'counseling';
      priority = 'medium';
      message =
        'Moderate risk indicators present. Recommend a wellness/counseling check-in and workload review.';
      break;
    default:
      type = 'monitor';
      priority = 'low';
      message = 'Risk levels within normal range. Continue routine monitoring.';
  }

  const recommendation = await Recommendation.create({
    personnel: risk.personnel,
    risk: risk._id,
    type,
    priority,
    message,
    status: 'open',
  });

  return recommendation;
};

module.exports = { generateRecommendation };
