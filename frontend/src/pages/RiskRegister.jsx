import { useEffect, useState } from 'react';
import api from '../api/client';
import { Download, Plus, Sparkles, Pencil, Trash2 } from 'lucide-react';

const emptyRisk = {
  title: '',
  description: '',
  type: 'technical',
  category: 'other',
  probability: 3,
  impact: 3,
  mitigation: '',
  owner: '',
  status: 'open',
  responseStrategy: '',
};

function priorityLabel(p) {
  if (p >= 20) return { text: 'Critical', class: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' };
  if (p >= 12) return { text: 'High', class: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40' };
  if (p >= 6) return { text: 'Medium', class: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40' };
  return { text: 'Low', class: 'bg-green-100 text-green-700 dark:bg-green-900/40' };
}

export default function RiskRegister() {
  const [risks, setRisks] = useState([]);
  const [filter, setFilter] = useState({ type: '', status: '' });
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyRisk);
  const [aiTip, setAiTip] = useState('');

  const load = () => {
    const params = {};
    if (filter.type) params.type = filter.type;
    if (filter.status) params.status = filter.status;
    api.get('/risks', { params }).then((r) => setRisks(r.data));
  };

  useEffect(() => {
    load();
  }, [filter]);

  const save = async (e) => {
    e.preventDefault();
    if (editing) await api.put(`/risks/${editing}`, form);
    else await api.post('/risks', form);
    setShowForm(false);
    setEditing(null);
    setForm(emptyRisk);
    load();
  };

  const remove = async (id) => {
    if (confirm('Delete this risk?')) {
      await api.delete(`/risks/${id}`);
      load();
    }
  };

  const getAI = async (id) => {
    const res = await api.get(`/risks/${id}/recommend`);
    setAiTip(res.data.recommendation);
  };

  const exportFile = (type) => {
    window.open(`/api/risks/export/${type}`, '_blank');
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Risk Register</h1>
          <p className="text-slate-500 text-sm">
            Priority = Probability × Impact (e.g. 4×5 = 20 High Risk)
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => exportFile('csv')} className="btn-secondary flex items-center gap-1">
            <Download className="h-4 w-4" /> CSV
          </button>
          <button onClick={() => exportFile('pdf')} className="btn-secondary flex items-center gap-1">
            <Download className="h-4 w-4" /> PDF
          </button>
          <button
            onClick={() => {
              setShowForm(true);
              setEditing(null);
              setForm(emptyRisk);
            }}
            className="btn-primary flex items-center gap-1"
          >
            <Plus className="h-4 w-4" /> Add Risk
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <select className="input w-auto" value={filter.type} onChange={(e) => setFilter({ ...filter, type: e.target.value })}>
          <option value="">All types</option>
          <option value="technical">Technical</option>
          <option value="non-technical">Non-technical</option>
        </select>
        <select className="input w-auto" value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.target.value })}>
          <option value="">All statuses</option>
          <option value="open">Open</option>
          <option value="in-progress">In Progress</option>
          <option value="mitigated">Mitigated</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {aiTip && (
        <div className="card bg-brand-50 dark:bg-brand-900/20 border-brand-200 dark:border-brand-800 flex gap-2">
          <Sparkles className="h-5 w-5 text-brand-600 shrink-0" />
          <p className="text-sm">{aiTip}</p>
          <button onClick={() => setAiTip('')} className="ml-auto text-xs text-slate-500">Dismiss</button>
        </div>
      )}

      {showForm && (
        <form onSubmit={save} className="card grid md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="label">Title</label>
            <input className="input" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          {[
            ['type', ['technical', 'non-technical']],
            ['category', ['team', 'deadline', 'communication', 'technical', 'scope', 'budget', 'other']],
            ['status', ['open', 'in-progress', 'mitigated', 'closed']],
          ].map(([field, opts]) => (
            <div key={field}>
              <label className="label capitalize">{field}</label>
              <select className="input" value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })}>
                {opts.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>
          ))}
          <div>
            <label className="label">Probability (1-5)</label>
            <input type="number" min={1} max={5} className="input" value={form.probability} onChange={(e) => setForm({ ...form, probability: +e.target.value })} />
          </div>
          <div>
            <label className="label">Impact (1-5)</label>
            <input type="number" min={1} max={5} className="input" value={form.impact} onChange={(e) => setForm({ ...form, impact: +e.target.value })} />
          </div>
          <div className="md:col-span-2 rounded-lg bg-slate-100 dark:bg-slate-800 p-3 text-center">
            <span className="text-sm text-slate-500">Auto-calculated Priority: </span>
            <span className="text-2xl font-bold text-brand-600">{form.probability * form.impact}</span>
          </div>
          <div className="md:col-span-2">
            <label className="label">Mitigation Plan</label>
            <textarea className="input" rows={2} value={form.mitigation} onChange={(e) => setForm({ ...form, mitigation: e.target.value })} />
          </div>
          <div>
            <label className="label">Owner</label>
            <input className="input" value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })} />
          </div>
          <div className="flex gap-2 items-end">
            <button type="submit" className="btn-primary flex-1">Save</button>
            <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      <div className="card overflow-x-auto !p-0">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800">
            <tr>
              <th className="text-left p-3">Title</th>
              <th className="text-left p-3">Type</th>
              <th className="p-3">P</th>
              <th className="p-3">I</th>
              <th className="p-3">Priority</th>
              <th className="text-left p-3">Mitigation</th>
              <th className="text-left p-3">Owner</th>
              <th className="text-left p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {risks.map((r) => {
              const pl = priorityLabel(r.priority);
              return (
                <tr key={r._id} className="border-t border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="p-3 font-medium max-w-[180px]">{r.title}</td>
                  <td className="p-3 capitalize">{r.type}</td>
                  <td className="p-3 text-center">{r.probability}</td>
                  <td className="p-3 text-center">{r.impact}</td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${pl.class}`}>
                      {r.priority} {pl.text}
                    </span>
                  </td>
                  <td className="p-3 max-w-[200px] truncate text-slate-500">{r.mitigation}</td>
                  <td className="p-3">{r.owner}</td>
                  <td className="p-3 capitalize">{r.status}</td>
                  <td className="p-3">
                    <div className="flex gap-1">
                      <button onClick={() => getAI(r._id)} title="AI recommendation" className="p-1 hover:text-brand-600">
                        <Sparkles className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setEditing(r._id);
                          setForm(r);
                          setShowForm(true);
                        }}
                        className="p-1 hover:text-brand-600"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => remove(r._id)} className="p-1 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {risks.length === 0 && <p className="p-8 text-center text-slate-500">No risks yet. Run seed or add one.</p>}
      </div>
    </div>
  );
}
