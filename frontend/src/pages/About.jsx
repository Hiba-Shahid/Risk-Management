import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8">
      <div className="max-w-3xl mx-auto card">
        <Link to="/" className="text-brand-600 text-sm">← Back home</Link>
        <h1 className="text-3xl font-bold mt-4">About RiskVision</h1>
        <p className="mt-4 text-slate-600 dark:text-slate-400 leading-relaxed">
          RiskVision is a Smart Risk Management System built for Final Year Project (FYP) teams.
          It integrates five core topics: risk identification, survey research, risk register with
          priority scoring (Probability × Impact), PERT-based scheduling, and deadline response strategies
          (avoidance, mitigation, transfer, acceptance).
        </p>
        <h2 className="text-xl font-semibold mt-8">Tech Stack</h2>
        <ul className="mt-2 list-disc list-inside text-slate-600 dark:text-slate-400 space-y-1">
          <li>React + Tailwind CSS + Recharts</li>
          <li>Node.js + Express.js</li>
          <li>MongoDB</li>
          <li>PDF/CSV export, dark mode, AI mitigation suggestions</li>
        </ul>
        <Link to="/dashboard" className="btn-primary inline-block mt-8">Go to Dashboard</Link>
      </div>
    </div>
  );
}
