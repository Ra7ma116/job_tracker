import React, { createContext, useState, useEffect } from 'react';

export const JobContext = createContext();

// Helper functions
const isValidDate = (dateString) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    return !isNaN(date.getTime());
};

const formatDisplayDate = (dateString) => {
    if (!isValidDate(dateString)) return 'Not specified';
    return new Date(dateString).toLocaleDateString();
};

export const JobProvider = ({ children }) => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState(null);

    // Load jobs from localStorage
    useEffect(() => {
        const storedJobs = localStorage.getItem('jobApplications');
        if (storedJobs) {
            const parsedJobs = JSON.parse(storedJobs);
            const cleanedJobs = parsedJobs.map(job => ({
                ...job,
                appliedDate: isValidDate(job.appliedDate) ? job.appliedDate : new Date().toISOString().split('T')[0],
                deadline: isValidDate(job.deadline) ? job.deadline : null,
                priority: job.priority || 'medium'
            }));
            setJobs(cleanedJobs);
        }
        setLoading(false);
    }, []);

    // Save to localStorage when jobs change
    useEffect(() => {
        if (!loading) {
            localStorage.setItem('jobApplications', JSON.stringify(jobs));
            checkForReminders();
        }
    }, [jobs, loading]);

    // Show notification for 3 seconds
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
    };

    const checkForReminders = () => {
        jobs.forEach(job => {
            if (job.deadline && new Date(job.deadline) < new Date(Date.now() + 86400000)) {
                if (!localStorage.getItem(`reminder-${job.id}`)) {
                    showNotification(`Upcoming deadline for ${job.company} application!`, 'warning');
                    localStorage.setItem(`reminder-${job.id}`, 'true');
                }
            }
        });
    };

    const addJob = (job) => {
        const newJob = {
            company: job.company || '',
            title: job.title || '',
            status: job.status || 'Applied',
            appliedDate: isValidDate(job.appliedDate) ? job.appliedDate : new Date().toISOString().split('T')[0],
            deadline: isValidDate(job.deadline) ? job.deadline : null,
            priority: job.priority || 'medium',
            notes: job.notes || '',
            id: Date.now()
        };
        setJobs(prev => [...prev, newJob]);
        showNotification('Job added successfully!');
    };

    const updateJob = (id, updatedJob) => {
        setJobs(prev =>
            prev.map(job =>
                job.id === id
                    ? {
                        ...job,
                        ...updatedJob,
                        appliedDate: isValidDate(updatedJob.appliedDate) ? updatedJob.appliedDate : job.appliedDate,
                        deadline: isValidDate(updatedJob.deadline) ? updatedJob.deadline : job.deadline
                    }
                    : job
            )
        );
        showNotification('Job updated successfully!');
    };

    const deleteJob = (id) => {
        setJobs(prev => prev.filter(job => job.id !== id));
        showNotification('Job deleted successfully!');
    };

    const clearAllJobs = () => {
        if (window.confirm('Are you sure you want to delete ALL job applications?')) {
            setJobs([]);
            showNotification('All jobs cleared!');
        }
    };

    const exportJobs = (jobsToExport = jobs) => {
        const dataStr = JSON.stringify(jobsToExport, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const link = document.createElement('a');
        link.setAttribute('href', dataUri);
        link.setAttribute('download', 'job-applications.json');
        link.click();
        showNotification('Jobs exported successfully!');
    };

    const importJobs = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedJobs = JSON.parse(e.target.result);
                if (Array.isArray(importedJobs)) {
                    const validatedJobs = importedJobs.map(job => ({
                        ...job,
                        appliedDate: isValidDate(job.appliedDate) ? job.appliedDate : new Date().toISOString().split('T')[0],
                        deadline: isValidDate(job.deadline) ? job.deadline : null,
                        priority: job.priority || 'medium'
                    }));
                    setJobs(validatedJobs);
                    showNotification('Jobs imported successfully!');
                    return true;
                }
            } catch (error) {
                showNotification('Error importing jobs!', 'error');
                console.error('Import error:', error);
            }
            return false;
        };
        reader.readAsText(file);
    };

    return (
        <JobContext.Provider
            value={{
                jobs,
                loading,
                notification,
                addJob,
                updateJob,
                deleteJob,
                clearAllJobs,
                exportJobs,
                importJobs,
                formatDisplayDate,
                showNotification
            }}
        >
            {children}
        </JobContext.Provider>
    );
};