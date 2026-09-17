const Dependency = require('../models/Dependency');
const Activity = require('../models/Activity');
const Approval = require('../models/Approval');

/**
 * Recalculates and updates downstream activity blocking status when an Approval's status changes.
 *
 * @param {string} approvalId - ObjectId string of the Approval
 * @param {string} newStatus  - 'pending' | 'approved' | 'rejected'
 * @param {string} projectId   - ObjectId string of the Project
 */
async function applyBlockingForApproval(approvalId, newStatus, projectId) {
  // Find all dependencies where this approval is upstream of an Activity
  const downstreamEdges = await Dependency.find({
    project: projectId,
    fromEntity: approvalId,
    fromModel: 'Approval',
    toModel: 'Activity'
  }).lean();

  if (downstreamEdges.length === 0) return;

  const downstreamActivityIds = downstreamEdges.map((edge) => edge.toEntity);

  for (const actId of downstreamActivityIds) {
    if (newStatus === 'pending' || newStatus === 'rejected') {
      // Flag activity as blocked
      await Activity.findByIdAndUpdate(actId, {
        isBlocked: true,
        status: 'blocked'
      });
    } else if (newStatus === 'approved') {
      // Check if there are any other upstream Approval dependencies that are still pending or rejected
      const upstreamApprovalEdges = await Dependency.find({
        project: projectId,
        toEntity: actId,
        toModel: 'Activity',
        fromModel: 'Approval'
      }).lean();

      const upstreamApprovalIds = upstreamApprovalEdges.map((e) => e.fromEntity);

      // Fetch status of all upstream approvals for this activity
      const blockingApprovals = await Approval.find({
        _id: { $in: upstreamApprovalIds },
        status: { $in: ['pending', 'rejected'] }
      }).lean();

      // If no other blocking approvals exist, unblock the activity
      if (blockingApprovals.length === 0) {
        await Activity.findByIdAndUpdate(actId, {
          isBlocked: false,
          status: 'pending'
        });
      }
    }
  }
}

module.exports = {
  applyBlockingForApproval
};
