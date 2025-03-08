//////////////////////////
///// Structure form /////
//////////////////////////
const mongoose = require('mongoose');
const surveySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  questions: [
    {
      questionText: { type: String, required: true },
      type: { type: String, enum: ['text', 'unique', 'multiple'], required: true },
      answers: { type: [String], default: [] },
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});
const Survey = mongoose.model('Survey', surveySchema);
module.exports = Survey;