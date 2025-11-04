import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import FunnelPage from './pages/FunnelPage';
import CohortPage from './pages/CohortPage';
import PatientDetailPage from './pages/PatientDetailPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/funnel" element={<FunnelPage />} />
          <Route path="/cohort" element={<CohortPage />} />
          <Route path="/patient/:id" element={<PatientDetailPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;


