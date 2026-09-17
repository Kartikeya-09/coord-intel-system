const mongoose = require('mongoose');
const { Schema } = mongoose;

const ActivitySchema = new Schema(
  {
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    owner: { type: Schema.Types.ObjectId, ref: 'Stakeholder', required: true },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'blocked', 'complete'],
      default: 'pending'
    },
    dueDate: { type: Date },
    isBlocked: { type: Boolean, default: false }
  },
  { timestamps: true }
);

ActivitySchema.index({ project: 1, status: 1 });
ActivitySchema.index({ owner: 1 });

module.exports = mongoose.model('Activity', ActivitySchema);
