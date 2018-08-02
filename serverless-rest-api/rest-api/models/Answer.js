const mongoose = require('mongoose');
const Question = require('./Question');
var AnswerSchema = new mongoose.Schema({  
  question: String,
  answer: [String]
});
module.exports = mongoose.model('Answer', AnswerSchema);