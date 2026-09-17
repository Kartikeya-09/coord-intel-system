import Project from '../models/Project.js';
import Activity from '../models/Activity.js';

export const createProject = async (req, res) => {
  const { name, client, startDate, endDate, phase, stakeholders } = req.body;

  if (!name || !client) {
    return res.status(400).json({
      error: { message: 'Missing required fields: name and client are required' }
    });
  }

  const project = new Project({
    name,
    client,
    startDate,
    endDate,
    phase,
    stakeholders: stakeholders || []
  });

  await project.save();
  const populated = await Project.findById(project._id).populate('client');
  res.status(201).json(populated);
};

export const getProjects = async (req, res) => {
  const projects = await Project.find().populate('client');
  res.json(projects);
};

export const getProjectById = async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate('client')
    .populate('stakeholders.stakeholder');

  if (!project) {
    return res.status(404).json({ error: { message: 'Project not found' } });
  }

  const activitiesCount = await Activity.countDocuments({ project: project._id });

  const projectObj = project.toObject();
  projectObj.activitiesCount = activitiesCount;

  res.json(projectObj);
};

export const updateProject = async (req, res) => {
  const { name, phase, startDate, endDate } = req.body;
  const project = await Project.findById(req.params.id);

  if (!project) {
    return res.status(404).json({ error: { message: 'Project not found' } });
  }

  if (name !== undefined) project.name = name;
  if (phase !== undefined) project.phase = phase;
  if (startDate !== undefined) project.startDate = startDate;
  if (endDate !== undefined) project.endDate = endDate;

  await project.save();
  const updated = await Project.findById(project._id).populate('client').populate('stakeholders.stakeholder');
  res.json(updated);
};

export const getProjectStakeholders = async (req, res) => {
  const project = await Project.findById(req.params.projectId).populate('stakeholders.stakeholder');

  if (!project) {
    return res.status(404).json({ error: { message: 'Project not found' } });
  }

  res.json(project.stakeholders);
};

export const addProjectStakeholder = async (req, res) => {
  const { projectId, stakeholderId } = req.params;
  const { responsibilityAreas } = req.body;

  const project = await Project.findById(projectId);
  if (!project) {
    return res.status(404).json({ error: { message: 'Project not found' } });
  }

  const alreadyExists = project.stakeholders.some(
    (s) => s.stakeholder.toString() === stakeholderId
  );

  if (alreadyExists) {
    return res.status(400).json({
      error: { message: 'Stakeholder already added to this project' }
    });
  }

  project.stakeholders.push({
    stakeholder: stakeholderId,
    responsibilityAreas: responsibilityAreas || []
  });

  await project.save();
  const updated = await Project.findById(projectId).populate('stakeholders.stakeholder');
  res.status(201).json(updated.stakeholders);
};

export const removeProjectStakeholder = async (req, res) => {
  const { projectId, stakeholderId } = req.params;

  const project = await Project.findById(projectId);
  if (!project) {
    return res.status(404).json({ error: { message: 'Project not found' } });
  }

  project.stakeholders = project.stakeholders.filter(
    (s) => s.stakeholder.toString() !== stakeholderId
  );

  await project.save();
  res.json({ message: 'Stakeholder removed from project' });
};
