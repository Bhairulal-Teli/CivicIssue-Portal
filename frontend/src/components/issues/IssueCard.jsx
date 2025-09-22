import React, { useState, useEffect } from 'react';
import { Eye, Edit, UserPlus, MapPin, Calendar, ImageIcon, Camera } from 'lucide-react';
import OptimizedImage from '../common/OptimizedImage';

const IssueCard = ({ issue, onView, onEdit, onAssign }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-shuffle images every 7 seconds if multiple images exist
  useEffect(() => {
    if (issue.photos && issue.photos.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => 
          (prevIndex + 1) % issue.photos.length
        );
      }, 7000);

      return () => clearInterval(interval);
    }
  }, [issue.photos]);

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
      {/* Photo Section with Shuffle */}
      {hasPhotos && (
        <div className="relative h-48 w-full overflow-hidden bg-gray-100">
          <OptimizedImage
            src={issue.photos[currentImageIndex]}
            alt={issue.title}
            className="w-full h-48 object-contain bg-gray-100"
            onClick={() => onView(issue)}
            style={{
              transition: 'opacity 0.5s ease-in-out'
            }}
          />

          {/* Image indicators for multiple images */}
          {issue.photos.length > 1 && (
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 bg-black bg-opacity-70 rounded-full px-3 py-2">
              {issue.photos.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full cursor-pointer transition-all ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                />
              ))}
              <span className="text-white text-xs ml-2 font-medium">
                {currentImageIndex + 1}/{issue.photos.length}
              </span>
            </div>
          )}

          {/* Photo count badge */}
          {issue.photos.length > 1 && (
            <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-xs flex items-center">
              <ImageIcon size={12} className="mr-1" />
              {issue.photos.length}
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

      {/* No Photo State */}
      {!hasPhotos && (
        <div className="relative h-32 w-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mb-2 mx-auto">
              <Camera size={20} className="text-gray-500" />
            </div>
            <span className="text-gray-500 text-sm font-medium">No Image</span>
          </div>
          
          <div className="absolute top-2 left-2 bg-gray-600 text-white px-2 py-1 rounded-full text-xs">
            {getMediaIcon(issue.type)}
          </div>
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

          {/* Enhanced Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onView(issue)}
              className="flex items-center space-x-1 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 rounded-lg transition-colors text-sm font-medium border border-blue-200"
              title="View Details"
            >
              <Eye size={14} />
              <span>View</span>
            </button>
            <button
              onClick={() => onEdit(issue)}
              className="flex items-center space-x-1 px-3 py-2 bg-green-50 hover:bg-green-100 text-green-600 hover:text-green-700 rounded-lg transition-colors text-sm font-medium border border-green-200"
              title="Edit Issue"
            >
              <Edit size={14} />
              <span>Edit</span>
            </button>
            <button
              onClick={() => onAssign(issue)}
              className="flex items-center space-x-1 px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-600 hover:text-purple-700 rounded-lg transition-colors text-sm font-medium border border-purple-200"
              title="Assign Task"
            >
              <UserPlus size={14} />
              <span>Assign</span>
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

// Simple Issues Container Component for organizing layout
const IssuesContainer = ({ issues, onView, onEdit, onAssign }) => {
  // Safety check for issues array
  if (!Array.isArray(issues)) {
    console.warn('Issues prop is not an array:', issues);
    return <div>No issues to display</div>;
  }

  // Separate issues with and without photos
  const issuesWithPhotos = issues.filter(issue => issue && issue.photos && issue.photos.length > 0);
  const issuesWithoutPhotos = issues.filter(issue => issue && (!issue.photos || issue.photos.length === 0));

  return (
    <div className="space-y-8">
      {/* Issues with Photos Section */}
      {issuesWithPhotos.length > 0 && (
        <div>
          <div className="flex items-center mb-6">
            <ImageIcon size={20} className="text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">
              Issues with Photos ({issuesWithPhotos.length})
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {issuesWithPhotos.map((issue, index) => (
              <IssueCard
                key={issue.id || `photo-${index}`}
                issue={issue}
                onView={onView}
                onEdit={onEdit}
                onAssign={onAssign}
              />
            ))}
          </div>
        </div>
      )}

      {/* Issues without Photos Section */}
      {issuesWithoutPhotos.length > 0 && (
        <div>
          <div className="flex items-center mb-6">
            <Camera size={20} className="text-gray-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">
              Issues without Photos ({issuesWithoutPhotos.length})
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {issuesWithoutPhotos.map((issue, index) => (
              <IssueCard
                key={issue.id || `no-photo-${index}`}
                issue={issue}
                onView={onView}
                onEdit={onEdit}
                onAssign={onAssign}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {issues.length === 0 && (
        <div className="text-center py-12">
          <Camera size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Issues Found</h3>
          <p className="text-gray-600">Issues will appear here once they are created.</p>
        </div>
      )}
    </div>
  );
};

export default IssueCard;
export { IssuesContainer };