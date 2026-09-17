const Dependency = require('../models/Dependency');
const Activity = require('../models/Activity');
const Approval = require('../models/Approval');

function validateEntityTypePair(fromModel, toModel) {
  const validPairs = [
    'Activity->Activity',
    'Activity->Approval',
    'Approval->Activity'
  ];
  return validPairs.includes(`${fromModel}->${toModel}`);
}

async function getEntityName(id, model) {
  if (model === 'Activity') {
    const act = await Activity.findById(id).select('name').lean();
    return act ? act.name : id.toString();
  } else if (model === 'Approval') {
    const app = await Approval.findById(id).select('title').lean();
    return app ? app.title : id.toString();
  }
  return id.toString();
}

async function detectCycle(projectId, fromEntityId, toEntityId) {
  const edges = await Dependency.find({ project: projectId }).lean();

  const fromStr = fromEntityId.toString();
  const toStr = toEntityId.toString();

  // Self-cycle check u -> u
  if (fromStr === toStr) {
    const name = await getEntityName(fromEntityId, 'Activity');
    return {
      hasCycle: true,
      path: [name, name]
    };
  }

  // Build adjacency list: fromEntityId -> Array<{ toEntityId, toModel }>
  const adjMap = new Map();
  for (const edge of edges) {
    const key = edge.fromEntity.toString();
    if (!adjMap.has(key)) {
      adjMap.set(key, []);
    }
    adjMap.get(key).push({
      toEntityId: edge.toEntity.toString(),
      toModel: edge.toModel
    });
  }

  // BFS starting from toEntityId looking for fromEntityId
  const queue = [{ currentId: toStr, path: [toStr] }];
  const visited = new Set();

  while (queue.length > 0) {
    const { currentId, path } = queue.shift();

    if (currentId === fromStr) {
      // Cycle detected! The complete cycle path is fromEntityId -> path (starting at toEntityId and ending at fromEntityId)
      const fullPathIds = [fromStr, ...path];

      // Resolve human-readable names for the path
      const pathNames = await Promise.all(
        fullPathIds.map(async (idStr) => {
          // Try Activity first, then Approval
          const act = await Activity.findById(idStr).select('name').lean();
          if (act) return act.name;
          const app = await Approval.findById(idStr).select('title').lean();
          if (app) return app.title;
          return idStr;
        })
      );

      return {
        hasCycle: true,
        path: pathNames
      };
    }

    if (visited.has(currentId)) continue;
    visited.add(currentId);

    const neighbors = adjMap.get(currentId) || [];
    for (const n of neighbors) {
      if (!visited.has(n.toEntityId)) {
        queue.push({
          currentId: n.toEntityId,
          path: [...path, n.toEntityId]
        });
      }
    }
  }

  return { hasCycle: false };
}

module.exports = {
  validateEntityTypePair,
  detectCycle
};
