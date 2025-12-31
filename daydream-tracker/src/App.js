import React, { useState, useEffect } from 'react';
import './App.css';
import Timer from './components/Timer';
import SessionHistory from './components/SessionHistory';
import Statistics from './components/Statistics';
import Settings from './components/Settings';

function App() {
    const [sessions, setSessions] = useState([]);
    const [currentSession, setCurrentSession] = useState(null);
    const [activeTab, setActiveTab] = useState('timer');
    const [settings, setSettings] = useState({
        dailyGoal: 60, // minutes
        notifications: true,
        theme: 'default'
    });

    // Load data from localStorage on component mount
    useEffect(() => {
        const savedSessions = localStorage.getItem('daydream-sessions');
        const savedSettings = localStorage.getItem('daydream-settings');

        if (savedSessions) {
            setSessions(JSON.parse(savedSessions));
        }

        if (savedSettings) {
            setSettings(JSON.parse(savedSettings));
        }
    }, []);

    // Save sessions to localStorage whenever sessions change
    useEffect(() => {
        localStorage.setItem('daydream-sessions', JSON.stringify(sessions));
    }, [sessions]);

    // Save settings to localStorage whenever settings change
    useEffect(() => {
        localStorage.setItem('daydream-settings', JSON.stringify(settings));
    }, [settings]);

    const addSession = (session) => {
        const newSession = {
            ...session,
            id: Date.now(),
            date: new Date().toISOString()
        };
        setSessions(prev => [newSession, ...prev]);
    };

    const deleteSession = (sessionId) => {
        setSessions(prev => prev.filter(session => session.id !== sessionId));
    };

    const updateSettings = (newSettings) => {
        setSettings(prev => ({ ...prev, ...newSettings }));
    };

    const getTodaysSessions = () => {
        const today = new Date().toDateString();
        return sessions.filter(session =>
            new Date(session.date).toDateString() === today
        );
    };

    const getTodaysTotal = () => {
        return getTodaysSessions().reduce((total, session) => total + session.duration, 0);
    };

    return (
        <div className="app">
            <header className="app-header">
                <div className="header-content">
                    <h1>
                        <i className="fas fa-cloud"></i>
                        Daydream Tracker
                    </h1>
                    <p>Monitor and manage your daydreaming time</p>
                </div>
            </header>

            <nav className="app-nav">
                <button
                    className={`nav-btn ${activeTab === 'timer' ? 'active' : ''}`}
                    onClick={() => setActiveTab('timer')}
                >
                    <i className="fas fa-play-circle"></i>
                    Timer
                </button>
                <button
                    className={`nav-btn ${activeTab === 'history' ? 'active' : ''}`}
                    onClick={() => setActiveTab('history')}
                >
                    <i className="fas fa-history"></i>
                    History
                </button>
                <button
                    className={`nav-btn ${activeTab === 'stats' ? 'active' : ''}`}
                    onClick={() => setActiveTab('stats')}
                >
                    <i className="fas fa-chart-bar"></i>
                    Statistics
                </button>
                <button
                    className={`nav-btn ${activeTab === 'settings' ? 'active' : ''}`}
                    onClick={() => setActiveTab('settings')}
                >
                    <i className="fas fa-cog"></i>
                    Settings
                </button>
            </nav>

            <main className="app-main">
                {activeTab === 'timer' && (
                    <Timer
                        onSessionComplete={addSession}
                        currentSession={currentSession}
                        setCurrentSession={setCurrentSession}
                        todaysTotal={getTodaysTotal()}
                        dailyGoal={settings.dailyGoal}
                    />
                )}

                {activeTab === 'history' && (
                    <SessionHistory
                        sessions={sessions}
                        onDeleteSession={deleteSession}
                    />
                )}

                {activeTab === 'stats' && (
                    <Statistics
                        sessions={sessions}
                        settings={settings}
                    />
                )}

                {activeTab === 'settings' && (
                    <Settings
                        settings={settings}
                        onUpdateSettings={updateSettings}
                    />
                )}
            </main>
        </div>
    );
}

export default App;