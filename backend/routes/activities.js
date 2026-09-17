const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');

router.post('/', activityController.createActivity);
router.get('/:id', activityController.getActivityById);
router.put('/:id', activityController.updateActivity);

module.exports = router;
