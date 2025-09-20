import React, { useState, useEffect } from 'react';
import { Search, FileText } from 'lucide-react';
import IssueCard from './IssueCard';
import Modal from '../common/Modal';
import LoadingSpinner from '../common/LoadingSpinner';
import { issuesAPI } from '../../services/api';

const IssuesList = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Available categories from your schema
  const categories = ["Roads", "Lighting", "Sanitation", "Traffic", "Water", "Other"];

  // Fetch issues from API
  const fetchIssues = async () => {
    try {
      setLoading(true);
      const filters = {};
      
      if (filterStatus !== 'All') filters.status = filterStatus;
      if (filterPriority !== 'All') filters.priority = filterPriority;
      if (filterCategory !== 'All') filters.category = filterCategory;
      if (searchTerm) filters.search = searchTerm;

      const response = await issuesAPI.getAll(filters);
      
      if (response.success) {
        setIssues(response.data);
      } else {
        setError('Failed to fetch issues');
      }
    } catch (err) {
      console.error('Error fetching issues:', err);
      setError('Error connecting to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch issues on component mount and when filters change
  useEffect(() => {
    fetchIssues();
  }, [filterStatus, filterPriority, filterCategory, searchTerm]);

  const handleView = async (issue) => {
    try {
      // Fetch detailed issue data
      const response = await issuesAPI.getById(issue.id);
      if (response.success) {
        setSelectedIssue(response.data);
        setIsViewModalOpen(true);
      }
    } catch (err) {
      console.error('Error fetching issue details:', err);
      alert('Error loading issue details');
    }
  };

  const handleEdit = (issue) => {
    // For now, just show an alert
    alert('Edit functionality will be implemented based on your requirements');
  };

  const handleAssign = (issue) => {
    // For now, just show an alert
    alert('Assignment functionality will be implemented when departments are ready');
  };

  const handleStatusUpdate = async (issueId, newStatus) => {
    try {
      const response = await issuesAPI.updateStatus(issueId, newStatus, `Status updated to ${newStatus}`);
      if (response.success) {
        // Refresh the issues list
        fetchIssues();
        alert('Status updated successfully!');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Error updating status');
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <LoadingSpinner size="large" />
          <p className="mt-4 text-gray-600">Loading issues from database...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Connection Error</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchIssues}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 fade-in">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Issues Management</h2>
        <p className="text-gray-600">View and manage all reported civic issues from MongoDB Atlas</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 space-y-4 lg:space-y-0">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search issues..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Acknowledged">Acknowledged</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All">All Priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Results count */}
        <div className="mt-4 text-sm text-gray-600">
          Found {issues.length} issue{issues.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Issues Grid */}
      {issues.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {issues.map((issue) => (
            <IssueCard
              key={issue.id}
              issue={issue}
              onView={handleView}
              onEdit={handleEdit}
              onAssign={handleAssign}
              onStatusUpdate={handleStatusUpdate}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <FileText size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">No issues found matching your filters</p>
          <button
            onClick={() => {
              setFilterStatus('All');
              setFilterPriority('All');
              setFilterCategory('All');
              setSearchTerm('');
            }}
            className="mt-4 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* View Issue Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Issue Details"
      >
        {selectedIssue && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{selectedIssue.title}</h3>
              <p className="text-gray-600">{selectedIssue.description}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <p className="text-gray-900">{selectedIssue.status}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Priority</label>
                <p className="text-gray-900">{selectedIssue.priority}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Category</label>
                <p className="text-gray-900">{selectedIssue.category}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Date Reported</label>
                <p className="text-gray-900">{selectedIssue.date}</p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Location</label>
              <p className="text-gray-900">{selectedIssue.location}</p>
              {selectedIssue.ward && (
                <p className="text-sm text-gray-500">Ward: {selectedIssue.ward}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Reported By</label>
              <p className="text-gray-900">{selectedIssue.reportedBy}</p>
            </div>

            {selectedIssue.assignedTo && (
              <div>
                <label className="text-sm font-medium text-gray-500">Assigned To</label>
                <p className="text-gray-900">{selectedIssue.assignedTo}</p>
              </div>
            )}

            {/* Photos */}
            {selectedIssue.photos && selectedIssue.photos.length > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-500 mb-2 block">Photos</label>
                <div className="grid grid-cols-2 gap-2">
                  {selectedIssue.photos.map((photo, index) => (
                    <img
                      key={index}
                      src={photo}
                      alt={`Issue photo ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border border-gray-200"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/200x150/3B82F6/FFFFFF?text=Image+Not+Found';
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Timeline */}
            {selectedIssue.timeline && selectedIssue.timeline.length > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-500 mb-3 block">Timeline</label>
                <div className="space-y-3">
                  {selectedIssue.timeline.map((entry, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900">{entry.status}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(entry.at).toLocaleDateString()}
                          </span>
                        </div>
                        {entry.note && (
                          <p className="text-sm text-gray-600 mt-1">{entry.note}</p>
                        )}
                        {entry.by && (
                          <p className="text-xs text-gray-500 mt-1">By: {entry.by}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Status Update */}
            <div className="pt-4 border-t border-gray-200">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Quick Status Update</label>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleStatusUpdate(selectedIssue.id, 'Acknowledged')}
                  className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                >
                  Acknowledge
                </button>
                <button
                  onClick={() => handleStatusUpdate(selectedIssue.id, 'In Progress')}
                  className="px-3 py-1 text-xs bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-colors"
                >
                  In Progress
                </button>
                <button
                  onClick={() => handleStatusUpdate(selectedIssue.id, 'Resolved')}
                  className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                >
                  Resolve
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default IssuesList;