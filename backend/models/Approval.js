import mongoose from 'mongoose';

const { Schema } = mongoose;

const ApprovalSchema = new Schema(
  {
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    owner: { type: Schema.Types.ObjectId, ref: 'Stakeholder', required: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    }
  },
  { timestamps: true }
);

ApprovalSchema.index({ project: 1, status: 1 });

export default mongoose.model('Approval', ApprovalSchema);
