import { useEffect, useState } from 'react';
import api from '../api/client';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

const CASE_STUDIES = {
  technical: [
    { title: 'Server crash during demo', impact: 'Project demo failure, grade penalty', lesson: 'Use cloud with health checks' },
    { title: 'Database connection timeout', impact: 'App unusable in production', lesson: 'Connection pooling + retries' },
    { title: 'API versioning mismatch', impact: 'Frontend-backend integration blocked', lesson: 'Contract-first API design' },
  ],
  nonTechnical: [
    { title: 'Team member leaves mid-project', impact: 'Knowledge loss, delayed modules', lesson: 'Documentation + bus factor planning' },
    { title: 'Supervisor unavailable for 2 weeks', impact: 'Wrong direction, rework needed', lesson: 'Scheduled check-ins + async updates' },
    { title: 'Scope creep from client', impact: 'Missed deadline, burnout', lesson: 'Change control process' },
  ],
};

export default function Comparison() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/risks/comparison').then((r) => setData(r.data));
  }, []);

  if (!data) return <p>Loading comparison...</p>;

  const barData = [
    {
      metric: 'Avg Probability',
      Technical: +data.technical.avgProbability.toFixed(2),
      'Non-Technical': +data.nonTechnical.avgProbability.toFixed(2),
    },
    {
      metric: 'Avg Impact',
      Technical: +data.technical.avgImpact.toFixed(2),
      'Non-Technical': +data.nonTechnical.avgImpact.toFixed(2),
    },
    {
      metric: 'Avg Priority',
      Technical: +data.technical.avgPriority.toFixed(2),
      'Non-Technical': +data.nonTechnical.avgPriority.toFixed(2),
    },
  ];

  const radarData = [
    { subject: 'Count', A: data.technical.count, B: data.nonTechnical.count, fullMark: 10 },
    { subject: 'Probability', A: data.technical.avgProbability, B: data.nonTechnical.avgProbability, fullMark: 5 },
    { subject: 'Impact', A: data.technical.avgImpact, B: data.nonTechnical.avgImpact, fullMark: 5 },
    { subject: 'Priority', A: data.technical.avgPriority, B: data.nonTechnical.avgPriority, fullMark: 25 },
  ];

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <div>
        <h1 className="text-2xl font-bold">Technical vs Non-Technical Risks</h1>
        <p className="text-slate-500 text-sm">Comparison charts, severity analysis, and case studies</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="card text-center">
          <p className="text-sm text-slate-500">Technical Risks</p>
          <p className="text-4xl font-bold text-blue-600">{data.technical.count}</p>
        </div>
        <div className="card text-center">
          <p className="text-sm text-slate-500">Non-Technical Risks</p>
          <p className="text-4xl font-bold text-purple-600">{data.nonTechnical.count}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="font-semibold mb-4">Severity Comparison</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="metric" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Technical" fill="#3b82f6" />
              <Bar dataKey="Non-Technical" fill="#a855f7" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2 className="font-semibold mb-4">Risk Profile Radar</h2>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis />
              <Radar name="Technical" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} />
              <Radar name="Non-Technical" dataKey="B" stroke="#a855f7" fill="#a855f7" fillOpacity={0.4} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {['technical', 'nonTechnical'].map((key) => (
          <div key={key} className="card">
            <h2 className="font-semibold mb-4 capitalize">
              {key === 'technical' ? 'Technical' : 'Non-Technical'} — Registered Risks
            </h2>
            <ul className="space-y-2 text-sm max-h-48 overflow-y-auto">
              {(key === 'technical' ? data.technical.risks : data.nonTechnical.risks).map((r) => (
                <li key={r._id} className="flex justify-between border-b border-slate-100 dark:border-slate-800 py-2">
                  <span>{r.title}</span>
                  <span className="font-medium text-brand-600">P:{r.priority}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="font-semibold mb-4 text-blue-600">Technical Case Studies</h2>
          {CASE_STUDIES.technical.map((c) => (
            <div key={c.title} className="mb-4 pb-4 border-b border-slate-100 dark:border-slate-800 last:border-0">
              <p className="font-medium">{c.title}</p>
              <p className="text-sm text-slate-500 mt-1">Impact: {c.impact}</p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">Lesson: {c.lesson}</p>
            </div>
          ))}
        </div>
        <div className="card">
          <h2 className="font-semibold mb-4 text-purple-600">Non-Technical Case Studies</h2>
          {CASE_STUDIES.nonTechnical.map((c) => (
            <div key={c.title} className="mb-4 pb-4 border-b border-slate-100 dark:border-slate-800 last:border-0">
              <p className="font-medium">{c.title}</p>
              <p className="text-sm text-slate-500 mt-1">Impact: {c.impact}</p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">Lesson: {c.lesson}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
