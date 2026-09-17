import express from 'express';
import * as dependencyController from '../controllers/dependencyController.js';

const router = express.Router();

router.post('/', dependencyController.createDependency);
router.delete('/:id', dependencyController.deleteDependency);

export default router;
