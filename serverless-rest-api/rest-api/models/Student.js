const mongoose = require('mongoose');

var StudentSchema = new mongoose.Schema({  
  learnerID:String,
  totNo: {type: Number, default: 0},
  Tmarks:[Number],
  easyNo:{type: Number, default: 0},
  Emarks:[Number],
  mediumNo:{type: Number, default: 0},
  Mmarks:[Number],
  hardNo:{type: Number, default: 0},
  Hmarks:[Number]
});
module.exports = mongoose.model('Student', StudentSchema);