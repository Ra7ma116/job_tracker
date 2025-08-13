import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { JobContext } from '../context/JobContext';
import '../App.css';

const JobCard = ({ job, selected, onSelect }) => {
    const { formatDisplayDate } = useContext(JobContext);
    const navigate = useNavigate();

    const handleCardClick = (e) => {
        // Prevent navigation if clicking on select button
        if (e.target.closest('.select-button')) return;
        navigate(`/job/${job.id}`);
    };

    return (
        <div
            className={`job-card ${selected ? 'selected' : ''}`}
            onClick={handleCardClick}
        >
            <div className={`priority-indicator priority-${job.priority}`}></div>

            <div className="select-button" onClick={(e) => {
                e.stopPropagation();
                onSelect(job.id);
            }}>
                {selected ? '✓' : '○'}
            </div>

            <div className="job-card-header">
                <h3>{job.company}</h3>
                <span
                    className="status-badge"
                    data-status={job.status}
                >
                    {job.status}
                </span>
            </div>

            <p className="job-title">{job.title}</p>

            <div className="job-card-footer">
                <span className="applied-date">
                    Applied: {formatDisplayDate(job.appliedDate)}
                </span>
                {job.notes && <span className="has-notes">Has notes</span>}
            </div>

            {job.deadline && (
                <span className="deadline">
                    Deadline: {formatDisplayDate(job.deadline)}
                    {new Date(job.deadline) < new Date() && (
                        <span className="deadline-passed"> (Passed)</span>
                    )}
                </span>
            )}
        </div>
    );
};

export default JobCard;