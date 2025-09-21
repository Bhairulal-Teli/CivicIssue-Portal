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
      pendingIssues,
      inProgressIssues,
      resolvedIssues,
      categoryStats,
      priorityStats
    ] = await Promise.all([
      Issue.countDocuments(),
      Issue.countDocuments({ status: 'Pending' }),
      Issue.countDocuments({ status: 'In Progress' }),
      Issue.countDocuments({ status: 'Resolved' }),
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
      pendingIssues,
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

// @desc    Search issues (MUST be before /:id route)
// @route   GET /api/issues/search
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const issues = await Issue.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { 'location.address': { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } }
      ]
    })
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

    const transformedIssues = issues.map(issue => transformIssueData(issue));

    res.json({
      success: true,
      data: transformedIssues,
      count: transformedIssues.length
    });

  } catch (error) {
    console.error('Error searching issues:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching issues',
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
    
    // Status filter - direct match since friend uses same names
    if (status && status !== 'All') {
      filters.status = status; // Direct match: "Pending", "In Progress", "Resolved"
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
          status: issue.status || 'Pending', // Direct use since statuses match
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
    console.log('Status update request received:');
    console.log('Issue ID:', req.params.id);
    console.log('Request body:', req.body);

    const { status, note } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    // Validate status is one of the allowed values
    const allowedStatuses = ['Pending', 'In Progress', 'Resolved'];
    if (!allowedStatuses.includes(status)) {
      console.log('Invalid status provided:', status);
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${allowedStatuses.join(', ')}. Received: ${status}`
      });
    }

    // Validate ObjectId format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid issue ID format'
      });
    }

    const issue = await Issue.findById(req.params.id);
    console.log('Found issue:', !!issue);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    console.log('Current issue status:', issue.status);
    console.log('Updating to status:', status);

    // Direct assignment since statuses now match
    issue.status = status;
    
    // Add to timeline - make sure timeline exists
    if (!issue.timeline) {
      issue.timeline = [];
    }
    
    const timelineEntry = {
      status: status,
      note: note || `Status updated to ${status}`,
      at: new Date()
    };
    
    console.log('Adding timeline entry:', timelineEntry);
    issue.timeline.push(timelineEntry);

    // Set resolved date if status is resolved
    if (status === 'Resolved' && !issue.resolvedAt) {
      issue.resolvedAt = new Date();
      console.log('Setting resolved date:', issue.resolvedAt);
    }

    console.log('Saving issue...');
    const savedIssue = await issue.save();
    console.log('Issue saved successfully');

    const transformedIssue = transformIssueData(savedIssue);

    res.json({
      success: true,
      data: transformedIssue,
      message: 'Issue status updated successfully'
    });

  } catch (error) {
    console.error('Detailed error updating issue status:');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    // Check for specific MongoDB errors
    if (error.name === 'ValidationError') {
      console.error('Validation errors:', error.errors);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        details: Object.keys(error.errors).map(key => ({
          field: key,
          message: error.errors[key].message
        }))
      });
    }

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating issue status',
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// @desc    Create new issue (for testing)
// @route   POST /api/issues
// @access  Public
router.post('/', async (req, res) => {
  try {
    const {
      title,
      description,
      category = 'Other',
      priority = 'normal',
      location,
      photos = []
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required'
      });
    }

    if (!location || !location.address) {
      return res.status(400).json({
        success: false,
        message: 'Location with address is required'
      });
    }

    // For now, create a dummy user ID (you'll replace this with actual user from token)
    const dummyUserId = '507f1f77bcf86cd799439011'; // Valid ObjectId format

    const newIssue = new Issue({
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      location,
      photos,
      createdBy: dummyUserId,
      timeline: [{
        status: 'Pending',
        note: 'Issue created',
        at: new Date()
      }]
    });

    const savedIssue = await newIssue.save();

    res.status(201).json({
      success: true,
      data: transformIssueData(savedIssue),
      message: 'Issue created successfully'
    });

  } catch (error) {
    console.error('Error creating issue:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating issue',
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
      status: issue.status || 'Pending', // Direct use - no transformation needed
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
        status: t.status || 'Pending', // Direct use
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

// Helper function to transform priority
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

// @desc    Migrate timeline status values (run once)
// @route   POST /api/issues/migrate-timeline
// @access  Public (for now)
router.post('/migrate-timeline', async (req, res) => {
  try {
    console.log('🔄 Starting timeline migration...');

    // Status mapping from old to new
    const statusMap = {
      'open': 'Pending',
      'acknowledged': 'Pending',
      'in_progress': 'In Progress', 
      'resolved': 'Resolved',
      'closed': 'Resolved'
    };

    // Get all issues with raw data (no validation)
    const issues = await Issue.find({}).lean();
    console.log(`Found ${issues.length} issues`);

    let updatedCount = 0;

    for (const issue of issues) {
      let needsUpdate = false;
      let updates = {};

      // Update main status
      if (issue.status && statusMap[issue.status]) {
        updates.status = statusMap[issue.status];
        needsUpdate = true;
      } else if (!['Pending', 'In Progress', 'Resolved'].includes(issue.status)) {
        updates.status = 'Pending';
        needsUpdate = true;
      }

      // Update timeline
      if (issue.timeline && Array.isArray(issue.timeline)) {
        const updatedTimeline = issue.timeline.map(entry => ({
          ...entry,
          status: statusMap[entry.status] || entry.status || 'Pending'
        }));
        updates.timeline = updatedTimeline;
        needsUpdate = true;
      }

      if (needsUpdate) {
        await Issue.updateOne({ _id: issue._id }, { $set: updates });
        updatedCount++;
      }
    }

    // Get final stats
    const stats = await Promise.all([
      Issue.countDocuments({ status: 'Pending' }),
      Issue.countDocuments({ status: 'In Progress' }),
      Issue.countDocuments({ status: 'Resolved' })
    ]);

    res.json({
      success: true,
      message: 'Timeline migration completed',
      updatedIssues: updatedCount,
      totalIssues: issues.length,
      finalStats: {
        pending: stats[0],
        inProgress: stats[1],
        resolved: stats[2]
      }
    });

  } catch (error) {
    console.error('Migration error:', error);
    res.status(500).json({
      success: false,
      message: 'Migration failed',
      error: error.message
    });
  }
});

// @desc    Simple test endpoint for PATCH method
// @route   PATCH /api/issues/test-patch
// @access  Public
router.patch('/test-patch', async (req, res) => {
  console.log('PATCH test endpoint hit');
  console.log('Request body:', req.body);
  console.log('Request headers:', req.headers);
  
  res.json({
    success: true,
    message: 'PATCH endpoint working',
    receivedData: req.body,
    timestamp: new Date()
  });
});

// @desc    Test endpoint to check issue exists and status update
// @route   GET /api/issues/:id/test-status
// @access  Public
router.get('/:id/test-status', async (req, res) => {
  try {
    console.log('Testing issue ID:', req.params.id);
    
    const issue = await Issue.findById(req.params.id);
    
    if (!issue) {
      return res.json({
        success: false,
        message: 'Issue not found',
        issueId: req.params.id
      });
    }

    res.json({
      success: true,
      message: 'Issue found',
      data: {
        id: issue._id,
        title: issue.title,
        currentStatus: issue.status,
        allowedStatuses: ['Pending', 'In Progress', 'Resolved'],
        hasTimeline: !!issue.timeline,
        timelineLength: issue.timeline ? issue.timeline.length : 0,
        timelineStatuses: issue.timeline ? issue.timeline.map(t => t.status) : []
      }
    });

  } catch (error) {
    res.json({
      success: false,
      message: 'Error finding issue',
      error: error.message,
      issueId: req.params.id
    });
  }
});

module.exports = router;