import React, { useState } from 'react';
import './SessionHistory.css';

const SessionHistory = ({ sessions, onDeleteSession }) => {
    const [filter, setFilter] = useState('all');
    const [sortBy, setSortBy] = useState('date');
    const [searchTerm, setSearchTerm] = useState('');

    const formatDuration = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hours > 0) {
            return `${hours}h ${minutes}m ${secs}s`;
        }
        return `${minutes}m ${secs}s`;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const getFilteredSessions = () => {
        let filtered = sessions;

        // Filter by type
        if (filter !== 'all') {
            filtered = filtered.filter(session => session.type === filter);
        }

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(session =>
                session.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                session.trigger?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                session.type.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Sort sessions
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'date':
                    return new Date(b.date) - new Date(a.date);
                case 'duration':
                    return b.duration - a.duration;
                case 'type':
                    return a.type.localeCompare(b.type);
                default:
                    return 0;
            }
        });

        return filtered;
    };

    const getSessionsByDate = () => {
        const sessionsByDate = {};
        getFilteredSessions().forEach(session => {
            const date = new Date(session.date).toDateString();
            if (!sessionsByDate[date]) {
                sessionsByDate[date] = [];
            }
            sessionsByDate[date].push(session);
        });
        return sessionsByDate;
    };

    const getDayTotal = (sessions) => {
        return sessions.reduce((total, session) => total + session.duration, 0);
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'daydreaming':
                return 'fas fa-cloud';
            case 'fantasy':
                return 'fas fa-magic';
            case 'rumination':
                return 'fas fa-sync-alt';
            case 'planning':
                return 'fas fa-tasks';
            default:
                return 'fas fa-circle';
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'daydreaming':
                return '#3498db';
            case 'fantasy':
                return '#9b59b6';
            case 'rumination':
                return '#e74c3c';
            case 'planning':
                return '#2ecc71';
            default:
                return '#95a5a6';
        }
    };

    const sessionsByDate = getSessionsByDate();

    return (
        <div className="history-container">
            <div className="card">
                <div className="card-header">
                    <i className="fas fa-history"></i>
                    <h2>Session History</h2>
                </div>

                <div className="history-controls">
                    <div className="control-group">
                        <label htmlFor="search">Search Sessions</label>
                        <input
                            type="text"
                            id="search"
                            placeholder="Search notes, triggers, or type..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="control-group">
                        <label htmlFor="filter">Filter by Type</label>
                        <select
                            id="filter"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <option value="all">All Types</option>
                            <option value="daydreaming">Daydreaming</option>
                            <option value="fantasy">Fantasy</option>
                            <option value="rumination">Rumination</option>
                            <option value="planning">Planning</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div className="control-group">
                        <label htmlFor="sort">Sort by</label>
                        <select
                            id="sort"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="date">Date (Newest First)</option>
                            <option value="duration">Duration (Longest First)</option>
                            <option value="type">Type</option>
                        </select>
                    </div>
                </div>

                {sessions.length === 0 ? (
                    <div className="empty-state">
                        <i className="fas fa-clock"></i>
                        <h3>No Sessions Yet</h3>
                        <p>Start tracking your daydreaming sessions to see them here.</p>
                    </div>
                ) : Object.keys(sessionsByDate).length === 0 ? (
                    <div className="empty-state">
                        <i className="fas fa-search"></i>
                        <h3>No Matching Sessions</h3>
                        <p>Try adjusting your search or filter criteria.</p>
                    </div>
                ) : (
                    <div className="sessions-list">
                        {Object.entries(sessionsByDate).map(([date, daySessions]) => (
                            <div key={date} className="day-group">
                                <div className="day-header">
                                    <h3>{date}</h3>
                                    <div className="day-stats">
                                        <span className="session-count">{daySessions.length} sessions</span>
                                        <span className="day-total">{formatDuration(getDayTotal(daySessions))}</span>
                                    </div>
                                </div>

                                <div className="day-sessions">
                                    {daySessions.map((session) => (
                                        <div key={session.id} className="session-card">
                                            <div className="session-header">
                                                <div className="session-type">
                                                    <i
                                                        className={getTypeIcon(session.type)}
                                                        style={{ color: getTypeColor(session.type) }}
                                                    ></i>
                                                    <span>{session.type}</span>
                                                </div>
                                                <div className="session-duration">
                                                    {formatDuration(session.duration)}
                                                </div>
                                            </div>

                                            <div className="session-time">
                                                {formatDate(session.date)}
                                            </div>

                                            {session.trigger && (
                                                <div className="session-trigger">
                                                    <strong>Trigger:</strong> {session.trigger}
                                                </div>
                                            )}

                                            {session.notes && (
                                                <div className="session-notes">
                                                    <strong>Notes:</strong> {session.notes}
                                                </div>
                                            )}

                                            <div className="session-actions">
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => onDeleteSession(session.id)}
                                                    title="Delete session"
                                                >
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SessionHistory;