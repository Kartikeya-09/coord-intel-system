const express = require('express');
const router = express.Router();
const changeEventController = require('../controllers/changeEventController');
const impactResultController = require('../controllers/impactResultController');

router.post('/', changeEventController.createChangeEvent);
router.get('/:id', changeEventController.getChangeEventById);
router.get('/:changeEventId/impact-result', impactResultController.getImpactResultByChangeEvent);

module.exports = router;
