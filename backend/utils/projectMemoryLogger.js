import ProjectMemory from '../models/ProjectMemory.js';

/**
 * Helper to append an entry to ProjectMemory.
 *
 * @param {Object} params
 * @param {string} params.projectId
 * @param {string} params.eventType
 * @param {string} params.summary
 * @param {string} [params.actorType='system'] - 'stakeholder' | 'system'
 * @param {string} [params.actorRef=null] - Stakeholder ObjectId if actorType is 'stakeholder'
 */
export async function logMemory({ projectId, eventType, summary, actorType = 'system', actorRef = null }) {
  const memoryEntry = new ProjectMemory({
    project: projectId,
    eventType,
    summary,
    actor: {
      type: actorType,
      ref: actorRef
    }
  });

  return await memoryEntry.save();
}
