const Dependency = require('../models/Dependency');
const Activity = require('../models/Activity');
const Approval = require('../models/Approval');

/**
 * Core Intelligence Service - BFS Traversal of Dependency Graph
 *
 * @param {Object} params
 * @param {string} params.projectId
 * @param {Array}  params.startEntities - Array of { entity || entityId, model }
 * @param {string} params.changeEventId
 * @param {string} params.changeEventName
 *
 * @returns {Promise<Object>} ImpactAnalysisResult
 */
async function run({ projectId, startEntities, changeEventId, changeEventName }) {
  if (!startEntities || startEntities.length === 0) {
    return {
      affectedActivityIds: [],
      affectedApprovalIds: [],
      affectedStakeholderIds: [],
      reasoningChains: []
    };
  }

  // 1. Fetch all dependency edges for the project
  const edges = await Dependency.find({ project: projectId })
    .select('fromEntity fromModel toEntity toModel')
    .lean();

  // 2. Build adjacency map: fromEntity_string -> Array<{ toEntityId: string, toModel: string }>
  const adjMap = new Map();
  for (const edge of edges) {
    const fromStr = edge.fromEntity.toString();
    if (!adjMap.has(fromStr)) {
      adjMap.set(fromStr, []);
    }
    adjMap.get(fromStr).push({
      toEntityId: edge.toEntity.toString(),
      toModel: edge.toModel
    });
  }

  // 3. Collect all referenced entity IDs (edges + startEntities) to bulk-fetch names and owners
  const activityIds = new Set();
  const approvalIds = new Set();

  for (const se of startEntities) {
    const rawId = (se.entityId || se.entity).toString();
    if (se.model === 'Activity') activityIds.add(rawId);
    if (se.model === 'Approval') approvalIds.add(rawId);
  }

  for (const edge of edges) {
    if (edge.fromModel === 'Activity') activityIds.add(edge.fromEntity.toString());
    if (edge.fromModel === 'Approval') approvalIds.add(edge.fromEntity.toString());
    if (edge.toModel === 'Activity') activityIds.add(edge.toEntity.toString());
    if (edge.toModel === 'Approval') approvalIds.add(edge.toEntity.toString());
  }

  const [activities, approvals] = await Promise.all([
    Activity.find({ _id: { $in: Array.from(activityIds) } }).select('name owner').lean(),
    Approval.find({ _id: { $in: Array.from(approvalIds) } }).select('title owner').lean()
  ]);

  const nameMap = new Map();
  const ownerMap = new Map();

  for (const act of activities) {
    const idStr = act._id.toString();
    nameMap.set(idStr, act.name);
    if (act.owner) ownerMap.set(idStr, act.owner.toString());
  }

  for (const app of approvals) {
    const idStr = app._id.toString();
    nameMap.set(idStr, app.title);
    if (app.owner) ownerMap.set(idStr, app.owner.toString());
  }

  // 4. Seed BFS queue
  const queue = [];
  const changeEventIdStr = changeEventId ? changeEventId.toString() : '';

  for (const se of startEntities) {
    const entityId = (se.entityId || se.entity).toString();
    const model = se.model;
    const name = nameMap.get(entityId) || '';

    const firstStep = {
      fromEntity: changeEventIdStr,
      fromModel: 'ChangeEvent',
      fromName: changeEventName,
      toEntity: entityId,
      toModel: model,
      toName: name
    };

    queue.push({
      entityId,
      model,
      name,
      pathSoFar: [firstStep]
    });
  }

  // 5. Run BFS
  const visited = new Set();
  const results = [];

  while (queue.length > 0) {
    const current = queue.shift();

    if (visited.has(current.entityId)) {
      continue;
    }
    visited.add(current.entityId);

    results.push({
      entityId: current.entityId,
      model: current.model,
      name: current.name,
      steps: current.pathSoFar
    });

    const neighbors = adjMap.get(current.entityId) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor.toEntityId)) {
        const toName = nameMap.get(neighbor.toEntityId) || '';
        const nextStep = {
          fromEntity: current.entityId,
          fromModel: current.model,
          fromName: current.name,
          toEntity: neighbor.toEntityId,
          toModel: neighbor.toModel,
          toName
        };

        queue.push({
          entityId: neighbor.toEntityId,
          model: neighbor.toModel,
          name: toName,
          pathSoFar: [...current.pathSoFar, nextStep]
        });
      }
    }
  }

  // 6. Separate affected entity IDs and stakeholders
  const affectedActivityIds = [];
  const affectedApprovalIds = [];
  const stakeholderSet = new Set();

  for (const res of results) {
    if (res.model === 'Activity') {
      affectedActivityIds.push(res.entityId);
    } else if (res.model === 'Approval') {
      affectedApprovalIds.push(res.entityId);
    }

    const ownerId = ownerMap.get(res.entityId);
    if (ownerId) {
      stakeholderSet.add(ownerId);
    }
  }

  const reasoningChains = results.map((r) => ({
    entity: r.entityId,
    model: r.model,
    name: r.name,
    steps: r.steps
  }));

  return {
    affectedActivityIds,
    affectedApprovalIds,
    affectedStakeholderIds: Array.from(stakeholderSet),
    reasoningChains
  };
}

module.exports = { run };
