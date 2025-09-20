import React from 'react';
import { Eye, Edit, UserPlus, MapPin, Calendar } from 'lucide-react';

const IssueCard = ({ issue, onView, onEdit, onAssign }) => {
  const statusColors = {
    'Pending': 'bg-yellow-100 text-yellow-800',
    'In Progress': 'bg-blue-100 text-blue-800',
    'Resolved': 'bg-green-100 text-green-800'
  };

  const priorityColors = {
    'Low': 'bg-gray-100 text-gray-800',
    'Medium': 'bg-orange-100 text-orange-800',
    'High': 'bg-red-100 text-red-800'
  };

  const getMediaIcon = (type) => {
    switch (type) {
      case 'video': return '🎥';
      case 'audio': return '🎵';
      case 'image': return '📷';
      default: return '📄';
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow card-hover">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{issue.title}</h3>
            <span className="text-lg">{getMediaIcon(issue.type)}</span>
          </div>
          <p className="text-gray-600 text-sm mb-3">{issue.description}</p>
          
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <MapPin size={14} />
              <span>{issue.location}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar size={14} />
              <span>{issue.date}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[issue.status]}`}>
            {issue.status}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[issue.priority]}`}>
            {issue.priority}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onView(issue)}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => onEdit(issue)}
            className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="Edit Issue"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onAssign(issue)}
            className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
            title="Assign Task"
          >
            <UserPlus size={16} />
          </button>
        </div>
      </div>

      {issue.assignedTo && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-500">Assigned to: </span>
          <span className="text-xs font-medium text-blue-600">{issue.assignedTo}</span>
        </div>
      )}
    </div>
  );
};

export default IssueCard;