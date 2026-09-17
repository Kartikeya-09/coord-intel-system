const express = require('express');
const router = express.Router();
const actionController = require('../controllers/actionController');

router.post('/', actionController.createAction);
router.get('/:id', actionController.getActionById);
router.put('/:id', actionController.updateAction);

module.exports = router;
