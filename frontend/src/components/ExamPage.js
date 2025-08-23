import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { examService, questionService, resultService } from '../services/api';

const ExamPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.role !== 'STUDENT') {
      navigate('/');
      return;
    }

    fetchExamData();
  }, [id, user, navigate]);

  const fetchExamData = async () => {
    try {
      const [examResponse, questionsResponse] = await Promise.all([
        examService.getExamById(id),
        questionService.getQuestionsByExam(id)
      ]);

      setExam(examResponse.data);
      setQuestions(questionsResponse.data);
      setTimeLeft(examResponse.data.duration * 60); // Convert minutes to seconds
      setLoading(false);
    } catch (error) {
      setError('Failed to load exam data');
      console.error('Error fetching exam data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          handleSubmit(); // Auto-submit when time runs out
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswerChange = (questionId, answer) => {
    setAnswers({
      ...answers,
      [questionId]: answer
    });
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async () => {
    if (submitting) return;

    setSubmitting(true);
    setError('');

    try {
      const submitData = {
        examId: parseInt(id),
        answers: answers
      };

      const response = await resultService.submitAnswers(submitData);
      
      navigate('/results', { 
        state: { 
          result: response.data,
          exam: exam
        } 
      });
    } catch (error) {
      setError('Failed to submit answers');
      console.error('Error submitting answers:', error);
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading exam...</div>;
  }

  if (!exam) {
    return <div className="error">Exam not found</div>;
  }

  return (
    <div className="container">
      <div className="card">
        <h1>{exam.subject} Exam</h1>
        <div className="timer">
          Time Remaining: {formatTime(timeLeft)}
        </div>
        
        {error && <div className="error">{error}</div>}

        <div className="exam-info">
          <p><strong>Faculty:</strong> {exam.faculty}</p>
          <p><strong>Total Questions:</strong> {questions.length}</p>
        </div>

        <div className="questions-container">
          {questions.map((question, index) => (
            <div key={question.id} className="question-container">
              <h3>Question {index + 1}</h3>
              <p>{question.questionText}</p>
              
              <ul className="options-list">
                {question.options.map((option, optIndex) => (
                  <li key={optIndex}>
                    <label>
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={option}
                        checked={answers[question.id] === option}
                        onChange={() => handleAnswerChange(question.id, option)}
                      />
                      {option}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <button 
          onClick={handleSubmit} 
          className="btn btn-success"
          disabled={submitting}
        >
          {submitting ? 'Submitting...' : 'Submit Exam'}
        </button>
      </div>
    </div>
  );
};

export default ExamPage;
