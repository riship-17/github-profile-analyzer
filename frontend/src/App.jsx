import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import AutoApply from './pages/AutoApply';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 pt-16">
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/auto-apply" element={<AutoApply />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
