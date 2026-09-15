import express from 'express';
import Risk from '../models/Risk.js';
import Survey from '../models/Survey.js';
import Task from '../models/Task.js';

const router = express.Router();

router.get('/stats', async (_req, res) => {
  try {
    const risks = await Risk.find();
    const surveys = await Survey.countDocuments();
    const tasks = await Task.find();

    const highPriority = risks.filter((r) => r.priority >= 15).length;
    const mitigated = risks.filter((r) => r.status === 'mitigated' || r.status === 'closed').length;
    const mitigationProgress =
      risks.length > 0 ? Math.round((mitigated / risks.length) * 100) : 0;

    const now = new Date();
    const delayedTasks = tasks.filter((t) => t.pessimistic > t.expectedTime * 1.5).length;
    const deadlineRisks = risks.filter(
      (r) => r.deadline && new Date(r.deadline) < now && r.status !== 'closed'
    ).length;

    const byCategory = {};
    const byStatus = {};
    const heatmap = [];

    risks.forEach((r) => {
      byCategory[r.category] = (byCategory[r.category] || 0) + 1;
      byStatus[r.status] = (byStatus[r.status] || 0) + 1;
      heatmap.push({
        title: r.title,
        probability: r.probability,
        impact: r.impact,
        priority: r.priority,
      });
    });

    const byType = {
      technical: risks.filter((r) => r.type === 'technical').length,
      nonTechnical: risks.filter((r) => r.type === 'non-technical').length,
    };

    const timeline = risks
      .filter((r) => r.deadline)
      .map((r) => ({
        title: r.title,
        deadline: r.deadline,
        priority: r.priority,
        status: r.status,
      }))
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

    res.json({
      totalRisks: risks.length,
      highPriorityRisks: highPriority,
      delayedTasks,
      deadlineRisks,
      mitigationProgress,
      surveyResponses: surveys,
      risksByCategory: Object.entries(byCategory).map(([name, value]) => ({ name, value })),
      risksByStatus: Object.entries(byStatus).map(([name, value]) => ({ name, value })),
      risksByType: [
        { name: 'Technical', value: byType.technical },
        { name: 'Non-Technical', value: byType.nonTechnical },
      ],
      heatmap,
      timeline,
      priorityDistribution: [
        { name: 'Low (1-5)', value: risks.filter((r) => r.priority <= 5).length },
        { name: 'Medium (6-11)', value: risks.filter((r) => r.priority >= 6 && r.priority <= 11).length },
        { name: 'High (12-19)', value: risks.filter((r) => r.priority >= 12 && r.priority <= 19).length },
        { name: 'Critical (20+)', value: risks.filter((r) => r.priority >= 20).length },
      ],
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/deadline-strategies', async (_req, res) => {
  try {
    const risks = await Risk.find({ category: { $in: ['deadline', 'scope'] } });
    const strategies = [
      {
        type: 'avoidance',
        description: 'Reduce project scope or defer non-critical features',
        example: 'Cut optional modules from MVP to meet submission date',
        applicableWhen: 'High scope creep with fixed deadline',
      },
      {
        type: 'mitigation',
        description: 'Add resources, overtime, or parallel work streams',
        example: 'Add extra developer for testing phase; daily sprint planning',
        applicableWhen: 'Team has capacity but needs coordination',
      },
      {
        type: 'transfer',
        description: 'Outsource or assign risk to third party',
        example: 'Outsource UI design; use managed cloud database',
        applicableWhen: 'Budget allows external help',
      },
      {
        type: 'acceptance',
        description: 'Accept delay on low-priority deliverables',
        example: 'Submit core features on time; documentation one week late',
        applicableWhen: 'Stakeholders agree on partial delivery',
      },
    ];

    const predictions = risks.map((r) => {
      const daysUntil =
        r.deadline
          ? Math.ceil((new Date(r.deadline) - new Date()) / (1000 * 60 * 60 * 24))
          : null;
      let suggested = 'mitigation';
      if (r.priority >= 20 && daysUntil !== null && daysUntil < 7) suggested = 'avoidance';
      else if (r.priority >= 15 && daysUntil !== null && daysUntil < 14) suggested = 'mitigation';
      else if (r.priority < 8) suggested = 'acceptance';
      else if (r.category === 'budget') suggested = 'transfer';

      return {
        riskId: r._id,
        title: r.title,
        daysUntilDeadline: daysUntil,
        priority: r.priority,
        currentStrategy: r.responseStrategy,
        suggestedStrategy: suggested,
      };
    });

    res.json({ strategies, predictions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
