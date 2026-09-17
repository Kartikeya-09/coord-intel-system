import Dependency from '../models/Dependency.js';
import * as dependencyService from '../services/dependencyService.js';

export const createDependency = async (req, res) => {
  const { project, fromEntity, fromModel, toEntity, toModel } = req.body;

  if (!project || !fromEntity || !fromModel || !toEntity || !toModel) {
    return res.status(400).json({
      error: { message: 'Missing required fields for dependency creation' }
    });
  }

  // Validate entity type pair
  if (!dependencyService.validateEntityTypePair(fromModel, toModel)) {
    return res.status(422).json({
      error: { message: `Invalid dependency pair: ${fromModel} to ${toModel} is not allowed` }
    });
  }

  // Check cycle
  const cycleResult = await dependencyService.detectCycle(project, fromEntity, toEntity);
  if (cycleResult.hasCycle) {
    return res.status(422).json({
      error: {
        message: `Dependency would create a cycle: path is ${cycleResult.path.join(' → ')}`
      }
    });
  }

  const dependency = new Dependency({
    project,
    fromEntity,
    fromModel,
    toEntity,
    toModel
  });

  await dependency.save();
  res.status(201).json(dependency);
};

export const deleteDependency = async (req, res) => {
  const dependency = await Dependency.findById(req.params.id);
  if (!dependency) {
    return res.status(404).json({ error: { message: 'Dependency not found' } });
  }

  await Dependency.findByIdAndDelete(req.params.id);
  res.json({ message: 'Dependency deleted successfully' });
};

export const getProjectDependencies = async (req, res) => {
  const { projectId } = req.params;
  const dependencies = await Dependency.find({ project: projectId })
    .populate('fromEntity')
    .populate('toEntity');

  res.json(dependencies);
};
