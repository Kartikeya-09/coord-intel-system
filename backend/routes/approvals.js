const express = require('express');
const router = express.Router();
const approvalController = require('../controllers/approvalController');

router.post('/', approvalController.createApproval);
router.get('/:id', approvalController.getApprovalById);
router.put('/:id', approvalController.updateApproval);

module.exports = router;
