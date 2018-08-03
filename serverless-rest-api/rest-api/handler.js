"use strict";
require("dotenv").config({ path: "./variables.env" });
const connectToDatabase = require("./db");
//const Note = require('./models/Note.js');
var Question = require("./models/Question");
var Student = require("./models/Student");
var fetch2 = require("node-fetch");
var Request = require("sync-request");

module.exports.createQue = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  connectToDatabase().then(() => {
    Question.create(JSON.parse(event.body))
      .then(que =>
        callback(null, {
          statusCode: 200,
          body: JSON.stringify(que)
        })
      )
      .catch(err =>
        callback(null, {
          statusCode: err.statusCode || 500,
          headers: { "Content-Type": "text/plain" },
          body: err
        })
      );
  });
};

module.exports.createStudent = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  connectToDatabase().then(() => {
    Student.create(JSON.parse(event.body))
      .then(stu =>
        callback(null, {
          statusCode: 200,
          body: JSON.stringify(stu)
        })
      )
      .catch(err =>
        callback(null, {
          statusCode: err.statusCode || 500,
          headers: { "Content-Type": "text/plain" },
          body: err
        })
      );
  });
};

module.exports.getAllQue = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  connectToDatabase().then(() => {
    let fetchNumber = parseInt(event.pathParameters.total);
    let diff = event.pathParameters.difficulty;
    let learnerId = event.pathParameters.learnerID;

    Student.find({ learnerID: { $eq: learnerId } })
      .then(student => {
        student[0].totNo += 1;
        if (diff.toLowerCase() == "medium") student[0].mediumNo += 1;
        if (diff.toLowerCase() == "hard") student[0].hardNo += 1;
        if (diff.toLowerCase() == "easy") student[0].easyNo += 1;
        Student.findByIdAndUpdate(student[0]._id, student[0], {
          new: true
        }).then(stu => {
          console.log(stu);
          Question.aggregate([
            {
              $match: {
                subject: { $eq: event.pathParameters.subject },
                difficulty: { $eq: diff }
              }
            },
            {
              $sample: { size: fetchNumber }
            },
            {
              $project: {
                question: 1,
                questiontype: 1,
                difficulty: 1,
                options: 1,
                subject: 1,
                answer: ""
              }
            }
          ])
            .then(ques =>
              callback(null, {
                statusCode: 200,
                headers: {
                  "Access-Control-Allow-Origin": "*",
                  "Access-Control-Allow-Credentials": true
                },
                body: JSON.stringify(ques)
              })
            )
            .catch(err =>
              callback(null, {
                statusCode: err.statusCode || 500,
                headers: { "Content-Type": "text/plain" },
                body: err
              })
            );
        });
      })
      .catch(err =>
        callback(null, {
          statusCode: err.statusCode || 500,
          headers: { "Content-Type": "text/plain" },
          body: err
        })
      );
  });
};

module.exports.getQuestions = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  connectToDatabase().then(() => {
    Question.find()
      .then(que =>
        callback(null, {
          statusCode: 200,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true
          },
          body: JSON.stringify(que)
        })
      )
      .catch(err =>
        callback(null, {
          statusCode: err.statusCode || 500,
          headers: { "Content-Type": "text/plain" },
          body: "Could not fetch the ans."
        })
      );
  });
};

module.exports.getStudent = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  connectToDatabase().then(() => {
    Student.find({ learnerID: event.pathParameters.learnerid })
      .then(stu =>
        callback(null, {
          statusCode: 200,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true
          },
          body: JSON.stringify(stu)
        })
      )
      .catch(err =>
        callback(null, {
          statusCode: err.statusCode || 500,
          headers: { "Content-Type": "text/plain" },
          body: "Could not fetch the ans."
        })
      );
  });
};


module.exports.getTemp = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  connectToDatabase().then(() => {
    Student.find({ learnerID: event.pathParameters.learnerid })
      .then(stu =>{
        var req = Request('GET','http://13.250.105.2:5001/sen_sim/sen');
        console.log(req.getBody());

        callback(null, {
          statusCode: 200,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true
          },
          body: JSON.stringify(stu)
        })}
      )
      .catch(err =>
        callback(null, {
          statusCode: err.statusCode || 500,
          headers: { "Content-Type": "text/plain" },
          body: err
        })
      );
  });
};

var totMarks = 0;
var ids = [];
var obj = {};
var finalAns={};
var anss;

