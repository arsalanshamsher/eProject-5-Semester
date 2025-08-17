import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getToken } from '../../utils/auth';

export default function Settings() {
  const [settings, setSettings] = useState({
    notifications: {
      workoutReminders: true,
      mealReminders: true,
      progressUpdates: true,
      goalAchievements: true
    },
    units: {
      weight: 'kg',
      height: 'cm',
      distance: 'km'
    },
    privacy: {
      profileVisibility: 'public',
      progressSharing: false,
      workoutSharing: false
    },
    theme: 'dark'
  });
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('notifications');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  };

  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const handleSave = async () => {
    try {
      const token = getToken();
      // Save to backend if API exists
      await axios.post('http://localhost:5000/api/settings', settings, {
        headers: { Authorization: `Bearer ${token}` }
      }).catch(() => {
        // If API doesn't exist, just save to localStorage
        console.log('Settings API not available, saving to localStorage');
      });

      // Save to localStorage
      localStorage.setItem('userSettings', JSON.stringify(settings));
      setMessage('Settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error saving settings. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const resetToDefaults = () => {
    const defaultSettings = {
      notifications: {
        workoutReminders: true,
        mealReminders: true,
        progressUpdates: true,
        goalAchievements: true
      },
      units: {
        weight: 'kg',
        height: 'cm',
        distance: 'km'
      },
      privacy: {
        profileVisibility: 'public',
        progressSharing: false,
        workoutSharing: false
      },
      theme: 'dark'
    };
    setSettings(defaultSettings);
    setMessage('Settings reset to defaults!');
    setTimeout(() => setMessage(''), 3000);
  };

  const tabs = [
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'units', label: 'Units', icon: '📏' },
    { id: 'privacy', label: 'Privacy', icon: '🔒' },
    { id: 'theme', label: 'Theme', icon: '🎨' }
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-4xl font-extrabold text-white drop-shadow-md">
          Settings & Preferences
        </h2>
        <div className="flex gap-3">
          <button
            onClick={resetToDefaults}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors"
          >
            Reset to Defaults
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Save Settings
          </button>
        </div>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.includes('Error') ? 'bg-red-500/20 text-red-200' : 'bg-green-500/20 text-green-200'
        }`}>
          {message}
        </div>
      )}

      <div className="bg-white/20 backdrop-blur-md rounded-lg shadow-lg">
        {/* Tab Navigation */}
        <div className="flex border-b border-white/20">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 text-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-white border-b-2 border-blue-500 bg-white/10'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-8">
          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-white mb-4">Notification Preferences</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(settings.notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-4 bg-white/10 rounded-lg">
                    <div>
                      <h4 className="text-white font-medium capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </h4>
                      <p className="text-gray-300 text-sm">
                        Receive notifications for {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => handleSettingChange('notifications', key, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Units Tab */}
          {activeTab === 'units' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-white mb-4">Measurement Units</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(settings.units).map(([key, value]) => (
                  <div key={key} className="p-4 bg-white/10 rounded-lg">
                    <label className="block text-white font-medium mb-2 capitalize">
                      {key} Units
                    </label>
                    <select
                      value={value}
                      onChange={(e) => handleSettingChange('units', key, e.target.value)}
                      className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/10 text-white"
                    >
                      {key === 'weight' && (
                        <>
                          <option value="kg">Kilograms (kg)</option>
                          <option value="lbs">Pounds (lbs)</option>
                        </>
                      )}
                      {key === 'height' && (
                        <>
                          <option value="cm">Centimeters (cm)</option>
                          <option value="ft">Feet & Inches (ft)</option>
                        </>
                      )}
                      {key === 'distance' && (
                        <>
                          <option value="km">Kilometers (km)</option>
                          <option value="mi">Miles (mi)</option>
                        </>
                      )}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Privacy Tab */}
          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-white mb-4">Privacy Settings</h3>
              <div className="space-y-6">
                <div className="p-4 bg-white/10 rounded-lg">
                  <label className="block text-white font-medium mb-2">Profile Visibility</label>
                  <select
                    value={settings.privacy.profileVisibility}
                    onChange={(e) => handleSettingChange('privacy', 'profileVisibility', e.target.value)}
                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/10 text-white"
                  >
                    <option value="public">Public - Anyone can see my profile</option>
                    <option value="friends">Friends Only - Only my friends can see</option>
                    <option value="private">Private - Only I can see my profile</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(settings.privacy).slice(1).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-4 bg-white/10 rounded-lg">
                      <div>
                        <h4 className="text-white font-medium capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </h4>
                        <p className="text-gray-300 text-sm">
                          Allow others to see my {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => handleSettingChange('privacy', key, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Theme Tab */}
          {activeTab === 'theme' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-white mb-4">Theme Preferences</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {['light', 'dark', 'auto'].map((theme) => (
                  <div
                    key={theme}
                    className={`p-6 rounded-lg cursor-pointer transition-all ${
                      settings.theme === theme
                        ? 'bg-blue-600/20 border-2 border-blue-500'
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                    onClick={() => handleSettingChange('theme', theme)}
                  >
                    <div className="text-center">
                      <div className={`w-16 h-16 mx-auto mb-3 rounded-lg ${
                        theme === 'light' ? 'bg-yellow-400' : 
                        theme === 'dark' ? 'bg-gray-800' : 'bg-gradient-to-r from-yellow-400 to-gray-800'
                      }`}></div>
                      <h4 className="text-white font-medium capitalize">{theme}</h4>
                      <p className="text-gray-300 text-sm">
                        {theme === 'light' ? 'Light theme for bright environments' :
                         theme === 'dark' ? 'Dark theme for low-light environments' :
                         'Automatically switch based on system preference'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
