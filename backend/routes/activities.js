import express from 'express';
import * as activityController from '../controllers/activityController.js';

const router = express.Router();

router.post('/', activityController.createActivity);
router.get('/:id', activityController.getActivityById);
router.put('/:id', activityController.updateActivity);

export default router;
