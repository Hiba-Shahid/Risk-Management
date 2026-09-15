import { useEffect, useState } from 'react';
import api from '../api/client';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { Plus, Trash2 } from 'lucide-react';

const emptyTask = {
  taskName: '',
  optimistic: 1,
  mostLikely: 2,
  pessimistic: 3,
  order: 0,
  dependencies: [],
};

export default function PERT() {
  const [data, setData] = useState(null);
  const [form, setForm] = useState(emptyTask);
  const [delayForm, setDelayForm] = useState({ taskId: '', delayDays: 2 });
  const [simResult, setSimResult] = useState(null);

  const load = () => api.get('/tasks').then((r) => setData(r.data));

  useEffect(() => {
    load();
  }, []);

  const calcTE = (O, M, P) => ((O + 4 * M + P) / 6).toFixed(2);

  const addTask = async (e) => {
    e.preventDefault();
    await api.post('/tasks', form);
    setForm(emptyTask);
    load();
  };

  const simulate = async () => {
    const res = await api.post('/tasks/simulate-delay', delayForm);
    setSimResult(res.data);
  };

  if (!data) return <p>Loading PERT...</p>;

  const chartData = data.schedule?.map((t) => ({
    name: t.taskName,
    expected: +t.expectedTime.toFixed(1),
    optimistic: t.optimistic,
    pessimistic: t.pessimistic,
    critical: data.criticalPath?.some((c) => c._id === t._id),
  }));

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <div>
        <h1 className="text-2xl font-bold">PERT Scheduling</h1>
        <p className="text-slate-500 text-sm">
          T<sub>E</sub> = (O + 4M + P) / 6 — risk-aware scheduling with uncertainty
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="card text-center">
          <p className="text-sm text-slate-500">Total Duration</p>
          <p className="text-3xl font-bold text-brand-600">{data.totalDuration?.toFixed(1)} days</p>
        </div>
        <div className="card text-center">
          <p className="text-sm text-slate-500">Recommended Buffer (15%)</p>
          <p className="text-3xl font-bold text-amber-600">{data.buffer?.toFixed(1)} days</p>
        </div>
        <div className="card text-center">
          <p className="text-sm text-slate-500">Tasks on Critical Path</p>
          <p className="text-3xl font-bold">{data.criticalPath?.length || 0}</p>
        </div>
      </div>

      <form onSubmit={addTask} className="card grid md:grid-cols-5 gap-3 items-end">
        <div>
          <label className="label">Task</label>
          <input className="input" required value={form.taskName} onChange={(e) => setForm({ ...form, taskName: e.target.value })} />
        </div>
        <div>
          <label className="label">Optimistic (O)</label>
          <input type="number" min={0} step={0.5} className="input" value={form.optimistic} onChange={(e) => setForm({ ...form, optimistic: +e.target.value })} />
        </div>
        <div>
          <label className="label">Most Likely (M)</label>
          <input type="number" min={0} step={0.5} className="input" value={form.mostLikely} onChange={(e) => setForm({ ...form, mostLikely: +e.target.value })} />
        </div>
        <div>
          <label className="label">Pessimistic (P)</label>
          <input type="number" min={0} step={0.5} className="input" value={form.pessimistic} onChange={(e) => setForm({ ...form, pessimistic: +e.target.value })} />
        </div>
        <div>
          <p className="text-xs text-slate-500 mb-1">Preview T<sub>E</sub></p>
          <p className="font-bold text-lg mb-2">{calcTE(form.optimistic, form.mostLikely, form.pessimistic)} days</p>
          <button type="submit" className="btn-primary w-full flex items-center justify-center gap-1">
            <Plus className="h-4 w-4" /> Add
          </button>
        </div>
      </form>

      <div className="card overflow-x-auto !p-0">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800">
            <tr>
              <th className="text-left p-3">Task</th>
              <th className="p-3">O</th>
              <th className="p-3">M</th>
              <th className="p-3">P</th>
              <th className="p-3">T<sub>E</sub></th>
              <th className="p-3">Start</th>
              <th className="p-3">End</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {data.schedule?.map((t) => (
              <tr key={t._id} className="border-t border-slate-100 dark:border-slate-800">
                <td className="p-3 font-medium">
                  {t.taskName}
                  {data.criticalPath?.some((c) => c._id === t._id) && (
                    <span className="ml-2 text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded dark:bg-red-900/40">Critical</span>
                  )}
                </td>
                <td className="p-3 text-center">{t.optimistic}</td>
                <td className="p-3 text-center">{t.mostLikely}</td>
                <td className="p-3 text-center">{t.pessimistic}</td>
                <td className="p-3 text-center font-semibold">{t.expectedTime?.toFixed(2)}</td>
                <td className="p-3 text-center">{t.start?.toFixed(1)}</td>
                <td className="p-3 text-center">{t.end?.toFixed(1)}</td>
                <td className="p-3">
                  <button onClick={async () => { await api.delete(`/tasks/${t._id}`); load(); }} className="text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h2 className="font-semibold mb-4">Schedule Timeline (Gantt-style)</h2>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} layout="vertical" margin={{ left: 100 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis type="category" dataKey="name" width={90} />
            <Tooltip />
            <Bar dataKey="expected" name="Expected (days)">
              {chartData?.map((entry, i) => (
                <Cell key={i} fill={entry.critical ? '#ef4444' : '#6366f1'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <h2 className="font-semibold mb-4">Delay Simulation</h2>
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="label">Task</label>
            <select className="input" value={delayForm.taskId} onChange={(e) => setDelayForm({ ...delayForm, taskId: e.target.value })}>
              <option value="">Select task...</option>
              {data.tasks?.map((t) => (
                <option key={t._id} value={t._id}>{t.taskName}</option>
              ))}
            </select>
          </div>
          <div className="w-32">
            <label className="label">Delay (days)</label>
            <input type="number" min={1} className="input" value={delayForm.delayDays} onChange={(e) => setDelayForm({ ...delayForm, delayDays: +e.target.value })} />
          </div>
          <button onClick={simulate} className="btn-primary" disabled={!delayForm.taskId}>Simulate</button>
        </div>
        {simResult && (
          <div className="mt-4 p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-sm">
            <p>{simResult.message}</p>
            <p className="mt-2">Suggested strategy: <strong className="capitalize">{simResult.suggestedStrategy}</strong></p>
          </div>
        )}
      </div>
    </div>
  );
}
