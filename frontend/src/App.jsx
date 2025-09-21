import React, { useState } from 'react';
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';
import Dashboard from './components/dashboard/Dashboard';
import IssuesList from './components/issues/IssuesList';
import Departments from './components/departments/Departments';
import Analytics from './components/analytics/Analytics';
import Settings from './components/settings/Settings';
import TestStatusUpdate from './components/debug/TestStatusUpdate'; // Add this
import './App.css';

const App = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'issues':
        return <IssuesList />;
      case 'departments':
        return <Departments />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <Settings />;
      case 'debug': // Add this
        return <TestStatusUpdate />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <div className="flex-1">
          <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
          <main className="min-h-screen">
            {renderPage()}
            {/* Temporarily add debug component at bottom */}
            {currentPage === 'issues' && <TestStatusUpdate />}
          </main>
        </div>
      </div>
    </div>
  );
};

export default App;