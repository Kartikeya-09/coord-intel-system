const mongoose = require('mongoose');
const { Schema } = mongoose;

const AlertSchema = new Schema(
  {
    stakeholder: { type: Schema.Types.ObjectId, ref: 'Stakeholder', required: true },
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    changeEvent: { type: Schema.Types.ObjectId, ref: 'ChangeEvent', required: true },
    changeEventName: { type: String },
    impactResult: { type: Schema.Types.ObjectId, ref: 'ImpactResult' },
    affectedEntity: {
      entity: { type: Schema.Types.ObjectId, required: true },
      model: { type: String, required: true, enum: ['Activity', 'Approval'] },
      name: { type: String }
    },
    reasoningChain: [{ type: String }],
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

AlertSchema.index({ stakeholder: 1, isRead: 1 });
AlertSchema.index({ stakeholder: 1, createdAt: -1 });

module.exports = mongoose.model('Alert', AlertSchema);
