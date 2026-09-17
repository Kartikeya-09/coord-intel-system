const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');

router.put('/:id/read', alertController.markAlertAsRead);

module.exports = router;
