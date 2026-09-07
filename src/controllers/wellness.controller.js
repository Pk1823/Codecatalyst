const Wellness = require('../models/Wellness');

// @desc  Submit a wellness check-in
// @route POST /api/wellness
const createWellness = async (req, res) => {
  try {
    const wellness = await Wellness.create(req.body);
    res.status(201).json({ success: true, data: wellness });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc  Get all wellness check-ins
// @route GET /api/wellness
const getAllWellness = async (req, res) => {
  try {
    const { personnel } = req.query;
    const filter = {};
    if (personnel) filter.personnel = personnel;

    const records = await Wellness.find(filter)
      .populate('personnel', 'firstName lastName serviceId')
      .sort({ checkInDate: -1 });

    res.status(200).json({ success: true, count: records.length, data: records });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Get single wellness check-in
// @route GET /api/wellness/:id
const getWellnessById = async (req, res) => {
  try {
    const record = await Wellness.findById(req.params.id).populate(
      'personnel',
      'firstName lastName serviceId'
    );
    if (!record) {
      return res.status(404).json({ success: false, message: 'Wellness record not found' });
    }
    res.status(200).json({ success: true, data: record });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Update wellness check-in
// @route PUT /api/wellness/:id
const updateWellness = async (req, res) => {
  try {
    const record = await Wellness.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!record) {
      return res.status(404).json({ success: false, message: 'Wellness record not found' });
    }
    res.status(200).json({ success: true, data: record });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc  Delete wellness check-in
// @route DELETE /api/wellness/:id
const deleteWellness = async (req, res) => {
  try {
    const record = await Wellness.findByIdAndDelete(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Wellness record not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  createWellness,
  getAllWellness,
  getWellnessById,
  updateWellness,
  deleteWellness,
};
