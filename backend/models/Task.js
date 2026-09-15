import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    taskName: { type: String, required: true, trim: true },
    optimistic: { type: Number, required: true, min: 0 },
    mostLikely: { type: Number, required: true, min: 0 },
    pessimistic: { type: Number, required: true, min: 0 },
    expectedTime: { type: Number, default: 0 },
    variance: { type: Number, default: 0 },
    dependencies: [{ type: String, default: [] }],
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

taskSchema.pre('save', function (next) {
  const O = this.optimistic;
  const M = this.mostLikely;
  const P = this.pessimistic;
  this.expectedTime = (O + 4 * M + P) / 6;
  this.variance = Math.pow((P - O) / 6, 2);
  next();
});

export default mongoose.model('Task', taskSchema);
