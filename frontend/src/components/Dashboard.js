import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { examService } from '../services/api';

const Dashboard = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, logout } = useAuth();

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const response = await examService.getAllExams();
      setExams(response.data);
    } catch (error) {
      setError('Failed to fetch exams');
      console.error('Error fetching exams:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return <div className="loading">Loading exams...</div>;
  }

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-content">
          <div className="navbar-brand">Online Exam System</div>
          <ul className="navbar-nav">
            <li>Welcome, {user?.username} ({user?.role})</li>
            {user?.role === 'ADMIN' || user?.role === 'FACULTY' ? (
              <li><Link to="/admin">Admin Panel</Link></li>
            ) : null}
            <li><Link to="/results">Results</Link></li>
            <li><button onClick={handleLogout} className="btn btn-secondary">Logout</button></li>
          </ul>
        </div>
      </nav>

      <div className="container">
        <h1>Available Exams</h1>
        {error && <div className="error">{error}</div>}
        
        {exams.length === 0 ? (
          <div className="card">
            <p>No exams available at the moment.</p>
          </div>
        ) : (
          <div className="exam-grid">
            {exams.map((exam) => (
              <div key={exam.id} className="exam-card">
                <h3>{exam.subject}</h3>
                <p><strong>Faculty:</strong> {exam.faculty}</p>
                <p><strong>Duration:</strong> {exam.duration} minutes</p>
                <p><strong>Date:</strong> {new Date(exam.date).toLocaleDateString()}</p>
                {user?.role === 'STUDENT' && (
                  <Link to={`/exam/${exam.id}`} className="btn btn-primary">
                    Take Exam
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
