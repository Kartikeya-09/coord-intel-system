import express from 'express';
import * as changeEventController from '../controllers/changeEventController.js';
import * as impactResultController from '../controllers/impactResultController.js';

const router = express.Router();

router.post('/', changeEventController.createChangeEvent);
router.get('/:id', changeEventController.getChangeEventById);
router.get('/:changeEventId/impact-result', impactResultController.getImpactResultByChangeEvent);

export default router;
