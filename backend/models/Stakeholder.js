import mongoose from 'mongoose';

const { Schema } = mongoose;

const StakeholderSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    role: {
      type: String,
      required: true,
      enum: [
        'client',
        'architect',
        'interior designer',
        'project manager',
        'contractor',
        'vendor',
        'consultant',
        'site team',
        'specialist'
      ]
    },
    contact: {
      email: { type: String, trim: true, lowercase: true },
      phone: { type: String, trim: true }
    }
  },
  { timestamps: true }
);

StakeholderSchema.index({ name: 'text' });

export default mongoose.model('Stakeholder', StakeholderSchema);
