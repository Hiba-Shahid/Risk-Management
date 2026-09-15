import { useEffect, useState } from 'react';
import api from '../api/client';
import StatCard from '../components/StatCard';
import RiskHeatmap from '../components/RiskHeatmap';
import { AlertTriangle, Clock, CheckCircle2, Layers } from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';

const COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#06b6d4'];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/dashboard/stats')
      .then((res) => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-slate-500">Loading dashboard...</p>;
  if (!stats) return <p className="text-red-500">Failed to load. Is the API running?</p>;

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-slate-500 text-sm">Overview of project risks and mitigation progress</p>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total Risks" value={stats.totalRisks} icon={Layers} />
        <StatCard title="High Priority" value={stats.highPriorityRisks} subtitle="Priority ≥ 15" icon={AlertTriangle} color="red" />
        <StatCard title="Delayed Tasks" value={stats.delayedTasks} icon={Clock} color="amber" />
        <StatCard
          title="Mitigation Progress"
          value={`${stats.mitigationProgress}%`}
          subtitle={`${stats.deadlineRisks} overdue deadline risks`}
          icon={CheckCircle2}
          color="green"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="font-semibold mb-4">Risks by Category</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={stats.risksByCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                {stats.risksByCategory.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2 className="font-semibold mb-4">Priority Distribution</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={stats.priorityDistribution}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="font-semibold mb-4">Risk Heatmap (Probability × Impact)</h2>
          <RiskHeatmap data={stats.heatmap} />
        </div>

        <div className="card">
          <h2 className="font-semibold mb-4">Technical vs Non-Technical</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={stats.risksByType}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#4f46e5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {stats.timeline?.length > 0 && (
        <div className="card">
          <h2 className="font-semibold mb-4">Deadline Timeline</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart
              data={stats.timeline.map((t) => ({
                name: t.title.slice(0, 15),
                priority: t.priority,
                days: Math.ceil((new Date(t.deadline) - new Date()) / 86400000),
              }))}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="priority" stroke="#ef4444" name="Priority" />
              <Line type="monotone" dataKey="days" stroke="#6366f1" name="Days left" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
