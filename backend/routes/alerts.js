import express from 'express';
import * as alertController from '../controllers/alertController.js';

const router = express.Router();

router.put('/:id/read', alertController.markAlertAsRead);

export default router;
