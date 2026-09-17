const express = require('express');
const router = express.Router();
const dependencyController = require('../controllers/dependencyController');

router.post('/', dependencyController.createDependency);
router.delete('/:id', dependencyController.deleteDependency);

module.exports = router;
