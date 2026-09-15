import express from 'express';
import Task from '../models/Task.js';

const router = express.Router();

function computeCriticalPath(tasks) {
  const sorted = [...tasks].sort((a, b) => a.order - b.order);
  let cumulative = 0;
  const schedule = sorted.map((t) => {
    const start = cumulative;
    const end = start + t.expectedTime;
    cumulative = end;
    return {
      ...t.toObject(),
      start,
      end,
      slack: 0,
    };
  });

  const totalDuration = cumulative;
  const critical = schedule.filter((t) => {
    const isLast = t.end === totalDuration;
    const hasDep = t.dependencies?.length > 0;
    return isLast || !hasDep || t.variance > 1;
  });

  return { schedule, totalDuration, criticalPath: critical, buffer: totalDuration * 0.15 };
}

router.get('/', async (_req, res) => {
  try {
    const tasks = await Task.find().sort({ order: 1 });
    const pert = computeCriticalPath(tasks);
    res.json({ tasks, ...pert });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/simulate-delay', async (req, res) => {
  try {
    const { taskId, delayDays } = req.body;
    const tasks = await Task.find().sort({ order: 1 });
    const task = tasks.find((t) => t._id.toString() === taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const pert = computeCriticalPath(tasks);
    const newEnd = task.expectedTime + Number(delayDays || 0);
    const projectDelay = Math.max(0, newEnd - task.expectedTime);

    res.json({
      task: task.taskName,
      originalDuration: task.expectedTime,
      delayedDuration: newEnd,
      projectDelayDays: projectDelay,
      suggestedStrategy:
        projectDelay > 3 ? 'mitigation' : projectDelay > 1 ? 'transfer' : 'acceptance',
      message: `Delay of ${delayDays} days on "${task.taskName}" may extend project by ~${projectDelay.toFixed(1)} days`,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
