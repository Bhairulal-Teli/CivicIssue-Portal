import React, { useState, useEffect } from 'react';
import { FileText, Clock, Activity, CheckCircle } from 'lucide-react';
import StatsCard from './StatsCard';
import LoadingSpinner from '../common/LoadingSpinner';
import { issuesAPI } from '../../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentIssues, setRecentIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch statistics and recent issues
      const [statsResponse, issuesResponse] = await Promise.all([
        issuesAPI.getStats(),
        issuesAPI.getAll({ limit: 5 })
      ]);

      if (statsResponse.success) {
        setStats(statsResponse.data);
      }

      if (issuesResponse.success) {
        setRecentIssues(issuesResponse.data);
      }

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <LoadingSpinner size="large" />
          <p className="mt-4 text-gray-600">Loading dashboard from database...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Dashboard</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 fade-in">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h2>
        <p className="text-gray-600">Monitor and manage civic issues from your MongoDB Atlas database</p>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Issues"
            value={stats.totalIssues}
            change="+12%"
            icon={FileText}
            color="blue"
          />
          <StatsCard
            title="Pending"
            value={stats.pendingIssues}
            change="+5%"
            icon={Clock}
            color="yellow"
          />
          <StatsCard
            title="In Progress"
            value={stats.inProgressIssues}
            change="-3%"
            icon={Activity}
            color="blue"
          />
          <StatsCard
            title="Resolved"
            value={stats.resolvedIssues}
            change="+15%"
            icon={CheckCircle}
            color="green"
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Issues */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Issues</h3>
          <div className="space-y-3">
            {recentIssues.length > 0 ? (
              recentIssues.slice(0, 5).map((issue) => (
                <div key={issue.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{issue.title}</p>
                    <p className="text-xs text-gray-600">{issue.location}</p>
                    <p className="text-xs text-blue-600">{issue.category}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    issue.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    issue.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                    issue.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {issue.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No recent issues found</p>
            )}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Issues by Category</h3>
          <div className="space-y-3">
            {stats && stats.categoryStats ? (
              stats.categoryStats.map((category) => (
                <div key={category._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{category._id}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{
                          width: `${Math.max(10, (category.count / Math.max(...stats.categoryStats.map(c => c.count))) * 100)}%`
                        }}
                      ></div>
                    </div>
                    <span className="font-semibold text-gray-900 w-8 text-right">{category.count}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No category data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Resolution Rate Card */}
      {stats && (
        <div className="mt-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">Resolution Rate</h3>
              <p className="text-blue-100">Overall system performance</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{stats.resolutionRate}%</div>
              <p className="text-blue-100 text-sm">of issues resolved</p>
            </div>
          </div>
          <div className="mt-4 bg-blue-400 rounded-full h-2">
            <div 
              className="bg-white rounded-full h-2 transition-all duration-500" 
              style={{ width: `${stats.resolutionRate}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Database Connection Status */}
      <div className="mt-6 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Connected to MongoDB Atlas</span>
          </div>
          <span className="text-xs text-gray-500">civicDB • {stats?.totalIssues || 0} documents</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;