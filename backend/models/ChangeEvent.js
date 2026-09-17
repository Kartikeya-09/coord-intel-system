import mongoose from 'mongoose';

const { Schema } = mongoose;

const ChangeEventSchema = new Schema(
  {
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    type: {
      type: String,
      required: true,
      enum: ['material change', 'design revision', 'scope change', 'delay', 'issue']
    },
    description: { type: String, required: true, trim: true },
    sourceStakeholder: { type: Schema.Types.ObjectId, ref: 'Stakeholder', required: true },
    linkedEntities: [
      {
        entity: { type: Schema.Types.ObjectId, required: true, refPath: 'linkedEntities.model' },
        model: { type: String, required: true, enum: ['Activity', 'Approval'] }
      }
    ],
    impactResult: { type: Schema.Types.ObjectId, ref: 'ImpactResult' },
    timestamp: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

ChangeEventSchema.index({ project: 1, timestamp: -1 });

export default mongoose.model('ChangeEvent', ChangeEventSchema);
