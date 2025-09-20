import React, { useState } from 'react';
import { 
  Bell, 
  Mail, 
  Volume2, 
  Moon, 
  Sun, 
  Shield, 
  User, 
  Database,
  Download,
  FileText,
  Trash2,
  LogOut,
  Key,
  MapPin,
  Clock
} from 'lucide-react';

const Settings = () => {
  // Notification Settings
  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(false);
  const [soundAlerts, setSoundAlerts] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);

  // System Preferences
  const [autoAssign, setAutoAssign] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('en');
  const [timezone, setTimezone] = useState('Asia/Kolkata');
  const [itemsPerPage, setItemsPerPage] = useState('20');
  const [defaultPriority, setDefaultPriority] = useState('Medium');

  // User Profile
  const [userProfile, setUserProfile] = useState({
    fullName: 'Admin User',
    email: 'admin@civic.gov',
    department: 'Administration',
    phone: '+91 98765 43210',
    role: 'Super Admin'
  });

  // Security Settings
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState('30');

  const ToggleSwitch = ({ enabled, onToggle, disabled = false }) => (
    <button
      onClick={onToggle}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? 'bg-blue-600' : 'bg-gray-200'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  const handleProfileUpdate = () => {
    // API call to update profile
    console.log('Profile updated:', userProfile);
    alert('Profile updated successfully!');
  };

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    if (passwordData.newPassword.length < 8) {
      alert('Password must be at least 8 characters long!');
      return;
    }
    // API call to change password
    console.log('Password change requested');
    alert('Password changed successfully!');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleExportData = () => {
    // API call to export data
    console.log('Exporting system data...');
    alert('Data export initiated. You will receive an email when ready.');
  };

  const handleClearCache = () => {
    if (window.confirm('Are you sure you want to clear the system cache? This may temporarily slow down the application.')) {
      // API call to clear cache
      console.log('Cache cleared');
      alert('System cache cleared successfully!');
    }
  };

  const handleLogoutAllSessions = () => {
    if (window.confirm('Are you sure you want to logout from all sessions? You will need to login again.')) {
      // API call to logout all sessions
      console.log('All sessions logged out');
      alert('Successfully logged out from all sessions!');
    }
  };

  return (
    <div className="p-6 fade-in">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Settings</h2>
        <p className="text-gray-600">Configure system preferences, notifications, and security settings</p>
      </div>

      {/* Notification Settings */}
      <div className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center mb-4">
          <Bell className="text-blue-600 mr-3" size={24} />
          <h3 className="text-lg font-semibold text-gray-900">Notification Settings</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <Bell size={20} className="text-gray-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Push Notifications</p>
                  <p className="text-sm text-gray-600">Real-time notifications for new issues</p>
                </div>
              </div>
              <ToggleSwitch 
                enabled={pushNotifications} 
                onToggle={() => setPushNotifications(!pushNotifications)} 
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <Mail size={20} className="text-gray-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Email Alerts</p>
                  <p className="text-sm text-gray-600">Email notifications for high priority issues</p>
                </div>
              </div>
              <ToggleSwitch 
                enabled={emailAlerts} 
                onToggle={() => setEmailAlerts(!emailAlerts)} 
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <Volume2 size={20} className="text-gray-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Sound Alerts</p>
                  <p className="text-sm text-gray-600">Play sound for urgent notifications</p>
                </div>
              </div>
              <ToggleSwitch 
                enabled={soundAlerts} 
                onToggle={() => setSoundAlerts(!soundAlerts)} 
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <Bell size={20} className="text-gray-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Desktop Notifications</p>
                  <p className="text-sm text-gray-600">Browser desktop notifications</p>
                </div>
              </div>
              <ToggleSwitch 
                enabled={notifications} 
                onToggle={() => setNotifications(!notifications)} 
              />
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <h4 className="font-medium text-gray-900 mb-3">Notification Frequency</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                High Priority Issues
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                <option>Immediate</option>
                <option>Every 15 minutes</option>
                <option>Every hour</option>
                <option>Daily summary</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Medium Priority Issues
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                <option>Every hour</option>
                <option>Every 4 hours</option>
                <option>Daily summary</option>
                <option>Weekly summary</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Low Priority Issues
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                <option>Daily summary</option>
                <option>Weekly summary</option>
                <option>Monthly summary</option>
                <option>Disabled</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* System Preferences */}
      <div className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center mb-4">
          <Database className="text-green-600 mr-3" size={24} />
          <h3 className="text-lg font-semibold text-gray-900">System Preferences</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Auto Assignment</p>
                <p className="text-sm text-gray-600">Automatically assign issues based on category</p>
              </div>
              <ToggleSwitch 
                enabled={autoAssign} 
                onToggle={() => setAutoAssign(!autoAssign)} 
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                {darkMode ? <Moon size={20} className="text-gray-600 mr-3" /> : <Sun size={20} className="text-gray-600 mr-3" />}
                <div>
                  <p className="font-medium text-gray-900">Dark Mode</p>
                  <p className="text-sm text-gray-600">Use dark theme for the interface</p>
                </div>
              </div>
              <ToggleSwitch 
                enabled={darkMode} 
                onToggle={() => setDarkMode(!darkMode)} 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin size={16} className="inline mr-1" />
                Timezone
              </label>
              <select 
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                <option value="UTC">UTC</option>
                <option value="America/New_York">America/New_York (EST)</option>
                <option value="Europe/London">Europe/London (GMT)</option>
                <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Priority Level
              </label>
              <select 
                value={defaultPriority}
                onChange={(e) => setDefaultPriority(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Items Per Page
              </label>
              <select 
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="gu">ગુજરાતી (Gujarati)</option>
                <option value="mr">मराठी (Marathi)</option>
                <option value="ta">தமிழ் (Tamil)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* User Profile Settings */}
      <div className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center mb-4">
          <User className="text-purple-600 mr-3" size={24} />
          <h3 className="text-lg font-semibold text-gray-900">User Profile</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={userProfile.fullName}
                onChange={(e) => setUserProfile({...userProfile, fullName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={userProfile.email}
                onChange={(e) => setUserProfile({...userProfile, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={userProfile.phone}
                onChange={(e) => setUserProfile({...userProfile, phone: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              <select 
                value={userProfile.department}
                onChange={(e) => setUserProfile({...userProfile, department: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option>Administration</option>
                <option>IT Department</option>
                <option>Public Services</option>
                <option>Roads Department</option>
                <option>Water Department</option>
                <option>Electrical Department</option>
                <option>Waste Management</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <select 
                value={userProfile.role}
                onChange={(e) => setUserProfile({...userProfile, role: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option>Super Admin</option>
                <option>Admin</option>
                <option>Manager</option>
                <option>Staff</option>
              </select>
            </div>

            <div className="pt-4">
              <button 
                onClick={handleProfileUpdate}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Update Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center mb-4">
          <Shield className="text-red-600 mr-3" size={24} />
          <h3 className="text-lg font-semibold text-gray-900">Security Settings</h3>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <Key size={16} className="mr-2" />
              Change Password
            </h4>
            <div>
              <input
                type="password"
                placeholder="Current Password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
              />
              <input
                type="password"
                placeholder="New Password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
              />
              <button 
                onClick={handlePasswordChange}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Update Password
              </button>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-600">Add an extra layer of security</p>
                </div>
                <ToggleSwitch 
                  enabled={twoFactorAuth} 
                  onToggle={() => setTwoFactorAuth(!twoFactorAuth)} 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock size={16} className="inline mr-1" />
                  Session Timeout (minutes)
                </label>
                <select 
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="120">2 hours</option>
                  <option value="480">8 hours</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 mb-3">Session Management</h4>
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Last Login</span>
                <span className="text-gray-900 font-medium">Today at 9:30 AM</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Active Sessions</span>
                <span className="text-gray-900 font-medium">2 sessions</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Login Location</span>
                <span className="text-gray-900 font-medium">Surat, Gujarat</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Device</span>
                <span className="text-gray-900 font-medium">Chrome on Windows</span>
              </div>
              <div className="pt-2 border-t border-gray-200">
                <button 
                  onClick={handleLogoutAllSessions}
                  className="w-full px-3 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium flex items-center justify-center"
                >
                  <LogOut size={16} className="mr-2" />
                  Logout All Sessions
                </button>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h5 className="font-medium text-yellow-800 mb-2">Security Recommendations</h5>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Use a strong password with at least 8 characters</li>
                <li>• Enable two-factor authentication</li>
                <li>• Regularly update your password</li>
                <li>• Don't share your login credentials</li>
                <li>• Always logout from shared devices</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* System Information & Actions */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center mb-4">
          <Database className="text-indigo-600 mr-3" size={24} />
          <h3 className="text-lg font-semibold text-gray-900">System Information & Actions</h3>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">System Status</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Application Version</span>
                <span className="font-medium text-gray-900">v1.2.0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Last System Update</span>
                <span className="font-medium text-gray-900">March 18, 2024</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Database Status</span>
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  <span className="font-medium text-green-600">Connected</span>
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">API Status</span>
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  <span className="font-medium text-green-600">Active</span>
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Storage Used</span>
                <span className="font-medium text-gray-900">2.4 GB / 10 GB</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Active Users</span>
                <span className="font-medium text-gray-900">23 online</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{width: '24%'}}></div>
              </div>
              <p className="text-sm text-gray-600">System storage usage</p>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-3">System Actions</h4>
            <div className="space-y-3">
              <button 
                onClick={handleExportData}
                className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center"
              >
                <Download size={16} className="mr-2" />
                Export System Data
              </button>
              
              <button 
                onClick={() => alert('Report generation started. You will receive an email when ready.')}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
              >
                <FileText size={16} className="mr-2" />
                Generate System Report
              </button>
              
              <button 
                onClick={() => alert('System backup initiated successfully!')}
                className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center justify-center"
              >
                <Database size={16} className="mr-2" />
                Create System Backup
              </button>
              
              <button 
                onClick={handleClearCache}
                className="w-full px-4 py-3 text-orange-600 border border-orange-600 rounded-lg hover:bg-orange-50 transition-colors font-medium flex items-center justify-center"
              >
                <Trash2 size={16} className="mr-2" />
                Clear System Cache
              </button>
              
              <button 
                onClick={() => window.confirm('Are you sure you want to restart the system? This will temporarily make the system unavailable.') && alert('System restart scheduled for low-traffic hours.')}
                className="w-full px-4 py-3 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium flex items-center justify-center"
              >
                <Database size={16} className="mr-2" />
                Restart System
              </button>
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700">
                <strong>Note:</strong> System actions may take some time to complete. 
                You will receive notifications about the progress.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;