const Duty = require('../models/Duty');
const { getWorkloadScore, getTotalDutyHours } = require('../services/workload.service');

// @desc  Log a new duty entry
// @route POST /api/duty
const createDuty = async (req, res) => {
  try {
    const duty = await Duty.create(req.body);
    res.status(201).json({ success: true, data: duty });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc  Get all duty entries (optionally filter by personnel)
// @route GET /api/duty
const getAllDuties = async (req, res) => {
  try {
    const { personnel } = req.query;
    const filter = {};
    if (personnel) filter.personnel = personnel;

    const duties = await Duty.find(filter).populate('personnel', 'firstName lastName serviceId').sort({ startTime: -1 });
    res.status(200).json({ success: true, count: duties.length, data: duties });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Get single duty entry
// @route GET /api/duty/:id
const getDutyById = async (req, res) => {
  try {
    const duty = await Duty.findById(req.params.id).populate('personnel', 'firstName lastName serviceId');
    if (!duty) {
      return res.status(404).json({ success: false, message: 'Duty entry not found' });
    }
    res.status(200).json({ success: true, data: duty });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Update duty entry
// @route PUT /api/duty/:id
const updateDuty = async (req, res) => {
  try {
    const duty = await Duty.findById(req.params.id);
    if (!duty) {
      return res.status(404).json({ success: false, message: 'Duty entry not found' });
    }
    Object.assign(duty, req.body);
    await duty.save();
    res.status(200).json({ success: true, data: duty });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc  Delete duty entry
// @route DELETE /api/duty/:id
const deleteDuty = async (req, res) => {
  try {
    const duty = await Duty.findByIdAndDelete(req.params.id);
    if (!duty) {
      return res.status(404).json({ success: false, message: 'Duty entry not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Get workload summary for a personnel member
// @route GET /api/duty/workload/:personnelId
const getWorkloadSummary = async (req, res) => {
  try {
    const { personnelId } = req.params;
    const { startDate, endDate } = req.query;

    const totals = await getTotalDutyHours(personnelId, startDate, endDate);
    const workload = await getWorkloadScore(personnelId);

    res.status(200).json({
      success: true,
      data: { ...totals, ...workload },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  createDuty,
  getAllDuties,
  getDutyById,
  updateDuty,
  deleteDuty,
  getWorkloadSummary,
};
