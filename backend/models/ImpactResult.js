import mongoose from 'mongoose';

const { Schema } = mongoose;

const ReasoningStepSchema = new Schema(
  {
    fromEntity: { type: Schema.Types.ObjectId, required: true, refPath: 'reasoningChains.steps.fromModel' },
    fromModel: { type: String, required: true, enum: ['ChangeEvent', 'Activity', 'Approval'] },
    fromName: { type: String },
    toEntity: { type: Schema.Types.ObjectId, required: true, refPath: 'reasoningChains.steps.toModel' },
    toModel: { type: String, required: true, enum: ['Activity', 'Approval'] },
    toName: { type: String }
  },
  { _id: false }
);

const ReasoningChainSchema = new Schema(
  {
    entity: { type: Schema.Types.ObjectId, required: true },
    model: { type: String, required: true, enum: ['Activity', 'Approval'] },
    name: { type: String },
    steps: [ReasoningStepSchema]
  },
  { _id: false }
);

const ImpactResultSchema = new Schema(
  {
    changeEvent: { type: Schema.Types.ObjectId, ref: 'ChangeEvent', required: true },
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    affectedActivities: [{ type: Schema.Types.ObjectId, ref: 'Activity' }],
    affectedApprovals: [{ type: Schema.Types.ObjectId, ref: 'Approval' }],
    affectedStakeholders: [{ type: Schema.Types.ObjectId, ref: 'Stakeholder' }],
    reasoningChains: [ReasoningChainSchema]
  },
  { timestamps: true }
);

ImpactResultSchema.index({ changeEvent: 1 }, { unique: true });
ImpactResultSchema.index({ project: 1 });

export default mongoose.model('ImpactResult', ImpactResultSchema);
