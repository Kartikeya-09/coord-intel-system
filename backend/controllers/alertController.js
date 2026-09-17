const Alert = require('../models/Alert');

exports.getStakeholderAlerts = async (req, res) => {
  const { stakeholderId } = req.params;
  const alerts = await Alert.find({ stakeholder: stakeholderId })
    .sort({ createdAt: -1 })
    .populate('changeEvent')
    .populate('impactResult');

  res.json(alerts);
};

exports.getUnreadStakeholderAlerts = async (req, res) => {
  const { stakeholderId } = req.params;
  const alerts = await Alert.find({ stakeholder: stakeholderId, isRead: false })
    .sort({ createdAt: -1 })
    .populate('changeEvent')
    .populate('impactResult');

  res.json(alerts);
};

exports.markAlertAsRead = async (req, res) => {
  const alert = await Alert.findById(req.params.id);
  if (!alert) {
    return res.status(404).json({ error: { message: 'Alert not found' } });
  }

  alert.isRead = true;
  await alert.save();
  res.json(alert);
};
