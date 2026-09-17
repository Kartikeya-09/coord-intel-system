const mongoose = require('mongoose');
const { Schema } = mongoose;

const DependencySchema = new Schema(
  {
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    fromEntity: { type: Schema.Types.ObjectId, required: true, refPath: 'fromModel' },
    fromModel: { type: String, required: true, enum: ['Activity', 'Approval'] },
    toEntity: { type: Schema.Types.ObjectId, required: true, refPath: 'toModel' },
    toModel: { type: String, required: true, enum: ['Activity', 'Approval'] }
  },
  { timestamps: true }
);

DependencySchema.index({ project: 1 });
DependencySchema.index({ fromEntity: 1 });
DependencySchema.index({ toEntity: 1 });

module.exports = mongoose.model('Dependency', DependencySchema);
