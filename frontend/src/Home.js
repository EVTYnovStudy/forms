import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
/////////////////////////////
///// Home page du Form /////
/////////////////////////////
const Home = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/surveys');
        setSurveys(response.data);
      } catch (err) {
        setError('Erreur lors de la récupération des sondages');
      } finally {
        setLoading(false);
      }
    };
    fetchSurveys();
  }, []);

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-lg border-0 rounded">
            <div className="card-body text-center">
              <h2 className="card-title text-primary mb-4">Bienvenue sur le Créateur de Sondages</h2>
              <p className="text-muted mb-4">Créez, gérez et partagez vos sondages facilement.</p>

              <Link to="/create" className="btn btn-primary w-100 mb-3">
                ➕ Créer un Sondage
              </Link>

              <h4 className="text-secondary mb-3">📋 Sondages enregistrés</h4>

              {loading ? (
                <p className="text-muted">Chargement des sondages...</p>
              ) : error ? (
                <p className="text-danger">{error}</p>
              ) : surveys.length === 0 ? (
                <p className="text-muted">Aucun sondage enregistré.</p>
              ) : (
                <div className="list-group">
                  {surveys.map(survey => (
                    <button
                    key={survey._id}
                    className="list-group-item list-group-item-action"
                    onClick={() => navigate(`/survey/${survey._id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <strong>{survey.name}</strong>
                  </button>
                  
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
