import express from 'express';
import * as stakeholderController from '../controllers/stakeholderController.js';
import * as alertController from '../controllers/alertController.js';

const router = express.Router();

router.post('/', stakeholderController.createStakeholder);
router.get('/:id', stakeholderController.getStakeholderById);
router.put('/:id', stakeholderController.updateStakeholder);

// Stakeholder Alerts routes
router.get('/:stakeholderId/alerts', alertController.getStakeholderAlerts);
router.get('/:stakeholderId/alerts/unread', alertController.getUnreadStakeholderAlerts);

export default router;
