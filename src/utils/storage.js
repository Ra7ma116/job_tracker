export const saveJobsToLocalStorage = (jobs) => {
    localStorage.setItem('jobApplications', JSON.stringify(jobs));
};

export const loadJobsFromLocalStorage = () => {
    const storedJobs = localStorage.getItem('jobApplications');
    return storedJobs ? JSON.parse(storedJobs) : [];
};

export const exportJobsToFile = (jobs) => {
    const dataStr = JSON.stringify(jobs, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', 'job-applications.json');
    linkElement.click();
  };