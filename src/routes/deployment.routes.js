const express = require('express');
const router = express.Router();
const {
  createDeployment,
  getAllDeployments,
  getDeploymentById,
  updateDeployment,
  deleteDeployment,
} = require('../../controllers/deployment.controller');
const { protect } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/role.middleware');

router.use(protect);

router
  .route('/')
  .get(getAllDeployments)
  .post(authorize('admin', 'commander'), createDeployment);

router
  .route('/:id')
  .get(getDeploymentById)
  .put(authorize('admin', 'commander'), updateDeployment)
  .delete(authorize('admin'), deleteDeployment);

module.exports = router;
