import React, { useState } from 'react';
import './Settings.css';

const Settings = ({ settings, onUpdateSettings }) => {
    const [localSettings, setLocalSettings] = useState(settings);
    const [showExportModal, setShowExportModal] = useState(false);
    const [importData, setImportData] = useState('');

    const handleSettingChange = (key, value) => {
        const newSettings = { ...localSettings, [key]: value };
        setLocalSettings(newSettings);
        onUpdateSettings(newSettings);
    };

    const exportData = () => {
        const sessions = JSON.parse(localStorage.getItem('daydream-sessions') || '[]');
        const exportObject = {
            sessions,
            settings: localSettings,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };

        const dataStr = JSON.stringify(exportObject, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `daydream-tracker-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        setShowExportModal(false);
    };

    const importDataFromFile = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);

                if (importedData.sessions && Array.isArray(importedData.sessions)) {
                    localStorage.setItem('daydream-sessions', JSON.stringify(importedData.sessions));
                }

                if (importedData.settings) {
                    setLocalSettings(importedData.settings);
                    onUpdateSettings(importedData.settings);
                }

                alert('Data imported successfully! Please refresh the page to see the changes.');
            } catch (error) {
                alert('Error importing data. Please check the file format.');
            }
        };
        reader.readAsText(file);
    };

    const clearAllData = () => {
        if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
            localStorage.removeItem('daydream-sessions');
            localStorage.removeItem('daydream-settings');
            alert('All data cleared successfully! Please refresh the page.');
        }
    };

    const resetSettings = () => {
        const defaultSettings = {
            dailyGoal: 60,
            notifications: true,
            theme: 'default'
        };
        setLocalSettings(defaultSettings);
        onUpdateSettings(defaultSettings);
    };

    return (
        <div className="settings-container">
            <div className="card">
                <div className="card-header">
                    <i className="fas fa-cog"></i>
                    <h2>Settings</h2>
                </div>

                <div className="settings-sections">
                    {/* General Settings */}
                    <div className="settings-section">
                        <h3><i className="fas fa-sliders-h"></i> General Settings</h3>

                        <div className="setting-item">
                            <div className="setting-info">
                                <label htmlFor="dailyGoal">Daily Goal (minutes)</label>
                                <p className="setting-description">
                                    Set your target maximum daydreaming time per day
                                </p>
                            </div>
                            <div className="setting-control">
                                <input
                                    type="number"
                                    id="dailyGoal"
                                    min="1"
                                    max="1440"
                                    value={localSettings.dailyGoal}
                                    onChange={(e) => handleSettingChange('dailyGoal', parseInt(e.target.value))}
                                />
                                <span className="unit">minutes</span>
                            </div>
                        </div>

                        <div className="setting-item">
                            <div className="setting-info">
                                <label htmlFor="notifications">Enable Notifications</label>
                                <p className="setting-description">
                                    Get reminders and alerts about your daydreaming sessions
                                </p>
                            </div>
                            <div className="setting-control">
                                <label className="toggle-switch">
                                    <input
                                        type="checkbox"
                                        id="notifications"
                                        checked={localSettings.notifications}
                                        onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                                    />
                                    <span className="toggle-slider"></span>
                                </label>
                            </div>
                        </div>

                        <div className="setting-item">
                            <div className="setting-info">
                                <label htmlFor="theme">Theme</label>
                                <p className="setting-description">
                                    Choose your preferred app theme
                                </p>
                            </div>
                            <div className="setting-control">
                                <select
                                    id="theme"
                                    value={localSettings.theme}
                                    onChange={(e) => handleSettingChange('theme', e.target.value)}
                                >
                                    <option value="default">Default</option>
                                    <option value="dark">Dark</option>
                                    <option value="light">Light</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Data Management */}
                    <div className="settings-section">
                        <h3><i className="fas fa-database"></i> Data Management</h3>

                        <div className="data-actions">
                            <div className="action-item">
                                <div className="action-info">
                                    <h4>Export Data</h4>
                                    <p>Download all your sessions and settings as a JSON file</p>
                                </div>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => setShowExportModal(true)}
                                >
                                    <i className="fas fa-download"></i>
                                    Export
                                </button>
                            </div>

                            <div className="action-item">
                                <div className="action-info">
                                    <h4>Import Data</h4>
                                    <p>Upload a previously exported JSON file to restore your data</p>
                                </div>
                                <div className="file-input-wrapper">
                                    <input
                                        type="file"
                                        id="importFile"
                                        accept=".json"
                                        onChange={importDataFromFile}
                                        className="file-input"
                                    />
                                    <label htmlFor="importFile" className="btn btn-secondary">
                                        <i className="fas fa-upload"></i>
                                        Import
                                    </label>
                                </div>
                            </div>

                            <div className="action-item">
                                <div className="action-info">
                                    <h4>Reset Settings</h4>
                                    <p>Reset all settings to their default values</p>
                                </div>
                                <button
                                    className="btn btn-secondary"
                                    onClick={resetSettings}
                                >
                                    <i className="fas fa-undo"></i>
                                    Reset
                                </button>
                            </div>

                            <div className="action-item danger-action">
                                <div className="action-info">
                                    <h4>Clear All Data</h4>
                                    <p>Permanently delete all sessions and settings</p>
                                </div>
                                <button
                                    className="btn btn-danger"
                                    onClick={clearAllData}
                                >
                                    <i className="fas fa-trash"></i>
                                    Clear All
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* About */}
                    <div className="settings-section">
                        <h3><i className="fas fa-info-circle"></i> About</h3>

                        <div className="about-content">
                            <div className="about-item">
                                <h4>Daydream Tracker</h4>
                                <p>A tool to help monitor and manage maladaptive daydreaming patterns.</p>
                            </div>

                            <div className="about-item">
                                <h4>Version</h4>
                                <p>1.0.0</p>
                            </div>

                            <div className="about-item">
                                <h4>Privacy</h4>
                                <p>All data is stored locally on your device. No information is sent to external servers.</p>
                            </div>

                            <div className="about-item">
                                <h4>Tips for Use</h4>
                                <ul>
                                    <li>Set realistic daily goals to track progress</li>
                                    <li>Record triggers to identify patterns</li>
                                    <li>Use notes to reflect on sessions</li>
                                    <li>Review statistics regularly for insights</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Export Modal */}
            {showExportModal && (
                <div className="modal-overlay" onClick={() => setShowExportModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Export Data</h3>
                            <button
                                className="close-btn"
                                onClick={() => setShowExportModal(false)}
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>This will download a JSON file containing all your sessions and settings.</p>
                            <p>You can use this file to backup your data or import it later.</p>

                            <div className="export-info">
                                <div className="info-item">
                                    <strong>Sessions:</strong> {JSON.parse(localStorage.getItem('daydream-sessions') || '[]').length}
                                </div>
                                <div className="info-item">
                                    <strong>File Format:</strong> JSON
                                </div>
                                <div className="info-item">
                                    <strong>Export Date:</strong> {new Date().toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                className="btn btn-secondary"
                                onClick={() => setShowExportModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={exportData}
                            >
                                <i className="fas fa-download"></i>
                                Download
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;