import React, { useContext } from 'react';
import { JobContext } from '../context/JobContext';
import '../App.css';

const Notification = () => {
    const { notification } = useContext(JobContext);

    if (!notification) return null;

    return (
        <div className={`notification ${notification.type} ${notification ? 'show' : ''}`}>
            {notification.type === 'success' && (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
            )}
            {notification.type === 'error' && (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12" y2="16"></line>
                </svg>
            )}
            {notification.type === 'warning' && (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12" y2="17"></line>
                </svg>
            )}
            {notification.message}
        </div>
    );
};

export default Notification;