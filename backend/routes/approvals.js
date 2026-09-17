import express from 'express';
import * as approvalController from '../controllers/approvalController.js';

const router = express.Router();

router.post('/', approvalController.createApproval);
router.get('/:id', approvalController.getApprovalById);
router.put('/:id', approvalController.updateApproval);

export default router;
