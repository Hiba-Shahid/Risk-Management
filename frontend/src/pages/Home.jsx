import { Link } from 'react-router-dom';
import { Shield, ArrowRight, BarChart3, ClipboardList, GitBranch } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-brand-900 to-slate-900 text-white">
      <nav className="flex items-center justify-between max-w-6xl mx-auto px-6 py-6">
        <div className="flex items-center gap-2">
          <Shield className="h-8 w-8 text-brand-300" />
          <span className="text-xl font-bold">RiskVision</span>
        </div>
        <div className="flex gap-4 text-sm">
          <Link to="/about" className="hover:text-brand-300">About</Link>
          <Link to="/research" className="hover:text-brand-300">Research</Link>
          <Link to="/dashboard" className="btn-primary !bg-white !text-brand-700">Open Dashboard</Link>
        </div>
      </nav>

      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
          Risk Management Dashboard
          <br />
          <span className="text-brand-300">for Final Year Projects</span>
        </h1>
        <p className="mt-6 text-lg text-slate-300 max-w-2xl mx-auto">
          Track risks, run student surveys, simulate 2-week development with PERT scheduling,
          compare technical vs non-technical risks, and apply deadline response strategies — all in one system.
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 mt-10 rounded-xl bg-brand-500 px-8 py-4 text-lg font-semibold hover:bg-brand-400 transition"
        >
          Launch Dashboard <ArrowRight className="h-5 w-5" />
        </Link>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-20 grid md:grid-cols-3 gap-6">
        {[
          { icon: BarChart3, title: 'Analytics & Heatmaps', desc: 'Pie charts, risk matrices, and timeline views' },
          { icon: ClipboardList, title: 'Survey Module', desc: 'Top 5 FYP risks from 20+ student responses' },
          { icon: GitBranch, title: 'PERT Scheduling', desc: 'Critical path, buffers, and delay simulation' },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="rounded-2xl bg-white/10 backdrop-blur p-6 border border-white/10">
            <Icon className="h-10 w-10 text-brand-300 mb-4" />
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="mt-2 text-slate-300 text-sm">{desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
