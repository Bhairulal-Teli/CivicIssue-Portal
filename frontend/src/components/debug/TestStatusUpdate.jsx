import React, { useState } from 'react';

const TestStatusUpdate = () => {
  const [issueId, setIssueId] = useState('');
  const [status, setStatus] = useState('In Progress');
  const [result, setResult] = useState('');

  const testPatchEndpoint = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/issues/test-patch', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ test: 'data' })
      });
      
      const data = await response.text();
      setResult(`PATCH Test: ${response.status} - ${data}`);
    } catch (error) {
      setResult(`PATCH Test Error: ${error.message}`);
    }
  };

  const testStatusUpdate = async () => {
    if (!issueId) {
      setResult('Please enter an issue ID');
      return;
    }

    try {
      console.log('Testing status update:', { issueId, status });
      
      const response = await fetch(`http://localhost:5000/api/issues/${issueId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: status,
          note: 'Test update from debug component'
        })
      });
      
      const responseText = await response.text();
      console.log('Raw response:', responseText);
      
      if (response.ok) {
        const data = JSON.parse(responseText);
        setResult(`✅ Success: ${data.message}`);
      } else {
        setResult(`❌ Error ${response.status}: ${responseText}`);
      }
    } catch (error) {
      console.error('Test error:', error);
      setResult(`🔥 Exception: ${error.message}`);
    }
  };

  const testIssueExists = async () => {
    if (!issueId) {
      setResult('Please enter an issue ID');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/issues/${issueId}/test-status`);
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(`Error: ${error.message}`);
    }
  };

  const runMigration = async () => {
    try {
      setResult('🔄 Running timeline migration...');
      
      const response = await fetch('http://localhost:5000/api/issues/migrate-timeline', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setResult(`✅ Migration successful!\nUpdated: ${data.updatedIssues}/${data.totalIssues} issues\nFinal stats: ${JSON.stringify(data.finalStats, null, 2)}`);
      } else {
        setResult(`❌ Migration failed: ${data.message}`);
      }
    } catch (error) {
      setResult(`🔥 Migration error: ${error.message}`);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 m-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Debug Status Update</h3>
      
      <div className="space-y-4">
        {/* Migration Section */}
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-medium text-yellow-800 mb-2">🔧 Database Migration</h4>
          <p className="text-sm text-yellow-700 mb-3">
            Run this ONCE to fix old timeline status values in your database
          </p>
          <button
            onClick={runMigration}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
          >
            🚀 Run Timeline Migration
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Issue ID (get from /api/issues)
          </label>
          <input
            type="text"
            value={issueId}
            onChange={(e) => setIssueId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter issue ID here..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={testPatchEndpoint}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Test PATCH Endpoint
          </button>
          <button
            onClick={testIssueExists}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Test Issue Exists
          </button>
          <button
            onClick={testStatusUpdate}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Test Status Update
          </button>
        </div>

        {result && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <pre className="text-sm whitespace-pre-wrap">{result}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestStatusUpdate;