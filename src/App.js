import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { JobProvider } from './context/JobContext';
import Dashboard from './components/Dashboard';
import AddJob from './components/AddJob';
import JobDetails from './components/JobDetails';
import Navbar from './components/Navbar';
import Notification from './components/Notification';
import './App.css';

function App() {
  return (
    <JobProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <Notification />
          <div className="content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/add" element={<AddJob />} />
              <Route path="/job/:id" element={<JobDetails />} />
            </Routes>
          </div>
        </div>
      </Router>
    </JobProvider>
  );
}

export default App;