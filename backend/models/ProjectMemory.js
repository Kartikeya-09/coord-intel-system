const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProjectMemorySchema = new Schema(
  {
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    eventType: {
      type: String,
      required: true,
      enum: [
        'change_event_created',
        'impact_result_produced',
        'action_created',
        'action_completed',
        'approval_status_changed'
      ]
    },
    summary: { type: String, required: true, trim: true },
    actor: {
      type: { type: String, enum: ['stakeholder', 'system'], required: true },
      ref: { type: Schema.Types.ObjectId, ref: 'Stakeholder', default: null }
    },
    timestamp: { type: Date, default: Date.now }
  },
  { timestamps: false }
);

ProjectMemorySchema.index({ summary: 'text' });
ProjectMemorySchema.index({ project: 1, timestamp: -1 });
ProjectMemorySchema.index({ project: 1, eventType: 1 });

module.exports = mongoose.model('ProjectMemory', ProjectMemorySchema);
