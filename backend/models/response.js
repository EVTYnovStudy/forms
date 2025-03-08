/////////////////////////////
///// Structure Reponse /////
/////////////////////////////
const mongoose = require('mongoose');
const responseSchema = new mongoose.Schema({
  surveyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Survey',
    required: true,
  },
  responses: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const Response = mongoose.model('Response', responseSchema);
module.exports = Response;
