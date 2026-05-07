const express = require('express');
const router = express.Router();
const { getMentors, getMentor, addResource } = require('../controllers/mentorController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getMentors);
router.get('/:id', getMentor);
router.post('/me/resources', protect, authorize('mentor'), addResource);

module.exports = router;
