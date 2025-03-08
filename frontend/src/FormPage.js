import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function FormPage() {
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState({});
  const { id } = useParams();
  useEffect(() => {
    axios.get(`http://localhost:5000/api/surveys/${id}`).then((res) => setForm(res.data));
  }, [id]);

  const handleResponseChange = (questionIndex, value) => {
    setResponses((prevResponses) => ({
      ...prevResponses,
      [questionIndex]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/api/surveys/${id}/responses`, {
        responses,
      });
      alert("Réponses enregistrées avec succès !");
    } catch (err) {
      console.error("Erreur lors de l'enregistrement des réponses", err);
      alert("Une erreur est survenue lors de l'enregistrement.");
    }
  };

  if (!form) return <div>Chargement...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl">{form.name}</h1>
      <form onSubmit={handleSubmit}>
        {form.questions.map((q, index) => (
          <div key={index} className="mt-4">
            <p>{q.questionText}</p>
            {q.type === "text" ? (
              <input
                type="text"
                className="border p-2 w-full"
                value={responses[index] || ""}
                onChange={(e) => handleResponseChange(index, e.target.value)}
              />
            ) : (
              q.answers.map((opt, idx) => (
                <label key={idx} className="block">
                  <input
                    type={q.type === "unique" ? "radio" : "checkbox"}
                    name={`q${index}`}
                    value={opt}
                    checked={responses[index]?.includes(opt)}
                    onChange={(e) => {
                      const newResponses = [...(responses[index] || [])];
                      if (q.type === "unique") {
                        newResponses[0] = e.target.value;
                      } else {
                        if (e.target.checked) {
                          newResponses.push(e.target.value);
                        } else {
                          const idx = newResponses.indexOf(e.target.value);
                          if (idx !== -1) newResponses.splice(idx, 1);
                        }
                      }
                      handleResponseChange(index, newResponses);
                    }}
                  />{" "}
                  {opt}
                </label>
              ))
            )}
          </div>
        ))}
        <button type="submit" className="bg-blue-500 text-white p-2 mt-4">
          Soumettre
        </button>
      </form>
    </div>
  );
}

export default FormPage;
