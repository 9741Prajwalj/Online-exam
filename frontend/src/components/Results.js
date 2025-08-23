import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Results = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    // Check if we have result data from exam submission
    if (location.state?.result && location.state?.exam) {
      setResults([{
        ...location.state.result,
        exam: location.state.exam
      }]);
      setLoading(false);
    } else {
      // In a real application, you would fetch results from an API
      // For now, we'll show a message
      setLoading(false);
    }
  }, [location.state]);

  const handleLogout = () => {
    logout();
  };

  const getGrade = (score, totalQuestions) => {
    const percentage = (score / totalQuestions) * 100;
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  };

  if (loading) {
    return <div className="loading">Loading results...</div>;
  }

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-content">
          <div className="navbar-brand">Online Exam System</div>
          <ul className="navbar-nav">
            <li>Welcome, {user?.username} ({user?.role})</li>
            <li><button onClick={() => navigate('/')}>Dashboard</button></li>
            <li><button onClick={handleLogout} className="btn btn-secondary">Logout</button></li>
          </ul>
        </div>
      </nav>

      <div className="container">
        <h1>Exam Results</h1>
        
        {results.length === 0 ? (
          <div className="card">
            <p>No results available yet. Complete an exam to see your results.</p>
          </div>
        ) : (
          <div className="exam-grid">
            {results.map((result) => (
              <div key={result.id} className="exam-card">
                <h3>{result.exam.subject}</h3>
                <p><strong>Score:</strong> {result.score} out of {result.exam.questions?.length || 'N/A'}</p>
                <p><strong>Grade:</strong> {getGrade(result.score, result.exam.questions?.length || 1)}</p>
                <p><strong>Status:</strong> {result.status}</p>
                <p><strong>Date:</strong> {new Date(result.exam.date).toLocaleDateString()}</p>
                <div className={`result-indicator ${result.score >= (result.exam.questions?.length || 1) * 0.6 ? 'success' : 'error'}`}>
                  {result.score >= (result.exam.questions?.length || 1) * 0.6 ? 'Pass' : 'Fail'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .result-indicator {
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: bold;
          margin-top: 10px;
          display: inline-block;
        }
        .result-indicator.success {
          background-color: #d4edda;
          color: #155724;
        }
        .result-indicator.error {
          background-color: #f8d7da;
          color: #721c24;
        }
      `}</style>
    </div>
  );
};

export default Results;
