import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { examService, questionService } from '../services/api';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('exams');
  const [exams, setExams] = useState([]);
  const [newExam, setNewExam] = useState({
    subject: '',
    faculty: '',
    duration: 60,
    date: new Date().toISOString().split('T')[0]
  });
  const [newQuestion, setNewQuestion] = useState({
    examId: '',
    questionText: '',
    options: ['', '', '', ''],
    correctAnswer: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { user, logout } = useAuth();

  useEffect(() => {
    if (activeTab === 'exams') {
      fetchExams();
    }
  }, [activeTab]);

  const fetchExams = async () => {
    try {
      const response = await examService.getAllExams();
      setExams(response.data);
    } catch (error) {
      setError('Failed to fetch exams');
      console.error('Error fetching exams:', error);
    }
  };

  const handleCreateExam = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await examService.createExam(newExam);
      setSuccess('Exam created successfully!');
      setNewExam({
        subject: '',
        faculty: '',
        duration: 60,
        date: new Date().toISOString().split('T')[0]
      });
      fetchExams();
    } catch (error) {
      setError('Failed to create exam');
      console.error('Error creating exam:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuestion = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const questionData = {
        exam: { id: parseInt(newQuestion.examId) },
        questionText: newQuestion.questionText,
        options: newQuestion.options.filter(opt => opt.trim() !== ''),
        correctAnswer: newQuestion.correctAnswer
      };

      await questionService.createQuestion(questionData);
      setSuccess('Question created successfully!');
      setNewQuestion({
        examId: '',
        questionText: '',
        options: ['', '', '', ''],
        correctAnswer: ''
      });
    } catch (error) {
      setError('Failed to create question');
      console.error('Error creating question:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExam = async (examId) => {
    if (!window.confirm('Are you sure you want to delete this exam?')) return;

    try {
      await examService.deleteExam(examId);
      setSuccess('Exam deleted successfully!');
      fetchExams();
    } catch (error) {
      setError('Failed to delete exam');
      console.error('Error deleting exam:', error);
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...newQuestion.options];
    newOptions[index] = value;
    setNewQuestion({ ...newQuestion, options: newOptions });
  };

  if (user?.role !== 'ADMIN' && user?.role !== 'FACULTY') {
    return <div className="error">Access denied. Admin/Faculty privileges required.</div>;
  }

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-content">
          <div className="navbar-brand">Admin Panel</div>
          <ul className="navbar-nav">
            <li>Welcome, {user?.username} ({user?.role})</li>
            <li><button onClick={() => window.location.href = '/'}>Dashboard</button></li>
            <li><button onClick={logout} className="btn btn-secondary">Logout</button></li>
          </ul>
        </div>
      </nav>

      <div className="container">
        <h1>Admin Panel</h1>
        
        <div className="tabs" style={{ marginBottom: '20px' }}>
          <button 
            className={`btn ${activeTab === 'exams' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('exams')}
          >
            Manage Exams
          </button>
          <button 
            className={`btn ${activeTab === 'questions' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('questions')}
          >
            Add Questions
          </button>
        </div>

        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        {activeTab === 'exams' && (
          <div>
            <div className="card">
              <h2>Create New Exam</h2>
              <form onSubmit={handleCreateExam}>
                <div className="form-group">
                  <label>Subject</label>
                  <input
                    type="text"
                    value={newExam.subject}
                    onChange={(e) => setNewExam({ ...newExam, subject: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Faculty</label>
                  <input
                    type="text"
                    value={newExam.faculty}
                    onChange={(e) => setNewExam({ ...newExam, faculty: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Duration (minutes)</label>
                  <input
                    type="number"
                    value={newExam.duration}
                    onChange={(e) => setNewExam({ ...newExam, duration: parseInt(e.target.value) })}
                    min="1"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    value={newExam.date}
                    onChange={(e) => setNewExam({ ...newExam, date: e.target.value })}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Exam'}
                </button>
              </form>
            </div>

            <div className="card">
              <h2>Existing Exams</h2>
              {exams.length === 0 ? (
                <p>No exams created yet.</p>
              ) : (
                <div className="exam-grid">
                  {exams.map((exam) => (
                    <div key={exam.id} className="exam-card">
                      <h3>{exam.subject}</h3>
                      <p><strong>Faculty:</strong> {exam.faculty}</p>
                      <p><strong>Duration:</strong> {exam.duration} minutes</p>
                      <p><strong>Date:</strong> {new Date(exam.date).toLocaleDateString()}</p>
                      <button 
                        onClick={() => handleDeleteExam(exam.id)}
                        className="btn btn-danger"
                      >
                        Delete Exam
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'questions' && (
          <div className="card">
            <h2>Add New Question</h2>
            <form onSubmit={handleCreateQuestion}>
              <div className="form-group">
                <label>Exam</label>
                <select
                  value={newQuestion.examId}
                  onChange={(e) => setNewQuestion({ ...newQuestion, examId: e.target.value })}
                  required
                >
                  <option value="">Select Exam</option>
                  {exams.map((exam) => (
                    <option key={exam.id} value={exam.id}>
                      {exam.subject} - {exam.faculty}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Question Text</label>
                <textarea
                  value={newQuestion.questionText}
                  onChange={(e) => setNewQuestion({ ...newQuestion, questionText: e.target.value })}
                  rows="3"
                  required
                />
              </div>
              <div className="form-group">
                <label>Options</label>
                {newQuestion.options.map((option, index) => (
                  <input
                    key={index}
                    type="text"
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    required={index < 2} // At least 2 options required
                  />
                ))}
              </div>
              <div className="form-group">
                <label>Correct Answer</label>
                <select
                  value={newQuestion.correctAnswer}
                  onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })}
                  required
                >
                  <option value="">Select Correct Answer</option>
                  {newQuestion.options.filter(opt => opt.trim() !== '').map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Creating...' : 'Add Question'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
