import mongoose from 'mongoose';

const riskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    type: {
      type: String,
      enum: ['technical', 'non-technical'],
      required: true,
    },
    category: {
      type: String,
      enum: [
        'team',
        'deadline',
        'communication',
        'technical',
        'scope',
        'budget',
        'other',
      ],
      default: 'other',
    },
    probability: { type: Number, required: true, min: 1, max: 5 },
    impact: { type: Number, required: true, min: 1, max: 5 },
    priority: { type: Number, default: 1 },
    mitigation: { type: String, default: '' },
    owner: { type: String, default: 'Unassigned' },
    status: {
      type: String,
      enum: ['open', 'in-progress', 'mitigated', 'closed'],
      default: 'open',
    },
    deadline: { type: Date },
    responseStrategy: {
      type: String,
      enum: ['avoidance', 'mitigation', 'transfer', 'acceptance', ''],
      default: '',
    },
  },
  { timestamps: true }
);

riskSchema.pre('save', function (next) {
  this.priority = this.probability * this.impact;
  next();
});

export default mongoose.model('Risk', riskSchema);
