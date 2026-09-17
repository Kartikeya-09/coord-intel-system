import express from 'express';
import * as impactResultController from '../controllers/impactResultController.js';

const router = express.Router();

router.get('/:id', impactResultController.getImpactResultById);

export default router;
