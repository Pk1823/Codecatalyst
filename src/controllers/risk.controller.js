const Risk = require('../models/Risk');
const Recommendation = require('../models/Recommendation');
const { calculateRisk } = require('../services/risk.service');
const { generateRecommendation } = require('../services/recommendation.service');

// @desc  Trigger a risk evaluation for a personnel member (also creates a recommendation)
// @route POST /api/risk/evaluate/:personnelId
const evaluateRisk = async (req, res) => {
  try {
    const { personnelId } = req.params;
    const risk = await calculateRisk(personnelId);
    const recommendation = await generateRecommendation(risk);

    res.status(201).json({ success: true, data: { risk, recommendation } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Get all risk evaluations
// @route GET /api/risk
const getAllRisks = async (req, res) => {
  try {
    const { personnel, riskLevel } = req.query;
    const filter = {};
    if (personnel) filter.personnel = personnel;
    if (riskLevel) filter.riskLevel = riskLevel;

    const risks = await Risk.find(filter)
      .populate('personnel', 'firstName lastName serviceId')
      .sort({ evaluatedAt: -1 });

    res.status(200).json({ success: true, count: risks.length, data: risks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Get single risk evaluation
// @route GET /api/risk/:id
const getRiskById = async (req, res) => {
  try {
    const risk = await Risk.findById(req.params.id).populate(
      'personnel',
      'firstName lastName serviceId'
    );
    if (!risk) {
      return res.status(404).json({ success: false, message: 'Risk record not found' });
    }
    res.status(200).json({ success: true, data: risk });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Get all recommendations (optionally filter by personnel/status)
// @route GET /api/risk/recommendations
const getRecommendations = async (req, res) => {
  try {
    const { personnel, status, priority } = req.query;
    const filter = {};
    if (personnel) filter.personnel = personnel;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const recommendations = await Recommendation.find(filter)
      .populate('personnel', 'firstName lastName serviceId')
      .populate('risk')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: recommendations.length, data: recommendations });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Update a recommendation's status (acknowledge/action/dismiss)
// @route PUT /api/risk/recommendations/:id
const updateRecommendation = async (req, res) => {
  try {
    const updates = { ...req.body, reviewedBy: req.user?._id };
    const recommendation = await Recommendation.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!recommendation) {
      return res.status(404).json({ success: false, message: 'Recommendation not found' });
    }
    res.status(200).json({ success: true, data: recommendation });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

module.exports = {
  evaluateRisk,
  getAllRisks,
  getRiskById,
  getRecommendations,
  updateRecommendation,
};
