import express from 'express';
import * as projectController from '../controllers/projectController.js';
import * as activityController from '../controllers/activityController.js';
import * as dependencyController from '../controllers/dependencyController.js';
import * as approvalController from '../controllers/approvalController.js';
import * as changeEventController from '../controllers/changeEventController.js';
import * as actionController from '../controllers/actionController.js';
import * as projectMemoryController from '../controllers/projectMemoryController.js';

const router = express.Router();

router.post('/', projectController.createProject);
router.get('/', projectController.getProjects);
router.get('/:id', projectController.getProjectById);
router.put('/:id', projectController.updateProject);

// Project Activities, Dependencies, Approvals, Change Events, Actions & Memory routes
router.get('/:projectId/activities', activityController.getProjectActivities);
router.get('/:projectId/dependencies', dependencyController.getProjectDependencies);
router.get('/:projectId/approvals', approvalController.getProjectApprovals);
router.get('/:projectId/change-events', changeEventController.getProjectChangeEvents);
router.get('/:projectId/actions', actionController.getProjectActions);
router.get('/:projectId/memory', projectMemoryController.getProjectMemory);

// Project Stakeholders routes
router.get('/:projectId/stakeholders', projectController.getProjectStakeholders);
router.post('/:projectId/stakeholders/:stakeholderId', projectController.addProjectStakeholder);
router.delete('/:projectId/stakeholders/:stakeholderId', projectController.removeProjectStakeholder);

export default router;
