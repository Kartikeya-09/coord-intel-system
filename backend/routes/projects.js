const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

const activityController = require('../controllers/activityController');
const dependencyController = require('../controllers/dependencyController');
const approvalController = require('../controllers/approvalController');
const changeEventController = require('../controllers/changeEventController');
const actionController = require('../controllers/actionController');
const projectMemoryController = require('../controllers/projectMemoryController');

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

module.exports = router;
