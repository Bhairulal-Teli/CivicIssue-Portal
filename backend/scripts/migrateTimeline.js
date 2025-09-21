const mongoose = require('mongoose');
const path = require('path');

// Load environment variables from parent directory
require('dotenv').config({ path: path.join(__dirname, '../.env') });

console.log('🔌 Connecting to:', process.env.MONGO_URI ? 'MongoDB Atlas' : 'No MongoDB URI found');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Use a flexible schema for migration
const issueSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const Issue = mongoose.model('Issue', issueSchema);

async function migrateTimelineStatuses() {
  try {
    console.log('🔄 Starting timeline status migration...');

    // Status mapping from old to new
    const statusMap = {
      'open': 'Pending',
      'acknowledged': 'Pending',
      'in_progress': 'In Progress',
      'resolved': 'Resolved',
      'closed': 'Resolved'
    };

    // Get all issues with raw data
    const issues = await Issue.find({}).lean();
    console.log(`📋 Found ${issues.length} issues to process`);

    if (issues.length === 0) {
      console.log('⚠️ No issues found in database');
      return;
    }

    let updatedCount = 0;

    for (let i = 0; i < issues.length; i++) {
      const issue = issues[i];
      let needsUpdate = false;
      let updates = {};

      console.log(`\n📝 Processing issue ${i + 1}/${issues.length}: ${issue.title || issue._id}`);

      // Check and update main status
      console.log(`   Current status: ${issue.status}`);
      if (issue.status && statusMap[issue.status]) {
        updates.status = statusMap[issue.status];
        needsUpdate = true;
        console.log(`   ➜ Will update status: ${issue.status} → ${updates.status}`);
      } else if (!['Pending', 'In Progress', 'Resolved'].includes(issue.status)) {
        updates.status = 'Pending';
        needsUpdate = true;
        console.log(`   ➜ Will set default status: ${issue.status} → Pending`);
      } else {
        console.log(`   ✅ Status already correct: ${issue.status}`);
      }

      // Check and update timeline
      if (issue.timeline && Array.isArray(issue.timeline)) {
        console.log(`   Timeline entries: ${issue.timeline.length}`);
        const updatedTimeline = issue.timeline.map((entry, idx) => {
          const oldStatus = entry.status;
          let newStatus = entry.status;
          
          if (oldStatus && statusMap[oldStatus]) {
            newStatus = statusMap[oldStatus];
            console.log(`   ➜ Timeline ${idx}: ${oldStatus} → ${newStatus}`);
          } else if (!['Pending', 'In Progress', 'Resolved'].includes(oldStatus)) {
            newStatus = 'Pending';
            console.log(`   ➜ Timeline ${idx}: ${oldStatus} → Pending (default)`);
          }
          
          return {
            ...entry,
            status: newStatus
          };
        });
        
        updates.timeline = updatedTimeline;
        needsUpdate = true;
      } else {
        console.log('   ➜ No timeline found, will create basic one');
        updates.timeline = [{
          status: updates.status || issue.status || 'Pending',
          note: 'Initial status from migration',
          at: issue.createdAt || new Date()
        }];
        needsUpdate = true;
      }

      // Update the issue if needed
      if (needsUpdate) {
        await Issue.updateOne(
          { _id: issue._id },
          { $set: updates }
        );
        updatedCount++;
        console.log(`   ✅ Updated successfully`);
      } else {
        console.log(`   ⏭️ No update needed`);
      }
    }

    console.log(`\n🎉 Migration completed!`);
    console.log(`   📊 Total issues: ${issues.length}`);
    console.log(`   ✨ Updated issues: ${updatedCount}`);
    console.log(`   ⏭️ Skipped issues: ${issues.length - updatedCount}`);

    // Show final status distribution
    console.log('\n📈 Final status distribution:');
    const finalStats = await Issue.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    
    finalStats.forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count} issues`);
    });

  } catch (error) {
    console.error('❌ Migration failed:', error);
    console.error('Error details:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from database');
    process.exit(0);
  }
}

// Check connection and run migration
mongoose.connection.on('connected', () => {
  console.log('✅ Connected to MongoDB');
  migrateTimelineStatuses();
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

console.log('⏳ Connecting to MongoDB...');