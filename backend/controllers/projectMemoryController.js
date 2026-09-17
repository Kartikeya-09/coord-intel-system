import ProjectMemory from '../models/ProjectMemory.js';

export const getProjectMemory = async (req, res) => {
  const { projectId } = req.params;
  const { type, q } = req.query;

  const filter = { project: projectId };

  if (type) {
    filter.eventType = type;
  }

  if (q) {
    filter.$text = { $search: q };
  }

  const memoryEntries = await ProjectMemory.find(filter)
    .sort({ timestamp: -1 })
    .populate('actor.ref');

  res.json(memoryEntries);
};
