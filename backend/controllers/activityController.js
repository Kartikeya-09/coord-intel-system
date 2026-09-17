import Activity from '../models/Activity.js';

export const createActivity = async (req, res) => {
  const { name, description, owner, project, status, dueDate } = req.body;

  if (!name || !owner || !project) {
    return res.status(400).json({
      error: { message: 'Missing required fields: name, owner, and project are required' }
    });
  }

  const activity = new Activity({
    name,
    description,
    owner,
    project,
    status,
    dueDate
  });

  await activity.save();
  const populated = await Activity.findById(activity._id).populate('owner');
  res.status(201).json(populated);
};

export const getActivityById = async (req, res) => {
  const activity = await Activity.findById(req.params.id).populate('owner');
  if (!activity) {
    return res.status(404).json({ error: { message: 'Activity not found' } });
  }
  res.json(activity);
};

export const updateActivity = async (req, res) => {
  const { name, description, owner, status, dueDate } = req.body;
  const activity = await Activity.findById(req.params.id);

  if (!activity) {
    return res.status(404).json({ error: { message: 'Activity not found' } });
  }

  if (name !== undefined) activity.name = name;
  if (description !== undefined) activity.description = description;
  if (owner !== undefined) activity.owner = owner;
  if (status !== undefined) activity.status = status;
  if (dueDate !== undefined) activity.dueDate = dueDate;

  await activity.save();
  const updated = await Activity.findById(activity._id).populate('owner');
  res.json(updated);
};

export const getProjectActivities = async (req, res) => {
  const { projectId } = req.params;
  const activities = await Activity.find({ project: projectId }).populate('owner');
  res.json(activities);
};
