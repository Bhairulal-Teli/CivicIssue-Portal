import React from 'react';
import { Users } from 'lucide-react';
import { departments } from '../../data/mockData';

const Departments = () => {
  const getEfficiencyColor = (efficiency) => {
    if (efficiency >= 85) return 'bg-green-500';
    if (efficiency >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getPerformanceLabel = (efficiency) => {
    if (efficiency >= 85) return 'Excellent';
    if (efficiency >= 70) return 'Good';
    return 'Needs Improvement';
  };

  const getPerformanceLabelColor = (efficiency) => {
    if (efficiency >= 85) return 'text-green-600';
    if (efficiency >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="p-6 fade-in">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Departments</h2>
        <p className="text-gray-600">Manage and monitor department performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {departments.map((dept) => (
          <div key={dept.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 card-hover">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{dept.name}</h3>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Users size={24} className="text-blue-600" />
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Active Issues</span>
                <span className="font-semibold text-gray-900">{dept.activeIssues}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Resolved</span>
                <span className="font-semibold text-gray-900">{dept.totalResolved}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Average Response Time</span>
                <span className="font-semibold text-blue-600">{dept.avgResponseTime}</span>
              </div>
              
              <div className="pt-3 border-t border-gray-100">
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="text-gray-500">Performance</span>
                  <span className={`font-medium ${getPerformanceLabelColor(dept.efficiency)}`}>
                    {getPerformanceLabel(dept.efficiency)} ({dept.efficiency}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${getEfficiencyColor(dept.efficiency)}`} 
                    style={{width: `${dept.efficiency}%`}}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex space-x-2">
              <button className="flex-1 px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                View Details
              </button>
              <button className="px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Department Statistics Summary */}
      <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {departments.reduce((sum, dept) => sum + dept.activeIssues, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Active Issues</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {departments.reduce((sum, dept) => sum + dept.totalResolved, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Resolved Issues</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {(departments.reduce((sum, dept) => sum + dept.efficiency, 0) / departments.length).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Average Efficiency</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Departments;