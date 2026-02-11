import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Dashboard from './Dashboard';
import './App.css';

import CustomerList from './CustomerList';

import PerformanceReport from './PerformanceReport';

import CalendarView from './CalendarView';

import ResourceCenter from './ResourceCenter';
import CheckIn from './CheckIn';
import QueryTools from './QueryTools';
import DocumentCenter from './DocumentCenter';
import Settings from './Settings';
import AuditLogs from './AuditLogs';

function App() {
  // Determine if we are on GitHub Pages
  const isGitHubPages = window.location.hostname.includes('github.io');
  const basename = isGitHubPages ? '/yucheng-crm' : '/';

  return (
    <Router basename={basename}>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/customers" element={<CustomerList />} />
          <Route path="/performance" element={<PerformanceReport />} />
          <Route path="/calendar" element={<CalendarView />} />
          <Route path="/checkin" element={<CheckIn />} />
          <Route path="/tools" element={<QueryTools />} />
          <Route path="/documents" element={<DocumentCenter />} />
          <Route path="/resources" element={<ResourceCenter />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/audit" element={<AuditLogs />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
