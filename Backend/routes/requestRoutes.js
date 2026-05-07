const express = require('express');
const router = express.Router();
const {
  getRequests,
  createRequest,
  updateRequestStatus
} = require('../controllers/requestController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getRequests);
router.post('/', authorize('student'), createRequest);
router.patch('/:id/status', authorize('mentor', 'admin'), updateRequestStatus);

module.exports = router;
