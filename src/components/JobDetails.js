import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { JobContext } from '../context/JobContext';
import '../App.css';

const JobDetails = () => {
    const { id } = useParams();
    const { jobs, updateJob, deleteJob, formatDisplayDate } = useContext(JobContext);
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({});
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const foundJob = jobs.find(j => j.id === parseInt(id));
        if (foundJob) {
            setJob(foundJob);
            setEditForm({ ...foundJob });
        } else {
            navigate('/');
        }
    }, [id, jobs, navigate]);

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateEditForm = () => {
        const newErrors = {};

        if (!editForm.company.trim()) {
            newErrors.company = 'Company name is required';
        }

        if (!editForm.title.trim()) {
            newErrors.title = 'Job title is required';
        }

        if (!editForm.appliedDate) {
            newErrors.appliedDate = 'Application date is required';
        } else {
            const date = new Date(editForm.appliedDate);
            if (isNaN(date.getTime())) {
                newErrors.appliedDate = 'Invalid date';
            } else if (date > new Date()) {
                newErrors.appliedDate = 'Date cannot be in the future';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (validateEditForm()) {
            updateJob(job.id, editForm);
            setIsEditing(false);
        }
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this job application?')) {
            deleteJob(job.id);
            navigate('/');
        }
    };

    if (!job) return <div className="loading">Loading...</div>;

    const statusColors = {
        Applied: '#4a90e2',
        Interviewing: '#f5a623',
        Offer: '#7ed321',
        Rejected: '#d0021b'
    };

    return (
        <div className="job-details">
            <button onClick={() => navigate('/')} className="back-button">
                &larr; Back to Dashboard
            </button>

            {!isEditing ? (
                <div className="job-details-view">
                    <div className="job-header">
                        <h1>{job.company}</h1>
                        <span
                            className="status-badge"
                            style={{ backgroundColor: statusColors[job.status] }}
                        >
                            {job.status}
                        </span>
                    </div>
                    <h2>{job.title}</h2>
                    <p className="applied-date">
                        Applied: {formatDisplayDate(job.appliedDate)}
                    </p>

                    {job.notes && (
                        <div className="notes-section">
                            <h3>Notes</h3>
                            <p className="notes-content">{job.notes}</p>
                        </div>
                    )}

                    <div className="job-actions">
                        <button onClick={() => setIsEditing(true)} className="edit-button button button-secondary">
                            Edit
                        </button>
                        <button onClick={handleDelete} className="delete-button button button-danger">
                            Delete
                        </button>
                    </div>
                </div>
            ) : (
                <div className="job-edit-form">
                    <div className="form-group">
                        <label>Company Name</label>
                        <input
                            type="text"
                            name="company"
                            value={editForm.company}
                            onChange={handleEditChange}
                        />
                        {errors.company && <span className="error-message">{errors.company}</span>}
                    </div>

                    <div className="form-group">
                        <label>Job Title</label>
                        <input
                            type="text"
                            name="title"
                            value={editForm.title}
                            onChange={handleEditChange}
                        />
                        {errors.title && <span className="error-message">{errors.title}</span>}
                    </div>

                    <div className="form-group">
                        <label>Status</label>
                        <select
                            name="status"
                            value={editForm.status}
                            onChange={handleEditChange}
                        >
                            <option value="Applied">Applied</option>
                            <option value="Interviewing">Interviewing</option>
                            <option value="Offer">Offer</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Applied Date</label>
                        <input
                            type="date"
                            name="appliedDate"
                            value={editForm.appliedDate}
                            onChange={handleEditChange}
                        />
                        {errors.appliedDate && <span className="error-message">{errors.appliedDate}</span>}
                    </div>

                    <div className="form-group">
                        <label>Notes</label>
                        <textarea
                            name="notes"
                            value={editForm.notes}
                            onChange={handleEditChange}
                            rows="4"
                        />
                    </div>

                    <div className="form-actions">
                        <button onClick={() => setIsEditing(false)} className="cancel-button">
                            Cancel
                        </button>
                        <button onClick={handleSave} className="save-button">
                            Save Changes
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobDetails;