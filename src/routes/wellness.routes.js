const express = require('express');
const router = express.Router();
const {
  createWellness,
  getAllWellness,
  getWellnessById,
  updateWellness,
  deleteWellness,
} = require('../controllers/wellness.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

router.use(protect);

router.route('/').get(getAllWellness).post(createWellness);

router
  .route('/:id')
  .get(getWellnessById)
  .put(updateWellness)
  .delete(authorize('admin', 'medical'), deleteWellness);

module.exports = router;
