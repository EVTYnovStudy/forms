const express = require('express');
const Survey = require('../models/surveys');
const router = express.Router();
const Response = require('../models/response');


/////////////////////////
///// Route Sondage /////
/////////////////////////
router.post('/', async (req, res) => {
    try {
      const { name, questions } = req.body;
  
      if (!name || !Array.isArray(questions) || questions.length === 0) {
        return res.status(400).json({ error: "Le nom du sondage et les questions sont obligatoires." });
      }
  
      const newSurvey = new Survey({ name, questions });
  
      await newSurvey.save();
  
      res.status(201).json(newSurvey);
    } catch (error) {
      console.error("Error creating survey:", error);
      res.status(500).json({ error: 'Erreur serveur lors de l\'enregistrement du sondage' });
    }
});

/////////////////////////
///// Route Get All /////
/////////////////////////
router.get('/', async (req, res) => {
    try {
      const surveys = await Survey.find();
      res.status(200).json(surveys);
    } catch (err) {
      res.status(400).json({ message: 'Erreur lors de la récupération des sondages', error: err.message });
    }
  });

////////////////////////
///// Route Get/Id /////
////////////////////////
router.get('/:id', async (req, res) => {
      try {
        const survey = await Survey.findById(req.params.id);
        if (!survey) {
          return res.status(404).json({ message: 'Sondage non trouvé' });
        }
        res.json(survey);
      } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
      }
});

/////////////////////////
///// Route Reponse /////
/////////////////////////
router.post('/:id/responses', async (req, res) => {
    const { id } = req.params;
    const { responses } = req.body;
  
    console.log('Survey ID:', id);
    console.log('Responses:', responses);
  
    try {
      const survey = await Survey.findById(id);
      if (!survey) {
        return res.status(404).json({ message: 'Sondage non trouvé' });
      }
  
      const newResponse = new Response({
        surveyId: id,
        responses: responses,
      });
  
      await newResponse.save();
      res.status(201).json({ message: 'Réponses enregistrées avec succès' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erreur lors de l\'enregistrement des réponses' });
    }
  });  
module.exports = router;
