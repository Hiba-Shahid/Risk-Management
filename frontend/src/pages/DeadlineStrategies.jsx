import { useEffect, useState } from 'react';
import api from '../api/client';

const STRATEGY_COLORS = {
  avoidance: 'border-red-300 bg-red-50 dark:bg-red-900/20',
  mitigation: 'border-amber-300 bg-amber-50 dark:bg-amber-900/20',
  transfer: 'border-blue-300 bg-blue-50 dark:bg-blue-900/20',
  acceptance: 'border-green-300 bg-green-50 dark:bg-green-900/20',
};

export default function DeadlineStrategies() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/dashboard/deadline-strategies').then((r) => setData(r.data));
  }, []);

  if (!data) return <p>Loading deadline strategies...</p>;

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <div>
        <h1 className="text-2xl font-bold">Deadline Risk Response Strategies</h1>
        <p className="text-slate-500 text-sm">Avoidance, Mitigation, Transfer, Acceptance — empirical analysis</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {data.strategies.map((s) => (
          <div key={s.type} className={`card border-2 ${STRATEGY_COLORS[s.type]}`}>
            <h3 className="font-bold capitalize text-lg">{s.type}</h3>
            <p className="text-sm mt-2 text-slate-600 dark:text-slate-400">{s.description}</p>
            <p className="text-sm mt-3">
              <span className="font-medium">Example: </span>
              {s.example}
            </p>
            <p className="text-xs mt-2 text-slate-500">When: {s.applicableWhen}</p>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 className="font-semibold mb-4">Deadline Predictions & Suggested Strategies</h2>
        {data.predictions.length === 0 ? (
          <p className="text-slate-500 text-sm">Add deadline-category risks in the Risk Register to see predictions.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-2">Risk</th>
                  <th className="text-left py-2">Days Left</th>
                  <th className="text-left py-2">Priority</th>
                  <th className="text-left py-2">Current</th>
                  <th className="text-left py-2">Suggested</th>
                </tr>
              </thead>
              <tbody>
                {data.predictions.map((p) => (
                  <tr key={p.riskId} className="border-b border-slate-100 dark:border-slate-800">
                    <td className="py-3 font-medium">{p.title}</td>
                    <td className="py-3">
                      {p.daysUntilDeadline !== null ? (
                        <span className={p.daysUntilDeadline < 7 ? 'text-red-600 font-bold' : ''}>
                          {p.daysUntilDeadline} days
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="py-3">{p.priority}</td>
                    <td className="py-3 capitalize">{p.currentStrategy || '—'}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${STRATEGY_COLORS[p.suggestedStrategy]?.split(' ')[0] || ''}`}>
                        {p.suggestedStrategy}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="card bg-slate-100 dark:bg-slate-800/50">
        <h3 className="font-semibold">Strategy Decision Guide</h3>
        <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">
          <li><strong>Avoidance</strong> — Critical priority + less than 7 days: reduce scope immediately</li>
          <li><strong>Mitigation</strong> — High priority + 7–14 days: add resources, parallel tasks</li>
          <li><strong>Transfer</strong> — Budget-related risks: outsource or use managed services</li>
          <li><strong>Acceptance</strong> — Low priority: accept minor delays on non-critical deliverables</li>
        </ul>
      </div>
    </div>
  );
}
