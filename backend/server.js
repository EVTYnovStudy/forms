require('dotenv').config();
console.log('MONGO_URI:', process.env.MONGO_URI);
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const surveyRoutes = require('./routes/surveyRoutes');
const app = express();
require('dotenv').config();
app.use(express.json());
app.use(cors());
/////////////////////
///// Connexion /////
/////////////////////
mongoose.connect("VOTRE_CLE_MONGO", {  
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
  .then(() => console.log('✅ Connecté à MongoDB'))
  .catch(err => console.error('❌ Erreur de connexion MongoDB:', err));
/////////////////////
/////    API    /////
/////////////////////
app.use('/api/surveys', surveyRoutes);
/////////////////////
/////   START   /////
/////////////////////
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});