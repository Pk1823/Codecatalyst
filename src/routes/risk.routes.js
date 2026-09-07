const express = require('express');
const router = express.Router();
const {
  evaluateRisk,
  getAllRisks,
  getRiskById,
  getRecommendations,
  updateRecommendation,
} = require('../controllers/risk.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

router.use(protect);

router.post(
  '/evaluate/:personnelId',
  authorize('admin', 'commander', 'medical'),
  evaluateRisk
);

router.get('/recommendations', getRecommendations);
router.put(
  '/recommendations/:id',
  authorize('admin', 'commander', 'medical'),
  updateRecommendation
);

router.get('/', getAllRisks);
router.get('/:id', getRiskById);

module.exports = router;
