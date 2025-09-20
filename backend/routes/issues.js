const express = require('express');
const router = express.Router();
const Issue = require('../models/Issue');

// Helper function to safely format dates
function safeFormatDate(date, fallback = new Date()) {
  try {
    if (!date) return fallback.toISOString().split('T')[0];
    const dateObj = date instanceof Date ? date : new Date(date);
    return isNaN(dateObj.getTime()) ? fallback.toISOString().split('T')[0] : dateObj.toISOString().split('T')[0];
  } catch (error) {
    return fallback.toISOString().split('T')[0];
  }
}

// @desc    Get issues statistics (MUST be before /:id route)
// @route   GET /api/issues/stats
// @access  Public
router.get('/stats', async (req, res) => {
  try {
    const [
      totalIssues,
      openIssues,
      inProgressIssues,
      resolvedIssues,
      categoryStats,
      priorityStats
    ] = await Promise.all([
      Issue.countDocuments(),
      Issue.countDocuments({ status: 'open' }),
      Issue.countDocuments({ status: 'in_progress' }),
      Issue.countDocuments({ status: 'resolved' }),
      Issue.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      Issue.aggregate([
        { $group: { _id: '$priority', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ])
    ]);

    const transformedStats = {
      totalIssues,
      pendingIssues: openIssues,
      inProgressIssues,
      resolvedIssues,
      resolutionRate: totalIssues > 0 ? ((resolvedIssues / totalIssues) * 100).toFixed(1) : 0,
      categoryStats,
      priorityStats: priorityStats.map(p => ({
        _id: transformPriority(p._id),
        count: p.count
      }))
    };

    res.json({
      success: true,
      data: transformedStats
    });

  } catch (error) {
    console.error('Error fetching issues stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching issues statistics',
      error: error.message
    });
  }
});

// @desc    Get all issues
// @route   GET /api/issues
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      status,
      priority,
      category,
      search,
      page = 1,
      limit = 20
    } = req.query;

    const filters = {};
    
    if (status && status !== 'All') {
      const statusMap = {
        'Pending': 'open',
        'Acknowledged': 'acknowledged',
        'In Progress': 'in_progress',
        'Resolved': 'resolved',
        'Closed': 'closed'
      };
      filters.status = statusMap[status] || status.toLowerCase();
    }
    
    if (priority && priority !== 'All') {
      const priorityMap = {
        'Low': 'low',
        'Medium': 'normal', 
        'High': 'high',
        'Critical': 'critical'
      };
      filters.priority = priorityMap[priority] || priority.toLowerCase();
    }
    
    if (category && category !== 'All') {
      filters.category = category;
    }
    
    if (search) {
      filters.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'location.address': { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const [issues, totalCount] = await Promise.all([
      Issue.find(filters)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Issue.countDocuments(filters)
    ]);

    console.log(`Found ${issues.length} issues`);

    const transformedIssues = issues.map((issue, index) => {
      try {
        return transformIssueData(issue);
      } catch (error) {
        console.error(`Error transforming issue ${index}:`, error);
        console.error('Issue data:', JSON.stringify(issue, null, 2));
        // Return a safe fallback
        return {
          id: issue._id ? issue._id.toString() : `fallback-${index}`,
          title: issue.title || 'Unknown Issue',
          description: issue.description || 'No description',
          status: transformStatus(issue.status) || 'Pending',
          priority: transformPriority(issue.priority) || 'Medium',
          category: issue.category || 'Other',
          date: safeFormatDate(issue.createdAt),
          location: (issue.location && issue.location.address) || 'Unknown Location',
          lastUpdate: safeFormatDate(issue.updatedAt),
          type: 'text',
          source: null,
          assignedTo: null,
          reportedBy: 'Citizen',
          ward: (issue.location && issue.location.ward) || null,
          photos: [],
          coordinates: null
        };
      }
    });

    res.json({
      success: true,
      data: transformedIssues,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / limit),
        totalItems: totalCount,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Error fetching issues:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching issues',
      error: error.message
    });
  }
});

