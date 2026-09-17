import ImpactResult from '../models/ImpactResult.js';

export const getImpactResultById = async (req, res) => {
  const impactResult = await ImpactResult.findById(req.params.id)
    .populate('affectedActivities')
    .populate('affectedApprovals')
    .populate('affectedStakeholders');

  if (!impactResult) {
    return res.status(404).json({ error: { message: 'Impact result not found' } });
  }

  res.json(impactResult);
};

export const getImpactResultByChangeEvent = async (req, res) => {
  const { changeEventId } = req.params;
  const impactResult = await ImpactResult.findOne({ changeEvent: changeEventId })
    .populate('affectedActivities')
    .populate('affectedApprovals')
    .populate('affectedStakeholders');

  if (!impactResult) {
    return res.status(404).json({ error: { message: 'Impact result not found for this change event' } });
  }

  res.json(impactResult);
};
