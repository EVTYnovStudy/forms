import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateSurvey = () => {
  const [surveyName, setSurveyName] = useState('');
  const [questions, setQuestions] = useState([{ questionText: '', type: 'text', answers: [''] }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleNameChange = (e) => {
    setSurveyName(e.target.value);
  };

  const handleQuestionChange = (index, e) => {
    const newQuestions = [...questions];
    newQuestions[index][e.target.name] = e.target.value;
    setQuestions(newQuestions);
  };

  const handleAnswerChange = (questionIndex, answerIndex, e) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].answers[answerIndex] = e.target.value;
    setQuestions(newQuestions);
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, { questionText: '', type: 'text', answers: [''] }]);
  };

  const handleAddAnswer = (questionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].answers.push('');
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const surveyData = {
      name: surveyName,
      questions: questions.map((question) => ({
        questionText: question.questionText,
        type: question.type,
        answers: question.type === 'text' ? [] : question.answers,
      })),
    };

    console.log("Survey Data to be sent:", surveyData);
    try {
      const response = await axios.post('http://localhost:5000/api/surveys', surveyData);
      if (response.status === 201) {
        alert('Sondage enregistré avec succès!');
      } else {
        setError('Erreur lors de l\'enregistrement du sondage');
      }
      setSurveyName('');
      setQuestions([{ questionText: '', type: 'text', answers: [''] }]);
    } catch (err) {
      setError('Erreur lors de l\'enregistrement du sondage');
      console.error("Error while saving survey:", err);
    } finally {
      setLoading(false);
      navigate('/');
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-lg border-0 rounded">
            <div className="card-body">
              <h2 className="card-title text-primary mb-4">Créer un Sondage</h2>
              {error && <p className="text-danger">{error}</p>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="surveyName" className="form-label">Nom du Sondage</label>
                  <input
                    type="text"
                    className="form-control"
                    id="surveyName"
                    value={surveyName}
                    onChange={handleNameChange}
                    required
                    placeholder="Ex: Sondage sur la satisfaction"
                  />
                </div>

                <h4 className="text-secondary mb-3">Questions</h4>
                {questions.map((question, index) => (
                  <div key={index} className="mb-4">
                    <div className="mb-3">
                      <label className="form-label">Question {index + 1}</label>
                      <input
                        type="text"
                        className="form-control"
                        name="questionText"
                        value={question.questionText}
                        onChange={(e) => handleQuestionChange(index, e)}
                        placeholder="Entrez votre question"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Type de Réponse</label>
                      <select
                        className="form-select"
                        name="type"
                        value={question.type}
                        onChange={(e) => handleQuestionChange(index, e)}
                      >
                        <option value="text">Texte</option>
                        <option value="unique">Choix unique</option>
                        <option value="multiple">Choix multiple</option>
                      </select>
                    </div>

                    {question.type !== 'text' && (
                      <div>
                        <h5 className="mb-2">Réponses</h5>
                        {question.answers.map((answer, answerIndex) => (
                          <div key={answerIndex} className="d-flex mb-2">
                            <input
                              type="text"
                              className="form-control"
                              value={answer}
                              onChange={(e) => handleAnswerChange(index, answerIndex, e)}
                              placeholder={`Réponse ${answerIndex + 1}`}
                            />
                          </div>
                        ))}
                        <button
                          type="button"
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => handleAddAnswer(index)}
                        >
                          Ajouter une réponse
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  className="btn btn-outline-primary w-100 mb-3"
                  onClick={handleAddQuestion}
                >
                  Ajouter une question
                </button>

                <button
                  type="submit"
                  className="btn btn-success w-100 mt-3"
                  disabled={loading}
                >
                  {loading ? 'Enregistrement...' : 'Enregistrer le sondage'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateSurvey;
