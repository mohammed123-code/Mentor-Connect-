const express = require('express');
const router = express.Router();
const { getSessions, createSession } = require('../controllers/sessionController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getSessions);
router.post('/', authorize('student'), createSession);

module.exports = router;
