import React from 'react';
import { Eye, Edit, UserPlus, MapPin, Calendar, ImageIcon } from 'lucide-react';
import OptimizedImage from '../common/OptimizedImage';

const IssueCard = ({ issue, onView, onEdit, onAssign }) => {
  const statusColors = {
    Pending: 'bg-yellow-100 text-yellow-800',
    'In Progress': 'bg-blue-100 text-blue-800',
    Resolved: 'bg-green-100 text-green-800',
  };

  const priorityColors = {
    Low: 'bg-gray-100 text-gray-800',
    Medium: 'bg-orange-100 text-orange-800',
    High: 'bg-red-100 text-red-800',
    Critical: 'bg-purple-100 text-purple-800',
  };

  const getMediaIcon = (type) => {
    switch (type) {
      case 'video':
        return '🎥';
      case 'audio':
        return '🎵';
      case 'image':
        return '📷';
      default:
        return '📄';
    }
  };

  const hasPhotos = issue.photos && issue.photos.length > 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow card-hover overflow-hidden">
      {/* Photo Section */}
      {hasPhotos && (
        <div className="relative h-48 w-full">
          <OptimizedImage
            src={issue.photos[0]}
            alt={issue.title}
            className="h-48"
            onClick={() => onView(issue)}
          />

          {/* Photo count badge */}
          {issue.photos.length > 1 && (
            <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-xs flex items-center">
              <ImageIcon size={12} className="mr-1" />
              +{issue.photos.length - 1}
            </div>
          )}

          {/* Media type badge */}
          <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded-full text-xs">
            {getMediaIcon(issue.type)}
          </div>

          {/* Gradient overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
        </div>
      )}

      <div className="p-6">
        {/* Title & Description */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                {issue.title}
              </h3>
              {!hasPhotos && <span className="text-lg">{getMediaIcon(issue.type)}</span>}
            </div>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{issue.description}</p>

            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1 min-w-0">
                <MapPin size={14} className="flex-shrink-0" />
                <span className="truncate">{issue.location}</span>
              </div>
              <div className="flex items-center space-x-1 flex-shrink-0">
                <Calendar size={14} />
                <span>{issue.date}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Status & Priority */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 flex-wrap">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[issue.status]}`}
            >
              {issue.status}
            </span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[issue.priority]}`}
            >
              {issue.priority}
            </span>
            {hasPhotos && (
              <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium flex items-center">
                <ImageIcon size={10} className="mr-1" />
                {issue.photos.length}
              </span>
            )}
          </div>

          {/* Action Buttons */}
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

        {/* Assigned To */}
        {issue.assignedTo && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <span className="text-xs text-gray-500">Assigned to: </span>
            <span className="text-xs font-medium text-blue-600">{issue.assignedTo}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default IssueCard;
