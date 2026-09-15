import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Research from './pages/Research';
import Dashboard from './pages/Dashboard';
import Survey from './pages/Survey';
import RiskRegister from './pages/RiskRegister';
import PERT from './pages/PERT';
import Comparison from './pages/Comparison';
import DeadlineStrategies from './pages/DeadlineStrategies';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/research" element={<Research />} />
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/survey" element={<Survey />} />
        <Route path="/register" element={<RiskRegister />} />
        <Route path="/pert" element={<PERT />} />
        <Route path="/comparison" element={<Comparison />} />
        <Route path="/deadline" element={<DeadlineStrategies />} />
      </Route>
    </Routes>
  );
}
