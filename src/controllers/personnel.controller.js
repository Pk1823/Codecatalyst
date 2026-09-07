const Personnel = require('../models/Personnel');

// @desc  Create personnel record
// @route POST /api/personnel
const createPersonnel = async (req, res) => {
  try {
    const personnel = await Personnel.create(req.body);
    res.status(201).json({ success: true, data: personnel });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc  Get all personnel
// @route GET /api/personnel
const getAllPersonnel = async (req, res) => {
  try {
    const { status, unit } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (unit) filter.unit = unit;

    const personnel = await Personnel.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: personnel.length, data: personnel });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Get single personnel by ID
// @route GET /api/personnel/:id
const getPersonnelById = async (req, res) => {
  try {
    const personnel = await Personnel.findById(req.params.id);
    if (!personnel) {
      return res.status(404).json({ success: false, message: 'Personnel not found' });
    }
    res.status(200).json({ success: true, data: personnel });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Update personnel
// @route PUT /api/personnel/:id
const updatePersonnel = async (req, res) => {
  try {
    const personnel = await Personnel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!personnel) {
      return res.status(404).json({ success: false, message: 'Personnel not found' });
    }
    res.status(200).json({ success: true, data: personnel });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc  Delete personnel
// @route DELETE /api/personnel/:id
const deletePersonnel = async (req, res) => {
  try {
    const personnel = await Personnel.findByIdAndDelete(req.params.id);
    if (!personnel) {
      return res.status(404).json({ success: false, message: 'Personnel not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  createPersonnel,
  getAllPersonnel,
  getPersonnelById,
  updatePersonnel,
  deletePersonnel,
};
