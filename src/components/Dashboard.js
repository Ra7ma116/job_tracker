import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { JobContext } from '../context/JobContext';
import JobCard from './JobCard';
import Notification from './Notification';
import '../App.css';

const Dashboard = () => {
    const { jobs, loading, exportJobs, importJobs, clearAllJobs } = useContext(JobContext);
    const [statusFilter, setStatusFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedJobs, setSelectedJobs] = useState([]);
    const navigate = useNavigate();

    const handleImport = (e) => {
        const file = e.target.files[0];
        if (file) importJobs(file);
    };

    const filteredJobs = jobs.filter(job => {
        const matchesStatus = statusFilter === 'All' || job.status === statusFilter;
        const matchesSearch = searchTerm === '' ||
            (job.company && job.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (job.title && job.title.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesStatus && matchesSearch;
    });

    const jobStats = {
        total: jobs.length,
        applied: jobs.filter(j => j.status === 'Applied').length,
        interviewing: jobs.filter(j => j.status === 'Interviewing').length,
        offer: jobs.filter(j => j.status === 'Offer').length,
        rejected: jobs.filter(j => j.status === 'Rejected').length
    };

    const toggleSelectJob = (id) => {
        setSelectedJobs(prev =>
            prev.includes(id)
                ? prev.filter(jobId => jobId !== id)
                : [...prev, id]
        );
    };

    const exportSelected = () => {
        if (selectedJobs.length === 0) return;
        exportJobs(jobs.filter(job => selectedJobs.includes(job.id)));
        setSelectedJobs([]);
    };

    if (loading) return (
        <div className="dashboard">
            <div className="skeleton" style={{ height: '2rem', width: '200px', marginBottom: '2rem' }}></div>
            <div className="stats-container">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="stat-card skeleton" style={{ height: '100px' }}></div>
                ))}
            </div>
            <div className="job-list">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="job-card skeleton" style={{ height: '180px' }}></div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1>Job Applications</h1>
                <div className="dashboard-controls">
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Search by company or title..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="filter-controls">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="filter-select"
                        >
                            <option value="All">All Statuses</option>
                            <option value="Applied">Applied</option>
                            <option value="Interviewing">Interviewing</option>
                            <option value="Offer">Offer</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                        <button
                            onClick={() => navigate('/add')}
                            className="button button-primary"
                        >
                            <span>+</span> Add Job
                        </button>
                    </div>
                </div>
            </div>

            <div className="stats-container">
                <div className="stat-card">
                    <h3>Total</h3>
                    <p>{jobStats.total}</p>
                </div>
                <div className="stat-card" style={{ borderLeft: '4px solid var(--primary)' }}>
                    <h3>Applied</h3>
                    <p>{jobStats.applied}</p>
                </div>
                <div className="stat-card" style={{ borderLeft: '4px solid var(--warning)' }}>
                    <h3>Interviewing</h3>
                    <p>{jobStats.interviewing}</p>
                </div>
                <div className="stat-card" style={{ borderLeft: '4px solid var(--success)' }}>
                    <h3>Offer</h3>
                    <p>{jobStats.offer}</p>
                </div>
                <div className="stat-card" style={{ borderLeft: '4px solid var(--danger)' }}>
                    <h3>Rejected</h3>
                    <p>{jobStats.rejected}</p>
                </div>
            </div>

            <div className="import-export">
                <button 
                    onClick={exportJobs}
                    className="button button-secondary "
                >
                    Export All
                </button>
                <button
                    onClick={exportSelected}
                    className="button button-secondary"
                    disabled={selectedJobs.length === 0}
                >
                    Export Selected ({selectedJobs.length})
                </button>
                <label className="button button-secondary">
                    Import Jobs
                    <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
                </label>
                <button
                    onClick={clearAllJobs}
                    className="button button-danger"
                >
                    Clear All
                </button>
            </div>

            <div className="job-list">
                {filteredJobs.length > 0 ? (
                    filteredJobs.map(job => (
                        <JobCard
                            key={job.id}
                            job={job}
                            selected={selectedJobs.includes(job.id)}
                            onSelect={() => toggleSelectJob(job.id)}
                        />
                    ))
                ) : (
                    <div className="no-jobs">
                        {jobs.length === 0 ? (
                            <>
                                <p>You haven't added any job applications yet.</p>
                                <button
                                    onClick={() => navigate('/add')}
                                    className="button button-primary"
                                >
                                    Add Your First Job
                                </button>
                            </>
                        ) : (
                            <p>No jobs match your current filters.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;