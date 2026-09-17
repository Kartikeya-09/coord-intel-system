const express = require('express');
const router = express.Router();
const stakeholderController = require('../controllers/stakeholderController');

const alertController = require('../controllers/alertController');

router.post('/', stakeholderController.createStakeholder);
router.get('/:id', stakeholderController.getStakeholderById);
router.put('/:id', stakeholderController.updateStakeholder);

// Stakeholder Alerts routes
router.get('/:stakeholderId/alerts', alertController.getStakeholderAlerts);
router.get('/:stakeholderId/alerts/unread', alertController.getUnreadStakeholderAlerts);

module.exports = router;