var TextArea = function(ans,i,event){
  return new Promise(function(resolve, reject){
    {
      
      var answers = {};
      answers.modelAns = ans[i].answer;
      answers.actAns = ans[i].rightAnswer;
      var apiURL = "http://13.250.105.2:5001/sen_sim/sen";
      fetch2(apiURL, {
        method: "POST",
        body: JSON.stringify(answers),
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        }
      })
      .then(res => res.json())
        .then(ansd => {
          
          let similarity = ansd;
          totMarks += similarity;
       
          for (var j = 0; j < obj.length; j++) {
           
            if (obj[j].question == ans[i]._id) {             
              obj[j].totMarks = similarity;
            
            } else {
              if(obj[j].totMarks == undefined || obj[j].totMarks == null || obj[j].totMarks == 0)
                   obj[j].totMarks= 0;
            }
          }         
        })
        .then(() => {
          let diff = event.pathParameters.difficulty;
          let learnerId = event.pathParameters.learnerID;
         
          Student.find({ learnerID: { $eq: learnerId } }).then(student => {
            let tot = ids.length;
            obj.totTestMarks = totMarks;
  
            if (diff.toLowerCase() == "medium")
              student[0].Mmarks.push((totMarks * 100) / tot);
            if (diff.toLowerCase() == "hard")
              student[0].Hmarks.push((totMarks * 100) / tot);
            if (diff.toLowerCase() == "easy")
              student[0].Emarks.push((totMarks * 100) / tot);
  
            student[0].Tmarks.push((totMarks * 100) / tot);
            Student.findByIdAndUpdate(student[0]._id, student[0], {
              new: true
            }).then(stu => {
             
              
              finalAns.Result = obj;
              finalAns.Total = obj.totTestMarks;
              
             
              
              resolve(JSON.stringify(finalAns));
             
            });
          });
        })
        .catch(err =>{
          console.log(err);
          reject(err);
        }
        );
    }
  });
};
var checkboxRadio = function(ans,i,j){
  
  return new Promise(function(resolve, reject){
    
   
    
    if (
      ans[i].questiontype == "chkbox" ||
      ans[i].questiontype == "radio"
    ) {

      if (
        
        ans[i].answer.length == anss.length &&
        ans[i].answer.every(function(u, i) {
          
          return anss.includes(u);
        })
      ) {
        totMarks += 1;
        //for (var j = 0; j < obj.length; j++) {
          if (obj[j].question == ans[i]._id) {
            obj[j].totMarks = 1;
          }
        //}
        
      } else {
        //for (var j = 0; j < obj.length; j++) {
          if (obj[j].question == ans[i]._id) {
            obj[j].totMarks = 0;
          }
        //}
      }

      finalAns.Result = obj;
      finalAns.Total = obj.totTestMarks;
     
      console.log(JSON.stringify(finalAns));
     
      resolve(JSON.stringify(finalAns));
    }
 })};

 var promises = [];
var someFunction = function(ans,event,i) {
  
  for (var j = 0; j < obj.length; j++) {
     
    
    if (obj[j].question == ans[i]._id) {
      anss = obj[j].answer;
      obj[j].rightAns = ans[i].answer;
      obj[j].questiontype = ans[i].questiontype;
      obj[j].questionDesc = ans[i].question;
      obj[j].options = ans[i].options;
      //console.log(obj[j]);
      if(ans[i].questiontype == "text"){
        promises.push(TextArea(ans,i,event));
      }else{
        promises.push(checkboxRadio(ans,i,j));
      }
    }
  }


}

module.exports.Result = (event, context, callback) => {
 totMarks = 0;
 ids = [];
 obj = {};
 finalAns={};
 anss='';
 promises=[];
  context.callbackWaitsForEmptyEventLoop = false;
  connectToDatabase().then(() => {
    obj = JSON.parse(event.body);
    for (var i = 0; i < obj.length; i++) {
      ids.push(obj[i].question);
    }
    Question.find({
      _id: { $in: ids }
    })
      .then(ans => {
        var i=0;       
        
        for(var i = 0; i < ans.length; i++) {
          someFunction(ans,event,i);
        }

        Promise.all(promises) 
         .then(data => {
          var max=0;
          var index = 0;
          for(var i = 0; i < data.length; i++) {
            if(max < data[i].length ){
               max = data[i].length;
               index = i;
            }
          }

         var finalData = data.map(function(a){return a.length;}).indexOf(Math.max.apply(Math, data.map(function(a){return a.length;})));
                      callback(null, {
                        statusCode: 200,
                        headers: {
                          "Access-Control-Allow-Origin": "*",
                          "Access-Control-Allow-Credentials": true
                        },
                        body: data[index]
                      })})
        .catch(function(err){
          console.log(err);
        })        
      })     
  });
};

module.exports.deleteStudent = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  connectToDatabase().then(() => {
    Student.findByIdAndRemove(event.pathParameters.id)
      .then(stu =>
        callback(null, {
          statusCode: 200,
          body: JSON.stringify({ message: "Removed note with id: " + stu._id })
        })
      )
      .catch(err =>
        callback(null, {
          statusCode: err.statusCode || 500,
          headers: { "Content-Type": "text/plain" },
          body: "Could not fetch the students."
        })
      );
  });
};

module.exports.truncateQuestion = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  connectToDatabase().then(() => {
    Question.remove({})
      .then(note =>
        callback(null, {
          statusCode: 200,
          body: JSON.stringify({ message: "Removed all Questions" })
        })
      )
      .catch(err =>
        callback(null, {
          statusCode: err.statusCode || 500,
          headers: { "Content-Type": "text/plain" },
          body: "Could not fetch the questions."
        })
      );
  });
};

module.exports.truncateAnswer = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  connectToDatabase().then(() => {
    Answer.remove({})
      .then(note =>
        callback(null, {
          statusCode: 200,
          body: JSON.stringify({ message: "Removed all Answer" })
        })
      )
      .catch(err =>
        callback(null, {
          statusCode: err.statusCode || 500,
          headers: { "Content-Type": "text/plain" },
          body: "Could not fetch the answers."
        })
      );
  });
};
