import { Link } from 'react-router-dom';

const findings = [
  { risk: 'Deadline pressure', pct: '78%', mitigation: 'Weekly sprint planning + buffer week' },
  { risk: 'Poor communication', pct: '65%', mitigation: 'Daily stand-ups, shared docs' },
  { risk: 'Scope creep', pct: '58%', mitigation: 'Requirement freeze after design' },
  { risk: 'Lack of technical skills', pct: '52%', mitigation: 'Early training, pair programming' },
  { risk: 'Team conflict', pct: '45%', mitigation: 'Defined RACI responsibilities' },
];

export default function Research() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="text-brand-600 text-sm">← Back home</Link>
        <h1 className="text-3xl font-bold mt-4">Research Findings</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Empirical survey of FYP students — top risks and recommended mitigations.
        </p>
        <div className="mt-8 overflow-x-auto card !p-0">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left p-4">Risk</th>
                <th className="text-left p-4">Frequency</th>
                <th className="text-left p-4">Suggested Mitigation</th>
              </tr>
            </thead>
            <tbody>
              {findings.map((f) => (
                <tr key={f.risk} className="border-t border-slate-200 dark:border-slate-800">
                  <td className="p-4 font-medium">{f.risk}</td>
                  <td className="p-4">{f.pct}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-400">{f.mitigation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-6 text-sm text-slate-500">
          Live data from the Survey module updates these analytics dynamically.
        </p>
        <Link to="/survey" className="btn-primary inline-block mt-4">View Survey Analytics</Link>
      </div>
    </div>
  );
}
