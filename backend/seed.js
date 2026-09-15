import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import Risk from './models/Risk.js';
import Survey from './models/Survey.js';
import Task from './models/Task.js';
import User from './models/User.js';

const sampleRisks = [
  {
    title: 'Server crashes during demo',
    type: 'technical',
    category: 'technical',
    probability: 3,
    impact: 5,
    mitigation: 'Use cloud hosting with health checks and auto-restart',
    owner: 'DevOps Lead',
    status: 'open',
  },
  {
    title: 'Team conflict over task ownership',
    type: 'non-technical',
    category: 'team',
    probability: 4,
    impact: 4,
    mitigation: 'RACI matrix and weekly retrospectives',
    owner: 'Project Manager',
    status: 'in-progress',
  },
  {
    title: 'Missed final submission deadline',
    type: 'non-technical',
    category: 'deadline',
    probability: 4,
    impact: 5,
    mitigation: 'Weekly sprint planning with buffer week',
    owner: 'Team Lead',
    status: 'open',
    responseStrategy: 'mitigation',
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
  },
  {
    title: 'Database connection failures',
    type: 'technical',
    category: 'technical',
    probability: 2,
    impact: 5,
    mitigation: 'Connection pooling, retries, and daily backups',
    owner: 'Backend Dev',
    status: 'mitigated',
  },
  {
    title: 'Poor communication with supervisor',
    type: 'non-technical',
    category: 'communication',
    probability: 3,
    impact: 3,
    mitigation: 'Bi-weekly meeting schedule and shared progress doc',
    owner: 'Team Lead',
    status: 'open',
  },
  {
    title: 'Scope creep from requirement changes',
    type: 'non-technical',
    category: 'scope',
    probability: 5,
    impact: 4,
    mitigation: 'Requirement freeze after week 2; change log',
    owner: 'Analyst',
    status: 'open',
    responseStrategy: 'avoidance',
  },
  {
    title: 'Critical API integration bugs',
    type: 'technical',
    category: 'technical',
    probability: 4,
    impact: 4,
    mitigation: 'Integration tests and mock API for development',
    owner: 'Backend Dev',
    status: 'in-progress',
  },
  {
    title: 'Budget overrun on cloud services',
    type: 'non-technical',
    category: 'budget',
    probability: 2,
    impact: 3,
    mitigation: 'Free tier limits and cost alerts',
    owner: 'Project Manager',
    status: 'open',
    responseStrategy: 'transfer',
  },
];

const sampleSurveys = [
  {
    studentName: 'Ahmad',
    selectedRisks: ['Deadline pressure', 'Poor communication', 'Lack of technical skills'],
    biggestRisk: 'Deadline pressure',
    comments: 'Two weeks left for full stack app',
  },
  {
    studentName: 'Siti',
    selectedRisks: ['Team conflict', 'Requirement changes', 'Scope creep'],
    biggestRisk: 'Requirement changes',
  },
  {
    studentName: 'Raj',
    selectedRisks: ['Deadline pressure', 'Server/API issues', 'Lack of technical skills'],
    biggestRisk: 'Lack of technical skills',
  },
  {
    studentName: 'Fatima',
    selectedRisks: ['Poor communication', 'Deadline pressure', 'Team conflict'],
    biggestRisk: 'Poor communication',
  },
  {
    studentName: 'Wei',
    selectedRisks: ['Scope creep', 'Requirement changes', 'Deadline pressure'],
    biggestRisk: 'Scope creep',
  },
];

const sampleTasks = [
  { taskName: 'UI Design', optimistic: 2, mostLikely: 3, pessimistic: 5, order: 0, dependencies: [] },
  { taskName: 'Backend API', optimistic: 3, mostLikely: 5, pessimistic: 8, order: 1, dependencies: ['UI Design'] },
  { taskName: 'Database Setup', optimistic: 1, mostLikely: 2, pessimistic: 4, order: 2, dependencies: [] },
  { taskName: 'Testing', optimistic: 2, mostLikely: 4, pessimistic: 6, order: 3, dependencies: ['Backend API'] },
  { taskName: 'Deployment', optimistic: 1, mostLikely: 2, pessimistic: 3, order: 4, dependencies: ['Testing'] },
];

async function seed() {
  await connectDB();
  await Promise.all([Risk.deleteMany({}), Survey.deleteMany({}), Task.deleteMany({})]);

  for (const r of sampleRisks) {
    const priority = r.probability * r.impact;
    await Risk.create({ ...r, priority });
  }
  await Survey.insertMany(sampleSurveys);
  for (const t of sampleTasks) {
    const expectedTime = (t.optimistic + 4 * t.mostLikely + t.pessimistic) / 6;
    const variance = Math.pow((t.pessimistic - t.optimistic) / 6, 2);
    await Task.create({ ...t, expectedTime, variance });
  }

  const demoUser = await User.findOne({ email: 'demo@risktrack.app' });
  if (!demoUser) {
    await User.create({
      name: 'Demo User',
      email: 'demo@risktrack.app',
      password: 'demo123',
    });
    console.log('Demo user: demo@risktrack.app / demo123');
  }

  console.log('Database seeded successfully!');
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
