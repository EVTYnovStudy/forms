import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';  
import axios from 'axios';
import CreateForm from './CreateForm';
import Home from './Home';
import 'bootstrap/dist/css/bootstrap.min.css';
import Response from './Response';


///////////////////////
///// Launch Form /////
///////////////////////
function HomePage() {
  const [forms, setForms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {

    axios.get("http://localhost:5000/api/surveys")
      .then((res) => setForms(res.data))
      .catch((err) => console.error("Erreur lors de la récupération des sondages :", err));
  }, []);

  return (
    <div className="p-6">
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => navigate("/create")}
      >
        Créer un sondage
      </button>
      <h2 className="mt-4 text-xl">Sondages existants :</h2>
      <ul>
        {forms.map((form) => (
          <li key={form._id}>
            <Link to={`/survey/${form._id}`} className="text-blue-600 underline">
              {form.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateForm />} />
        <Route path="/survey/:id" element={<Response />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
