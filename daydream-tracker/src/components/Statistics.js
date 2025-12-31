import React, { useState, useMemo } from 'react';
import './Statistics.css';

const Statistics = ({ sessions, settings }) => {
    const [timeRange, setTimeRange] = useState('week');

    const formatDuration = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);

        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        return `${minutes}m`;
    };

    const getDateRange = () => {
        const now = new Date();
        const ranges = {
            week: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
            month: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
            year: new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000),
            all: new Date(0)
        };
        return ranges[timeRange];
    };

    const filteredSessions = useMemo(() => {
        const startDate = getDateRange();
        return sessions.filter(session => new Date(session.date) >= startDate);
    }, [sessions, timeRange]);

    const statistics = useMemo(() => {
        const totalSessions = filteredSessions.length;
        const totalTime = filteredSessions.reduce((sum, session) => sum + session.duration, 0);
        const averageSession = totalSessions > 0 ? totalTime / totalSessions : 0;

        // Sessions by type
        const sessionsByType = filteredSessions.reduce((acc, session) => {
            acc[session.type] = (acc[session.type] || 0) + 1;
            return acc;
        }, {});

        // Time by type
        const timeByType = filteredSessions.reduce((acc, session) => {
            acc[session.type] = (acc[session.type] || 0) + session.duration;
            return acc;
        }, {});

        // Daily averages
        const days = Math.max(1, Math.ceil((new Date() - getDateRange()) / (1000 * 60 * 60 * 24)));
        const averageSessionsPerDay = totalSessions / days;
        const averageTimePerDay = totalTime / days;

        // Longest session
        const longestSession = filteredSessions.reduce((max, session) =>
            session.duration > max ? session.duration : max, 0);

        // Most common triggers
        const triggers = filteredSessions
            .filter(session => session.trigger && session.trigger.trim())
            .reduce((acc, session) => {
                const trigger = session.trigger.toLowerCase().trim();
                acc[trigger] = (acc[trigger] || 0) + 1;
                return acc;
            }, {});

        const topTriggers = Object.entries(triggers)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5);

        // Time patterns (by hour)
        const hourlyData = Array(24).fill(0);
        filteredSessions.forEach(session => {
            const hour = new Date(session.date).getHours();
            hourlyData[hour] += session.duration;
        });

        return {
            totalSessions,
            totalTime,
            averageSession,
            sessionsByType,
            timeByType,
            averageSessionsPerDay,
            averageTimePerDay,
            longestSession,
            topTriggers,
            hourlyData
        };
    }, [filteredSessions]);

    const getTypeColor = (type) => {
        const colors = {
            daydreaming: '#3498db',
            fantasy: '#9b59b6',
            rumination: '#e74c3c',
            planning: '#2ecc71',
            other: '#95a5a6'
        };
        return colors[type] || '#95a5a6';
    };

    const getTypeIcon = (type) => {
        const icons = {
            daydreaming: 'fas fa-cloud',
            fantasy: 'fas fa-magic',
            rumination: 'fas fa-sync-alt',
            planning: 'fas fa-tasks',
            other: 'fas fa-circle'
        };
        return icons[type] || 'fas fa-circle';
    };

    const getMostActiveHour = () => {
        const maxTime = Math.max(...statistics.hourlyData);
        const hour = statistics.hourlyData.indexOf(maxTime);
        return `${hour.toString().padStart(2, '0')}:00`;
    };

    return (
        <div className="statistics-container">
            <div className="card">
                <div className="card-header">
                    <i className="fas fa-chart-bar"></i>
                    <h2>Statistics & Insights</h2>
                </div>

                <div className="time-range-selector">
                    <label htmlFor="timeRange">Time Range:</label>
                    <select
                        id="timeRange"
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                    >
                        <option value="week">Last 7 Days</option>
                        <option value="month">Last 30 Days</option>
                        <option value="year">Last Year</option>
                        <option value="all">All Time</option>
                    </select>
                </div>

                {filteredSessions.length === 0 ? (
                    <div className="empty-state">
                        <i className="fas fa-chart-line"></i>
                        <h3>No Data Available</h3>
                        <p>No sessions found for the selected time range.</p>
                    </div>
                ) : (
                    <div className="stats-grid">
                        {/* Overview Stats */}
                        <div className="stat-card overview-card">
                            <h3><i className="fas fa-clock"></i> Overview</h3>
                            <div className="stat-items">
                                <div className="stat-item">
                                    <div className="stat-value">{statistics.totalSessions}</div>
                                    <div className="stat-label">Total Sessions</div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-value">{formatDuration(statistics.totalTime)}</div>
                                    <div className="stat-label">Total Time</div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-value">{formatDuration(statistics.averageSession)}</div>
                                    <div className="stat-label">Average Session</div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-value">{formatDuration(statistics.longestSession)}</div>
                                    <div className="stat-label">Longest Session</div>
                                </div>
                            </div>
                        </div>

                        {/* Daily Averages */}
                        <div className="stat-card daily-card">
                            <h3><i className="fas fa-calendar-day"></i> Daily Averages</h3>
                            <div className="stat-items">
                                <div className="stat-item">
                                    <div className="stat-value">{statistics.averageSessionsPerDay.toFixed(1)}</div>
                                    <div className="stat-label">Sessions per Day</div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-value">{formatDuration(statistics.averageTimePerDay)}</div>
                                    <div className="stat-label">Time per Day</div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-value">{getMostActiveHour()}</div>
                                    <div className="stat-label">Most Active Hour</div>
                                </div>
                            </div>
                        </div>

                        {/* Session Types */}
                        <div className="stat-card types-card">
                            <h3><i className="fas fa-pie-chart"></i> Session Types</h3>
                            <div className="type-breakdown">
                                {Object.entries(statistics.sessionsByType).map(([type, count]) => {
                                    const percentage = (count / statistics.totalSessions * 100).toFixed(1);
                                    return (
                                        <div key={type} className="type-item">
                                            <div className="type-header">
                                                <div className="type-info">
                                                    <i
                                                        className={getTypeIcon(type)}
                                                        style={{ color: getTypeColor(type) }}
                                                    ></i>
                                                    <span className="type-name">{type}</span>
                                                </div>
                                                <div className="type-stats">
                                                    <span className="type-count">{count} sessions</span>
                                                    <span className="type-time">{formatDuration(statistics.timeByType[type] || 0)}</span>
                                                </div>
                                            </div>
                                            <div className="type-bar">
                                                <div
                                                    className="type-fill"
                                                    style={{
                                                        width: `${percentage}%`,
                                                        backgroundColor: getTypeColor(type)
                                                    }}
                                                ></div>
                                            </div>
                                            <div className="type-percentage">{percentage}%</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Top Triggers */}
                        {statistics.topTriggers.length > 0 && (
                            <div className="stat-card triggers-card">
                                <h3><i className="fas fa-exclamation-triangle"></i> Common Triggers</h3>
                                <div className="triggers-list">
                                    {statistics.topTriggers.map(([trigger, count], index) => (
                                        <div key={trigger} className="trigger-item">
                                            <div className="trigger-rank">#{index + 1}</div>
                                            <div className="trigger-info">
                                                <div className="trigger-name">{trigger}</div>
                                                <div className="trigger-count">{count} times</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Time Pattern */}
                        <div className="stat-card pattern-card">
                            <h3><i className="fas fa-clock"></i> Time Patterns</h3>
                            <div className="hourly-chart">
                                {statistics.hourlyData.map((time, hour) => {
                                    const maxTime = Math.max(...statistics.hourlyData);
                                    const height = maxTime > 0 ? (time / maxTime) * 100 : 0;
                                    return (
                                        <div key={hour} className="hour-bar">
                                            <div
                                                className="hour-fill"
                                                style={{ height: `${height}%` }}
                                                title={`${hour}:00 - ${formatDuration(time)}`}
                                            ></div>
                                            <div className="hour-label">
                                                {hour % 6 === 0 ? `${hour}h` : ''}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="chart-info">
                                <span>Hours of the day (0-23)</span>
                            </div>
                        </div>

                        {/* Goal Progress */}
                        <div className="stat-card goal-card">
                            <h3><i className="fas fa-target"></i> Goal Analysis</h3>
                            <div className="goal-info">
                                <div className="goal-item">
                                    <div className="goal-label">Daily Goal</div>
                                    <div className="goal-value">{settings.dailyGoal} minutes</div>
                                </div>
                                <div className="goal-item">
                                    <div className="goal-label">Average vs Goal</div>
                                    <div className="goal-comparison">
                                        <div className="comparison-bar">
                                            <div
                                                className="comparison-fill"
                                                style={{
                                                    width: `${Math.min((statistics.averageTimePerDay / 60) / settings.dailyGoal * 100, 100)}%`,
                                                    backgroundColor: (statistics.averageTimePerDay / 60) > settings.dailyGoal ? '#e74c3c' : '#2ecc71'
                                                }}
                                            ></div>
                                        </div>
                                        <span className="comparison-text">
                                            {((statistics.averageTimePerDay / 60) / settings.dailyGoal * 100).toFixed(1)}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Statistics;