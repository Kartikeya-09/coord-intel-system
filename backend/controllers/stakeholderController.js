const Stakeholder = require('../models/Stakeholder');

exports.createStakeholder = async (req, res) => {
  const { name, role, contact } = req.body;

  if (!name || !role) {
    return res.status(400).json({
      error: { message: 'Missing required fields: name and role are required' }
    });
  }

  const stakeholder = new Stakeholder({ name, role, contact });
  await stakeholder.save();
  res.status(201).json(stakeholder);
};

exports.getStakeholderById = async (req, res) => {
  const stakeholder = await Stakeholder.findById(req.params.id);
  if (!stakeholder) {
    return res.status(404).json({ error: { message: 'Stakeholder not found' } });
  }
  res.json(stakeholder);
};

exports.updateStakeholder = async (req, res) => {
  const { name, role, contact } = req.body;
  const stakeholder = await Stakeholder.findById(req.params.id);

  if (!stakeholder) {
    return res.status(404).json({ error: { message: 'Stakeholder not found' } });
  }

  if (name !== undefined) stakeholder.name = name;
  if (role !== undefined) stakeholder.role = role;
  if (contact !== undefined) stakeholder.contact = contact;

  await stakeholder.save();
  res.json(stakeholder);
};
