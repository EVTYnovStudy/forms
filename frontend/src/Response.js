import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

/////////////////////////////////
///// Response page du Form /////
/////////////////////////////////
const Response = () => {
  const { id } = useParams();
  const [survey, setSurvey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [responses, setResponses] = useState({});

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/surveys/${id}`);
        setSurvey(response.data);
      } catch (err) {
        setError('Erreur lors du chargement du sondage');
      } finally {
        setLoading(false);
      }
    };
    fetchSurvey();
  }, [id]);

  const handleChange = (questionId, value) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleMultipleChoiceChange = (questionId, option) => {
    setResponses((prev) => {
      const currentAnswers = prev[questionId] || [];
      if (currentAnswers.includes(option)) {
        return {
          ...prev,
          [questionId]: currentAnswers.filter((answer) => answer !== option),
        };
      } else {
        return {
          ...prev,
          [questionId]: [...currentAnswers, option],
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('Réponses envoyées:', responses);

    try {
      await axios.post(`http://localhost:5000/api/surveys/${id}/responses`, { responses });
      alert('Réponses enregistrées avec succès !');
    } catch (err) {
      alert('Erreur lors de l’enregistrement des réponses.');
    }
  };  

  if (loading) return <p>Chargement du sondage...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container py-5">
      <h2 className="text-primary">{survey.name}</h2>
      <p className="text-muted">{survey.description}</p>

      <form onSubmit={handleSubmit}>
        {survey.questions && survey.questions.length > 0 ? (
          survey.questions.map((question) => (
            <div key={question._id} className="mb-3">
              <label className="form-label">{question.questionText}</label>

              {question.type === 'text' ? (
                <input
                  type="text"
                  className="form-control"
                  value={responses[question._id] || ''}
                  onChange={(e) => handleChange(question._id, e.target.value)}
                />
              ) : question.type === 'unique' ? (
                question.answers.map((option, index) => (
                  <div key={index} className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name={`question-${question._id}`}
                      value={option}
                      checked={responses[question._id] === option}
                      onChange={() => handleChange(question._id, option)}
                    />
                    <label className="form-check-label">{option}</label>
                  </div>
                ))
              ) : question.type === 'multiple' ? (
                question.answers.map((option, index) => (
                  <div key={index} className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name={`question-${question._id}`}
                      value={option}
                      checked={responses[question._id]?.includes(option)}
                      onChange={() => handleMultipleChoiceChange(question._id, option)}
                    />
                    <label className="form-check-label">{option}</label>
                  </div>
                ))
              ) : (
                <p className="text-muted">Type de question inconnu</p>
              )}
            </div>
          ))
        ) : (
          <p className="text-muted">Aucune question trouvée.</p>
        )}

        <button type="submit" className="btn btn-success w-100 mt-3">
          Envoyer les réponses
        </button>
      </form>
    </div>
  );
};

export default Response;
