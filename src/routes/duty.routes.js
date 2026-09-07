const express = require('express');
const router = express.Router();
const {
  createDuty,
  getAllDuties,
  getDutyById,
  updateDuty,
  deleteDuty,
  getWorkloadSummary,
} = require('../controllers/duty.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

router.use(protect);

router.get('/workload/:personnelId', getWorkloadSummary);

router
  .route('/')
  .get(getAllDuties)
  .post(authorize('admin', 'commander'), createDuty);

router
  .route('/:id')
  .get(getDutyById)
  .put(authorize('admin', 'commander'), updateDuty)
  .delete(authorize('admin', 'commander'), deleteDuty);

module.exports = router;
