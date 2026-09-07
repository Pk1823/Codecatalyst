const Deployment = require("../src/models/Deployment");

// @desc  Create deployment record
// @route POST /api/deployment
const createDeployment = async (req, res) => {
  try {
    const deployment = await Deployment.create(req.body);
    res.status(201).json({ success: true, data: deployment });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc  Get all deployments
// @route GET /api/deployment
const getAllDeployments = async (req, res) => {
  try {
    const { status, personnel } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (personnel) filter.personnel = personnel;

    const deployments = await Deployment.find(filter)
      .populate("personnel", "firstName lastName serviceId")
      .sort({ startDate: -1 });

    res
      .status(200)
      .json({ success: true, count: deployments.length, data: deployments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Get single deployment
// @route GET /api/deployment/:id
const getDeploymentById = async (req, res) => {
  try {
    const deployment = await Deployment.findById(req.params.id).populate(
      "personnel",
      "firstName lastName serviceId"
    );
    if (!deployment) {
      return res
        .status(404)
        .json({ success: false, message: "Deployment not found" });
    }
    res.status(200).json({ success: true, data: deployment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Update deployment
// @route PUT /api/deployment/:id
const updateDeployment = async (req, res) => {
  try {
    const deployment = await Deployment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!deployment) {
      return res
        .status(404)
        .json({ success: false, message: "Deployment not found" });
    }
    res.status(200).json({ success: true, data: deployment });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc  Delete deployment
// @route DELETE /api/deployment/:id
const deleteDeployment = async (req, res) => {
  try {
    const deployment = await Deployment.findByIdAndDelete(req.params.id);
    if (!deployment) {
      return res
        .status(404)
        .json({ success: false, message: "Deployment not found" });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  createDeployment,
  getAllDeployments,
  getDeploymentById,
  updateDeployment,
  deleteDeployment,
};
