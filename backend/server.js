const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB Atlas');
  console.log('📊 Database:', mongoose.connection.name);
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error);
  process.exit(1);
});

// IMPORTANT: Import models BEFORE routes
const Issue = require('./models/Issue');
const User = require('./models/User');

console.log('📋 Models loaded:', {
  Issue: !!Issue,
  User: !!User
});

// Import routes AFTER models
const issueRoutes = require('./routes/issues');

// Routes
app.use('/api/issues', issueRoutes);

// Health check
app.get('/api/health', async (req, res) => {
  try {
    const [issueCount, userCount] = await Promise.all([
      Issue.countDocuments(),
      User.countDocuments()
    ]);
    
    res.json({
      status: 'OK',
      message: 'Server is running',
      database: 'Connected',
      collections: {
        issues: issueCount,
        users: userCount
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'Error',
      message: error.message
    });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}/api`);
});