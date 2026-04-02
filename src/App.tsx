import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import StepDetails from './pages/StepDetails';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/step/:stepIndex" element={<StepDetails />} />
    </Routes>
  );
}
