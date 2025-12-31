import React, { useState, useEffect, useRef } from 'react';
import './Timer.css';

const Timer = ({ onSessionComplete, currentSession, setCurrentSession, todaysTotal, dailyGoal }) => {
    const [isRunning, setIsRunning] = useState(false);
    const [time, setTime] = useState(0);
    const [sessionType, setSessionType] = useState('daydreaming');
    const [notes, setNotes] = useState('');
    const [trigger, setTrigger] = useState('');
    const intervalRef = useRef(null);

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setTime(prevTime => prevTime + 1);
            }, 1000);
        } else {
            clearInterval(intervalRef.current);
        }

        return () => clearInterval(intervalRef.current);
    }, [isRunning]);

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hours > 0) {
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const startTimer = () => {
        setIsRunning(true);
        setCurrentSession({
            startTime: new Date(),
            type: sessionType,
            trigger: trigger
        });
    };

    const pauseTimer = () => {
        setIsRunning(false);
    };

    const stopTimer = () => {
        if (time > 0) {
            const session = {
                duration: time,
                type: sessionType,
                notes: notes,
                trigger: trigger,
                startTime: currentSession?.startTime || new Date(),
                endTime: new Date()
            };

            onSessionComplete(session);

            // Reset timer
            setTime(0);
            setIsRunning(false);
            setNotes('');
            setTrigger('');
            setCurrentSession(null);
        }
    };

    const resetTimer = () => {
        setTime(0);
        setIsRunning(false);
        setCurrentSession(null);
    };

    const getDailyProgress = () => {
        return Math.min((todaysTotal / (dailyGoal * 60)) * 100, 100);
    };

    const getTimeColor = () => {
        if (time < 300) return '#4caf50'; // Green for under 5 minutes
        if (time < 1800) return '#ff9800'; // Orange for 5-30 minutes
        return '#f44336'; // Red for over 30 minutes
    };

    return (
        <div className="timer-container">
            <div className="card timer-card">
                <div className="card-header">
                    <i className="fas fa-stopwatch"></i>
                    <h2>Session Timer</h2>
                </div>

                <div className="timer-display">
                    <div className="time-circle" style={{ borderColor: getTimeColor() }}>
                        <span className="time-text" style={{ color: getTimeColor() }}>
                            {formatTime(time)}
                        </span>
                    </div>
                </div>

                <div className="timer-controls">
                    {!isRunning && time === 0 && (
                        <button className="btn btn-success timer-btn" onClick={startTimer}>
                            <i className="fas fa-play"></i>
                            Start Session
                        </button>
                    )}

                    {isRunning && (
                        <button className="btn btn-secondary timer-btn" onClick={pauseTimer}>
                            <i className="fas fa-pause"></i>
                            Pause
                        </button>
                    )}

                    {!isRunning && time > 0 && (
                        <>
                            <button className="btn btn-success timer-btn" onClick={startTimer}>
                                <i className="fas fa-play"></i>
                                Resume
                            </button>
                            <button className="btn btn-primary timer-btn" onClick={stopTimer}>
                                <i className="fas fa-stop"></i>
                                End Session
                            </button>
                        </>
                    )}

                    {time > 0 && (
                        <button className="btn btn-danger timer-btn" onClick={resetTimer}>
                            <i className="fas fa-redo"></i>
                            Reset
                        </button>
                    )}
                </div>

                <div className="session-details">
                    <div className="form-group">
                        <label htmlFor="sessionType">Session Type</label>
                        <select
                            id="sessionType"
                            value={sessionType}
                            onChange={(e) => setSessionType(e.target.value)}
                            disabled={isRunning}
                        >
                            <option value="daydreaming">Daydreaming</option>
                            <option value="fantasy">Fantasy/Imagination</option>
                            <option value="rumination">Rumination</option>
                            <option value="planning">Mental Planning</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="trigger">Trigger (Optional)</label>
                        <input
                            type="text"
                            id="trigger"
                            value={trigger}
                            onChange={(e) => setTrigger(e.target.value)}
                            placeholder="What triggered this session?"
                            disabled={isRunning}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="notes">Session Notes</label>
                        <textarea
                            id="notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Add notes about this session..."
                            rows="3"
                        />
                    </div>
                </div>
            </div>

            <div className="card daily-progress-card">
                <div className="card-header">
                    <i className="fas fa-calendar-day"></i>
                    <h2>Today's Progress</h2>
                </div>

                <div className="daily-stats">
                    <div className="stat-item">
                        <div className="stat-value">{Math.floor(todaysTotal / 60)}m {todaysTotal % 60}s</div>
                        <div className="stat-label">Time Today</div>
                    </div>

                    <div className="stat-item">
                        <div className="stat-value">{dailyGoal}m</div>
                        <div className="stat-label">Daily Goal</div>
                    </div>
                </div>

                <div className="progress-section">
                    <div className="progress-header">
                        <span>Daily Goal Progress</span>
                        <span>{Math.round(getDailyProgress())}%</span>
                    </div>
                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{ width: `${getDailyProgress()}%` }}
                        ></div>
                    </div>
                    {getDailyProgress() >= 100 && (
                        <div className="goal-exceeded">
                            <i className="fas fa-exclamation-triangle"></i>
                            Daily goal exceeded! Consider taking a break.
                        </div>
                    )}
                </div>
            </div>

            {isRunning && (
                <div className="card session-info-card">
                    <div className="card-header">
                        <i className="fas fa-info-circle"></i>
                        <h2>Current Session</h2>
                    </div>

                    <div className="current-session-info">
                        <div className="session-detail">
                            <strong>Type:</strong> {sessionType}
                        </div>
                        {trigger && (
                            <div className="session-detail">
                                <strong>Trigger:</strong> {trigger}
                            </div>
                        )}
                        <div className="session-detail">
                            <strong>Started:</strong> {currentSession?.startTime?.toLocaleTimeString()}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Timer;