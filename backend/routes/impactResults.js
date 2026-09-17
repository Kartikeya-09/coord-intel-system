const express = require('express');
const router = express.Router();
const impactResultController = require('../controllers/impactResultController');

router.get('/:id', impactResultController.getImpactResultById);

module.exports = router;
