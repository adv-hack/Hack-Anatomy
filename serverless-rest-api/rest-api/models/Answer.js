const mongoose = require('mongoose');
const Question = require('./Question');
var AnswerSchema = new mongoose.Schema({  
  questionid: {type: mongoose.Schema.ObjectId,ref:'Question'},
  answer: [String]
});
module.exports = mongoose.model('Answer', AnswerSchema);