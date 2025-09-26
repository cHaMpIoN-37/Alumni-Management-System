import React, { useState } from 'react';
import './Jobs.css';

const initialJobs = [
  {
    id: 1,
    title: 'Software Engineer Intern',
    company: 'TechCorp',
    description: 'Looking for computer science students for summer internship.',
    requirements: 'React, Node.js experience preferred',
    postedBy: 'sarah@example.com',
    postedDate: '2025-01-15',
    applications: []
  }
];

export default function Jobs({ user, userRole }) {
  const [jobs, setJobs] = useState(initialJobs);
  const [newJob, setNewJob] = useState({
    title: '', company: '', description: '', requirements: ''
  });
  const [showJobForm, setShowJobForm] = useState(false);

  const canPostJobs = userRole === 'alumni' || userRole === 'admin';
  const canApply = userRole === 'student';

  const handlePostJob = () => {
    if (!newJob.title || !newJob.company || !newJob.description) {
      alert('Please fill in all required fields');
      return;
    }

    const job = {
      ...newJob,
      id: Date.now(),
      postedBy: user.email,
      postedDate: new Date().toISOString().split('T')[0],
      applications: []
    };

    setJobs([job, ...jobs]);
    setNewJob({ title: '', company: '', description: '', requirements: '' });
    setShowJobForm(false);
  };

  const handleApply = (jobId) => {
    setJobs(jobs.map(job => {
      if (job.id === jobId) {
        return {
          ...job,
          applications: [...job.applications, {
            studentEmail: user.email,
            studentName: user.name,
            appliedDate: new Date().toISOString()
          }]
        };
      }
      return job;
    }));
    alert('Application submitted successfully!');
  };

  const hasApplied = (job) => {
    return job.applications.some(app => app.studentEmail === user.email);
  };

  return (
    <div className="jobs-container slide-up">
      <div className="jobs-header">
        <h2>{canPostJobs ? 'Job Postings Management' : 'Job Opportunities'}</h2>
        {canPostJobs && (
          <button 
            className="btn btn-primary"
            onClick={() => setShowJobForm(!showJobForm)}
          >
            Post New Job
          </button>
        )}
      </div>

      {showJobForm && (
        <div className="job-form scale-in">
          <h3>Post New Job/Internship</h3>
          <div className="form-grid">
            <input
              placeholder="Job Title"
              value={newJob.title}
              onChange={e => setNewJob({...newJob, title: e.target.value})}
            />
            <input
              placeholder="Company Name"
              value={newJob.company}
              onChange={e => setNewJob({...newJob, company: e.target.value})}
            />
            <textarea
              placeholder="Job Description"
              value={newJob.description}
              onChange={e => setNewJob({...newJob, description: e.target.value})}
              rows={4}
            />
            <textarea
              placeholder="Requirements (optional)"
              value={newJob.requirements}
              onChange={e => setNewJob({...newJob, requirements: e.target.value})}
              rows={2}
            />
          </div>
          <div className="form-actions">
            <button onClick={handlePostJob} className="btn btn-primary">Post Job</button>
            <button onClick={() => setShowJobForm(false)} className="btn btn-secondary">Cancel</button>
          </div>
        </div>
      )}

      <div className="jobs-list">
        {jobs.map((job, index) => (
          <div key={job.id} className="job-card" style={{animationDelay: `${index * 0.1}s`}}>
            <div className="job-header">
              <h3>{job.title}</h3>
              <span className="job-company">{job.company}</span>
            </div>
            <p className="job-description">{job.description}</p>
            {job.requirements && (
              <p className="job-requirements"><strong>Requirements:</strong> {job.requirements}</p>
            )}
            <div className="job-meta">
              <span>Posted by: {job.postedBy}</span>
              <span>Date: {new Date(job.postedDate).toLocaleDateString()}</span>
              {userRole === 'admin' && (
                <span>Applications: {job.applications.length}</span>
              )}
            </div>
            <div className="job-actions">
              {canApply && (
                <button
                  className={`btn ${hasApplied(job) ? 'btn-success' : 'btn-primary'}`}
                  onClick={() => handleApply(job.id)}
                  disabled={hasApplied(job)}
                >
                  {hasApplied(job) ? 'Applied ✓' : 'Apply Now'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
