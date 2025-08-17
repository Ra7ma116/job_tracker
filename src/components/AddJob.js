import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { JobContext } from '../context/JobContext';
import '../App.css';

const AddJob = () => {
    const { addJob } = useContext(JobContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        company: '',
        title: '',
        status: 'Applied',
        appliedDate: new Date().toISOString().split('T')[0],
        notes: ''
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.company.trim()) {
            newErrors.company = 'Company name is required';
        }

        if (!formData.title.trim()) {
            newErrors.title = 'Job title is required';
        }

        if (!formData.appliedDate) {
            newErrors.appliedDate = 'Application date is required';
        } else {
            const date = new Date(formData.appliedDate);
            if (isNaN(date.getTime())) {
                newErrors.appliedDate = 'Invalid date';
            } else if (date > new Date()) {
                newErrors.appliedDate = 'Date cannot be in the future';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            addJob(formData);
            navigate('/');
        }
    };

    return (
        <div className="form-container">
            <h1>Add New Job Application</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="company">Company Name</label>
                    <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        required
                    />
                    {errors.company && <span className="error-message">{errors.company}</span>}
                    <label htmlFor="deadline">Application Deadline (Optional)</label>
                    <input
                        type="date"
                        id="deadline"
                        name="deadline"
                        value={formData.deadline || ''}
                        onChange={handleChange}
                    />
                    {errors.deadline && <span className="error-message">{errors.deadline}</span>}
                    <label htmlFor="priority">Priority</label>
                    <select
                        id="priority"
                        name="priority"
                        value={formData.priority || 'medium'}
                        onChange={handleChange}
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                    {errors.priority && <span className="error-message">{errors.priority}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="title">Job Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                    {errors.title && <span className="error-message">{errors.title}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="status">Status</label>
                    <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                    >
                        <option value="Applied">Applied</option>
                        <option value="Interviewing">Interviewing</option>
                        <option value="Offer">Offer</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="appliedDate">Applied Date</label>
                    <input
                        type="date"
                        id="appliedDate"
                        name="appliedDate"
                        value={formData.appliedDate}
                        onChange={handleChange}
                        required
                    />
                    {errors.appliedDate && <span className="error-message">{errors.appliedDate}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="notes">Notes</label>
                    <textarea
                        id="notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        rows="4"
                    />
                </div>

                <div className="form-actions">
                    <button type="button" onClick={() => navigate('/')} className="cancel-button button button-danger">
                        Cancel
                    </button>
                    <button type="submit" className="submit-button button button-primary">
                        Save Job
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddJob;
