import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import UserManagementPage from './pages/UserManagementPage';
import RequestMonitoringPage from './pages/RequestMonitoringPage';
import ShopkeeperSelectionPage from './pages/ShopkeeperSelectionPage';
import TransactionsPage from './pages/TransactionsPage';
import FeedbackPage from './pages/FeedbackPage';
import ReportsPage from './pages/ReportsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route path="/admin" element={<DashboardPage />} />
        <Route path="/admin/users" element={<UserManagementPage />} />
        <Route path="/admin/requests" element={<RequestMonitoringPage />} />
        <Route path="/admin/shopkeepers" element={<ShopkeeperSelectionPage />} />
        <Route path="/admin/transactions" element={<TransactionsPage />} />
        <Route path="/admin/feedback" element={<FeedbackPage />} />
        <Route path="/admin/reports" element={<ReportsPage />} />
        {/* Add routes for other admin pages */}
      </Routes>
    </Router>
  );
}

export default App;