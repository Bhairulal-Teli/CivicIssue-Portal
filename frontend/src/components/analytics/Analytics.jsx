import React from 'react';
import { TrendingUp } from 'lucide-react';
import { mockIssues } from '../../data/mockData';

const Analytics = () => {
  const issuesByCategory = mockIssues.reduce((acc, issue) => {
    acc[issue.category] = (acc[issue.category] || 0) + 1;
    return acc;
  }, {});

  const totalIssues = mockIssues.length;
  const resolvedIssues = mockIssues.filter(issue => issue.status === 'Resolved').length;
  const pendingIssues = mockIssues.filter(issue => issue.status === 'Pending').length;
  const inProgressIssues = mockIssues.filter(issue => issue.status === 'In Progress').length;

  const resolutionRate = ((resolvedIssues / totalIssues) * 100).toFixed(1);

  const monthlyData = [
    { month: 'Jan', issues: 45, resolved: 38 },
    { month: 'Feb', issues: 52, resolved: 44 },
    { month: 'Mar', issues: 48, resolved: 41 },
    { month: 'Apr', issues: 61, resolved: 55 },
    { month: 'May', issues: 55, resolved: 49 },
    { month: 'Jun', issues: 58, resolved: 52 }
  ];

  const priorityDistribution = mockIssues.reduce((acc, issue) => {
    acc[issue.priority] = (acc[issue.priority] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="p-6 fade-in">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Analytics & Reports</h2>
        <p className="text-gray-600">Track performance metrics and identify trends</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Issues</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">{totalIssues}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              📊
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Resolution Rate</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{resolutionRate}%</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              ✅
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">2.3 days</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              ⏱️
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Issues</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{pendingIssues}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              ⏳
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Issues by Category */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Issues by Category</h3>
          <div className="space-y-3">
            {Object.entries(issuesByCategory).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-gray-700">{category}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{width: `${(count / Math.max(...Object.values(issuesByCategory))) * 100}%`}}
                    ></div>
                  </div>
                  <span className="font-semibold text-gray-900 w-8 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Priority Distribution</h3>
          <div className="space-y-3">
            {Object.entries(priorityDistribution).map(([priority, count]) => {
              const percentage = ((count / totalIssues) * 100).toFixed(1);
              const colorClass = priority === 'High' ? 'bg-red-500' : 
                               priority === 'Medium' ? 'bg-yellow-500' : 'bg-green-500';
              return (
                <div key={priority} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${colorClass}`}></div>
                    <span className="text-gray-700">{priority}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">{percentage}%</span>
                    <span className="font-semibold text-gray-900">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Status Overview */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-700 mb-1">{pendingIssues}</div>
            <div className="text-sm text-yellow-600 font-medium">Pending Issues</div>
            <div className="text-xs text-yellow-500 mt-1">
              {((pendingIssues / totalIssues) * 100).toFixed(1)}% of total
            </div>
          </div>
          
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-700 mb-1">{inProgressIssues}</div>
            <div className="text-sm text-blue-600 font-medium">In Progress</div>
            <div className="text-xs text-blue-500 mt-1">
              {((inProgressIssues / totalIssues) * 100).toFixed(1)}% of total
            </div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-700 mb-1">{resolvedIssues}</div>
            <div className="text-sm text-green-600 font-medium">Resolved</div>
            <div className="text-xs text-green-500 mt-1">
              {resolutionRate}% of total
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Trends Chart Placeholder */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trends</h3>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="text-center">
            <TrendingUp size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 mb-2">Chart visualization would be integrated here</p>
            <p className="text-sm text-gray-400">Connect with libraries like Chart.js, Recharts, or D3.js</p>
            <div className="mt-4 text-xs text-gray-400">
              Sample data: {monthlyData.map(d => `${d.month}: ${d.issues} issues, ${d.resolved} resolved`).join(' | ')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;