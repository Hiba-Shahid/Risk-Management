import { useEffect, useState } from 'react';
import api from '../api/client';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function Survey() {
  const [options, setOptions] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [form, setForm] = useState({
    studentName: '',
    selectedRisks: [],
    biggestRisk: '',
    comments: '',
  });

  const load = () => {
    api.get('/surveys/options').then((r) => setOptions(r.data));
    api.get('/surveys/analytics').then((r) => setAnalytics(r.data));
  };

  useEffect(() => {
    load();
  }, []);

  const toggleRisk = (risk) => {
    setForm((f) => ({
      ...f,
      selectedRisks: f.selectedRisks.includes(risk)
        ? f.selectedRisks.filter((r) => r !== risk)
        : [...f.selectedRisks, risk],
    }));
  };

  const submit = async (e) => {
    e.preventDefault();
    await api.post('/surveys', form);
    setForm({ studentName: '', selectedRisks: [], biggestRisk: '', comments: '' });
    load();
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <div>
        <h1 className="text-2xl font-bold">Survey Module</h1>
        <p className="text-slate-500 text-sm">Top 5 risks in final year projects — collect & analyze responses</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <form onSubmit={submit} className="card space-y-4">
          <h2 className="font-semibold">Submit Survey Response</h2>
          <div>
            <label className="label">Student Name</label>
            <input
              className="input"
              required
              value={form.studentName}
              onChange={(e) => setForm({ ...form, studentName: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Select risks you have faced (multiple)</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {options.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => toggleRisk(r)}
                  className={`px-3 py-1.5 rounded-full text-xs border transition ${
                    form.selectedRisks.includes(r)
                      ? 'bg-brand-600 text-white border-brand-600'
                      : 'border-slate-300 dark:border-slate-600'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="label">Biggest FYP risk?</label>
            <select
              className="input"
              value={form.biggestRisk}
              onChange={(e) => setForm({ ...form, biggestRisk: e.target.value })}
            >
              <option value="">Select...</option>
              {options.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Comments</label>
            <textarea
              className="input"
              rows={3}
              value={form.comments}
              onChange={(e) => setForm({ ...form, comments: e.target.value })}
            />
          </div>
          <button type="submit" className="btn-primary w-full">Submit Response</button>
        </form>

        {analytics && (
          <div className="space-y-4">
            <div className="card">
              <h2 className="font-semibold mb-2">Top 5 Risks Chart</h2>
              <p className="text-xs text-slate-500 mb-4">{analytics.totalResponses} responses collected</p>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={analytics.top5Risks} layout="vertical" margin={{ left: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="risk" tick={{ fontSize: 11 }} width={100} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {analytics && (
        <>
          <div className="card overflow-x-auto">
            <h2 className="font-semibold mb-4">Risk Frequency Table</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-2">Risk</th>
                  <th className="text-left py-2">Count</th>
                </tr>
              </thead>
              <tbody>
                {analytics.frequencyTable.map((row) => (
                  <tr key={row.risk} className="border-b border-slate-100 dark:border-slate-800">
                    <td className="py-2">{row.risk}</td>
                    <td className="py-2">{row.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="card">
            <h2 className="font-semibold mb-4">Suggested Mitigation Strategies</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {analytics.suggestedMitigations.map((m) => (
                <div key={m.risk} className="rounded-lg border border-slate-200 dark:border-slate-700 p-3">
                  <p className="font-medium text-brand-600">{m.risk}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{m.mitigation}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