// @desc    Get single issue by ID
// @route   GET /api/issues/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    const transformedIssue = transformIssueData(issue, true);

    res.json({
      success: true,
      data: transformedIssue
    });

  } catch (error) {
    console.error('Error fetching issue:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching issue',
      error: error.message
    });
  }
});

// @desc    Update issue status
// @route   PATCH /api/issues/:id/status
// @access  Private
router.patch('/:id/status', async (req, res) => {
  try {
    const { status, note } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    // Map frontend status to backend format
    const statusMap = {
      'Pending': 'open',
      'Acknowledged': 'acknowledged',
      'In Progress': 'in_progress',
      'Resolved': 'resolved',
      'Closed': 'closed'
    };

    const backendStatus = statusMap[status] || status.toLowerCase();

    // Update status
    issue.status = backendStatus;
    
    // Add to timeline
    if (!issue.timeline) {
      issue.timeline = [];
    }
    
    issue.timeline.push({
      status: backendStatus,
      note: note || `Status updated to ${status}`,
      at: new Date()
    });

    // Set resolved date if status is resolved
    if (backendStatus === 'resolved' && !issue.resolvedAt) {
      issue.resolvedAt = new Date();
    }

    await issue.save();

    res.json({
      success: true,
      data: transformIssueData(issue),
      message: 'Issue status updated successfully'
    });

  } catch (error) {
    console.error('Error updating issue status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating issue status',
      error: error.message
    });
  }
});

// Helper function to transform issue data with safe error handling
function transformIssueData(issue, includeTimeline = false) {
  try {
    // Safely access nested properties
    const location = issue.location || {};
    const photos = issue.photos || [];
    
    const transformed = {
      id: issue._id ? issue._id.toString() : 'unknown-id',
      title: issue.title || 'Untitled Issue',
      description: issue.description || 'No description provided',
      status: transformStatus(issue.status),
      priority: transformPriority(issue.priority),
      category: issue.category || 'Other',
      date: safeFormatDate(issue.createdAt),
      location: location.address || 'Unknown Location',
      lastUpdate: safeFormatDate(issue.updatedAt),
      type: photos.length > 0 ? 'image' : 'text',
      source: photos.length > 0 ? photos[0] : null,
      assignedTo: issue.assignedTo ? 'Assigned' : null,
      reportedBy: 'Citizen', // Default since no populate
      ward: location.ward || null,
      photos: photos,
      coordinates: location.coordinates || null,
      resolvedAt: issue.resolvedAt || null
    };

    if (includeTimeline && issue.timeline && Array.isArray(issue.timeline)) {
      transformed.timeline = issue.timeline.map(t => ({
        status: transformStatus(t.status),
        note: t.note || 'No note',
        by: 'System',
        at: t.at || new Date()
      }));
    } else {
      transformed.timeline = [];
    }

    return transformed;

  } catch (error) {
    console.error('Error in transformIssueData:', error);
    // Return absolute minimum safe object
    return {
      id: issue._id ? issue._id.toString() : 'error-id',
      title: 'Error Loading Issue',
      description: 'There was an error loading this issue',
      status: 'Pending',
      priority: 'Medium',
      category: 'Other',
      date: new Date().toISOString().split('T')[0],
      location: 'Unknown',
      lastUpdate: new Date().toISOString().split('T')[0],
      type: 'text',
      source: null,
      assignedTo: null,
      reportedBy: 'Unknown',
      ward: null,
      photos: [],
      coordinates: null,
      timeline: []
    };
  }
}

// Helper functions to transform data between backend and frontend formats
function transformStatus(backendStatus) {
  if (!backendStatus) return 'Pending';
  
  const statusMap = {
    'open': 'Pending',
    'acknowledged': 'Acknowledged',
    'in_progress': 'In Progress',
    'resolved': 'Resolved',
    'closed': 'Closed'
  };
  return statusMap[backendStatus] || backendStatus;
}

function transformPriority(backendPriority) {
  if (!backendPriority) return 'Medium';
  
  const priorityMap = {
    'low': 'Low',
    'normal': 'Medium',
    'high': 'High',
    'critical': 'Critical'
  };
  return priorityMap[backendPriority] || backendPriority;
}

module.exports = router;