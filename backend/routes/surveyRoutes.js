import express from 'express';
import Survey from '../models/Survey.js';
import { getMitigationForRisk, SURVEY_RISK_OPTIONS } from '../utils/mitigationMap.js';

const router = express.Router();

router.get('/options', (_req, res) => {
  res.json(SURVEY_RISK_OPTIONS);
});

router.get('/', async (_req, res) => {
  try {
    const surveys = await Survey.find().sort({ createdAt: -1 });
    res.json(surveys);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/analytics', async (_req, res) => {
  try {
    const surveys = await Survey.find();
    const frequency = {};
    const biggestFrequency = {};

    surveys.forEach((s) => {
      s.selectedRisks.forEach((r) => {
        frequency[r] = (frequency[r] || 0) + 1;
      });
      if (s.biggestRisk) {
        biggestFrequency[s.biggestRisk] = (biggestFrequency[s.biggestRisk] || 0) + 1;
      }
    });

    const sorted = Object.entries(frequency)
      .sort((a, b) => b[1] - a[1])
      .map(([risk, count]) => ({ risk, count }));

    const top5 = sorted.slice(0, 5);
    const mitigations = top5.map(({ risk }) => ({
      risk,
      mitigation: getMitigationForRisk(risk),
    }));

    res.json({
      totalResponses: surveys.length,
      top5Risks: top5,
      frequencyTable: sorted,
      biggestRiskBreakdown: Object.entries(biggestFrequency).map(([risk, count]) => ({
        risk,
        count,
      })),
      suggestedMitigations: mitigations,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const survey = await Survey.create(req.body);
    res.status(201).json(survey);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Survey.findByIdAndDelete(req.params.id);
    res.json({ message: 'Survey deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
