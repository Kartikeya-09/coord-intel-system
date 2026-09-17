import express from 'express';
import * as actionController from '../controllers/actionController.js';

const router = express.Router();

router.post('/', actionController.createAction);
router.get('/:id', actionController.getActionById);
router.put('/:id', actionController.updateAction);

export default router;
