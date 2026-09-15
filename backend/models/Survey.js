import mongoose from 'mongoose';

const surveySchema = new mongoose.Schema(
  {
    studentName: { type: String, required: true, trim: true },
    selectedRisks: [{ type: String, required: true }],
    biggestRisk: { type: String, default: '' },
    comments: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Survey', surveySchema);
