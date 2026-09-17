const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProjectStakeholderSchema = new Schema(
  {
    stakeholder: { type: Schema.Types.ObjectId, ref: 'Stakeholder', required: true },
    responsibilityAreas: [{ type: String, trim: true }]
  },
  { _id: false }
);

const ProjectSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    client: { type: Schema.Types.ObjectId, ref: 'Stakeholder', required: true },
    startDate: { type: Date },
    endDate: { type: Date },
    phase: { type: String, trim: true },
    stakeholders: [ProjectStakeholderSchema]
  },
  { timestamps: true }
);

ProjectSchema.index({ name: 'text' });

module.exports = mongoose.model('Project', ProjectSchema);
