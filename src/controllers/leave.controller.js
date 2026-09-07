const Leave = require('../models/Leave');

// @desc  Request leave
// @route POST /api/leave
const createLeave = async (req, res) => {
  try {
    const leave = await Leave.create(req.body);
    res.status(201).json({ success: true, data: leave });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc  Get all leave requests
// @route GET /api/leave
const getAllLeaves = async (req, res) => {
  try {
    const { status, personnel } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (personnel) filter.personnel = personnel;

    const leaves = await Leave.find(filter)
      .populate('personnel', 'firstName lastName serviceId')
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: leaves.length, data: leaves });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Get single leave request
// @route GET /api/leave/:id
const getLeaveById = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id)
      .populate('personnel', 'firstName lastName serviceId')
      .populate('approvedBy', 'name email');
    if (!leave) {
      return res.status(404).json({ success: false, message: 'Leave request not found' });
    }
    res.status(200).json({ success: true, data: leave });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Update leave request (e.g. approve/reject)
// @route PUT /api/leave/:id
const updateLeave = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.status && ['approved', 'rejected'].includes(updates.status)) {
      updates.approvedBy = req.user?._id;
    }

    const leave = await Leave.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!leave) {
      return res.status(404).json({ success: false, message: 'Leave request not found' });
    }
    res.status(200).json({ success: true, data: leave });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc  Delete leave request
// @route DELETE /api/leave/:id
const deleteLeave = async (req, res) => {
  try {
    const leave = await Leave.findByIdAndDelete(req.params.id);
    if (!leave) {
      return res.status(404).json({ success: false, message: 'Leave request not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { createLeave, getAllLeaves, getLeaveById, updateLeave, deleteLeave };
