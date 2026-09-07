const express = require('express');
const router = express.Router();
const {
  createPersonnel,
  getAllPersonnel,
  getPersonnelById,
  updatePersonnel,
  deletePersonnel,
} = require('../controllers/personnel.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

router.use(protect);

router
  .route('/')
  .get(getAllPersonnel)
  .post(authorize('admin', 'commander'), createPersonnel);

router
  .route('/:id')
  .get(getPersonnelById)
  .put(authorize('admin', 'commander'), updatePersonnel)
  .delete(authorize('admin'), deletePersonnel);

module.exports = router;
