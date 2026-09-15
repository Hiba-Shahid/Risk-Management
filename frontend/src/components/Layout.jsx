import { Link, NavLink, Outlet } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import {
  LayoutDashboard,
  ClipboardList,
  Table2,
  GitBranch,
  BarChart3,
  CalendarClock,
  Home,
  Info,
  BookOpen,
  Moon,
  Sun,
  Shield,
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/survey', label: 'Survey', icon: ClipboardList },
  { to: '/register', label: 'Risk Register', icon: Table2 },
  { to: '/pert', label: 'PERT Schedule', icon: GitBranch },
  { to: '/comparison', label: 'Tech vs Non-Tech', icon: BarChart3 },
  { to: '/deadline', label: 'Deadline Strategies', icon: CalendarClock },
];

export default function Layout() {
  const { dark, toggle } = useTheme();

  return (
    <div className="min-h-screen flex">
      <aside className="hidden lg:flex w-64 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-2 p-5 border-b border-slate-200 dark:border-slate-800">
          <Shield className="h-8 w-8 text-brand-600" />
          <div>
            <h1 className="font-bold text-lg">RiskVision</h1>
            <p className="text-xs text-slate-500">FYP Risk Dashboard</p>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                }`
              }
            >
              <Icon className="h-5 w-5" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 space-y-1">
          <Link to="/" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-500 hover:text-brand-600">
            <Home className="h-4 w-4" /> Home
          </Link>
          <Link to="/about" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-500 hover:text-brand-600">
            <Info className="h-4 w-4" /> About
          </Link>
          <Link to="/research" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-500 hover:text-brand-600">
            <BookOpen className="h-4 w-4" /> Research
          </Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/80 backdrop-blur px-4 py-3 dark:border-slate-800 dark:bg-slate-900/80 lg:hidden">
          <span className="font-bold text-brand-600">RiskVision</span>
          <button onClick={toggle} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
            {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </header>

        <header className="hidden lg:flex items-center justify-end gap-3 px-6 py-3 border-b border-slate-200 dark:border-slate-800">
          <button onClick={toggle} className="btn-secondary flex items-center gap-2">
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            {dark ? 'Light' : 'Dark'} mode
          </button>
        </header>

        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 flex justify-around border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 py-2 z-20">
        {navItems.slice(0, 5).map(({ to, icon: Icon }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `p-2 ${isActive ? 'text-brand-600' : 'text-slate-400'}`}>
            <Icon className="h-5 w-5" />
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
