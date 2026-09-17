import Approval from '../models/Approval.js';
import { applyBlockingForApproval } from '../services/approvalBlockingService.js';
import { logMemory } from '../utils/projectMemoryLogger.js';

export const createApproval = async (req, res) => {
  const { title, description, owner, project, status } = req.body;

  if (!title || !owner || !project) {
    return res.status(400).json({
      error: { message: 'Missing required fields: title, owner, and project are required' }
    });
  }

  const approval = new Approval({
    title,
    description,
    owner,
    project,
    status
  });

  await approval.save();
  const populated = await Approval.findById(approval._id).populate('owner');
  res.status(201).json(populated);
};

export const getApprovalById = async (req, res) => {
  const approval = await Approval.findById(req.params.id).populate('owner');
  if (!approval) {
    return res.status(404).json({ error: { message: 'Approval not found' } });
  }
  res.json(approval);
};

export const updateApproval = async (req, res) => {
  const { title, description, owner, status } = req.body;
  const approval = await Approval.findById(req.params.id);

  if (!approval) {
    return res.status(404).json({ error: { message: 'Approval not found' } });
  }

  const oldStatus = approval.status;

  if (title !== undefined) approval.title = title;
  if (description !== undefined) approval.description = description;
  if (owner !== undefined) approval.owner = owner;
  if (status !== undefined) approval.status = status;

  await approval.save();

  if (status !== undefined && status !== oldStatus) {
    await applyBlockingForApproval(approval._id, status, approval.project);
    await logMemory({
      projectId: approval.project,
      eventType: 'approval_status_changed',
      summary: `Approval "${approval.title}" status changed to ${approval.status}`,
      actorType: 'stakeholder',
      actorRef: approval.owner
    });
  }

  const updated = await Approval.findById(approval._id).populate('owner');
  res.json(updated);
};

export const getProjectApprovals = async (req, res) => {
  const { projectId } = req.params;
  const { status } = req.query;

  const filter = { project: projectId };
  if (status) {
    filter.status = status;
  }

  const approvals = await Approval.find(filter).populate('owner');
  res.json(approvals);
};
