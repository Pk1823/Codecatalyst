const express = require('express');
const router = express.Router();
const {
  createLeave,
  getAllLeaves,
  getLeaveById,
  updateLeave,
  deleteLeave,
} = require('../controllers/leave.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

router.use(protect);

router.route('/').get(getAllLeaves).post(createLeave);

router
  .route('/:id')
  .get(getLeaveById)
  .put(authorize('admin', 'commander'), updateLeave)
  .delete(deleteLeave);

module.exports = router;
