import express from 'express';
import Risk from '../models/Risk.js';
import { suggestAIRecommendation } from '../utils/mitigationMap.js';
import PDFDocument from 'pdfkit';

const router = express.Router();

const calcPriority = (p, i) => p * i;

router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.type) filter.type = req.query.type;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.category) filter.category = req.query.category;
    if (req.query.minPriority) filter.priority = { $gte: Number(req.query.minPriority) };

    const risks = await Risk.find(filter).sort({ priority: -1 });
    res.json(risks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/export/csv', async (req, res) => {
  try {
    const risks = await Risk.find().sort({ priority: -1 });
    const header = 'ID,Title,Type,Probability,Impact,Priority,Mitigation,Owner,Status,Category\n';
    const rows = risks
      .map(
        (r) =>
          `${r._id},"${r.title.replace(/"/g, '""')}",${r.type},${r.probability},${r.impact},${r.priority},"${(r.mitigation || '').replace(/"/g, '""')}",${r.owner},${r.status},${r.category}`
      )
      .join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=risk-register.csv');
    res.send(header + rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/export/pdf', async (req, res) => {
  try {
    const risks = await Risk.find().sort({ priority: -1 });
    const doc = new PDFDocument({ margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=risk-register.pdf');
    doc.pipe(res);
    doc.fontSize(20).text('Risk Register Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(10);
    risks.forEach((r, i) => {
      doc.text(
        `${i + 1}. ${r.title} | ${r.type} | P:${r.probability} I:${r.impact} Priority:${r.priority} | ${r.status}`
      );
      if (r.mitigation) doc.text(`   Mitigation: ${r.mitigation}`);
      doc.moveDown(0.5);
    });
    doc.end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/comparison', async (req, res) => {
  try {
    const technical = await Risk.find({ type: 'technical' });
    const nonTechnical = await Risk.find({ type: 'non-technical' });
    const avg = (arr, field) =>
      arr.length ? arr.reduce((s, r) => s + r[field], 0) / arr.length : 0;

    res.json({
      technical: {
        count: technical.length,
        avgProbability: avg(technical, 'probability'),
        avgImpact: avg(technical, 'impact'),
        avgPriority: avg(technical, 'priority'),
        risks: technical,
      },
      nonTechnical: {
        count: nonTechnical.length,
        avgProbability: avg(nonTechnical, 'probability'),
        avgImpact: avg(nonTechnical, 'impact'),
        avgPriority: avg(nonTechnical, 'priority'),
        risks: nonTechnical,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id/recommend', async (req, res) => {
  try {
    const risk = await Risk.findById(req.params.id);
    if (!risk) return res.status(404).json({ message: 'Risk not found' });
    res.json({ recommendation: suggestAIRecommendation(risk) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const priority = calcPriority(req.body.probability, req.body.impact);
    const risk = await Risk.create({ ...req.body, priority });
    res.status(201).json(risk);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.probability && data.impact) {
      data.priority = calcPriority(data.probability, data.impact);
    }
    const risk = await Risk.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!risk) return res.status(404).json({ message: 'Risk not found' });
    res.json(risk);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const risk = await Risk.findByIdAndDelete(req.params.id);
    if (!risk) return res.status(404).json({ message: 'Risk not found' });
    res.json({ message: 'Risk deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
