'use strict';
require('dotenv').config({ path: './variables.env' });
const connectToDatabase = require('./db');
//const Note = require('./models/Note.js');
var Question = require('./models/Question');
var Student = require('./models/Student');


module.exports.createQue = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  connectToDatabase()
    .then(() => {
      Question.create(JSON.parse(event.body))
        .then(que => callback(null, {
          statusCode: 200,
          body: JSON.stringify(que)
        }))
        .catch(err => callback(null, {
          statusCode: err.statusCode || 500,
          headers: { 'Content-Type': 'text/plain' },
          body: err
        }));
    });
};


module.exports.createStudent = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  connectToDatabase()
    .then(() => {
      Student.create(JSON.parse(event.body))
        .then(stu => callback(null, {
          statusCode: 200,
          body: JSON.stringify(stu)
        }))
        .catch(err => callback(null, {
          statusCode: err.statusCode || 500,
          headers: { 'Content-Type': 'text/plain' },
          body: err
        }));
    });
};

module.exports.getAllQue = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  connectToDatabase()
    .then(() => {
      let fetchNumber = parseInt(event.pathParameters.total)
      let diff = event.pathParameters.difficulty
      let learnerId = event.pathParameters.learnerID

      Student.find({learnerID: {$eq: learnerId}})
      .then(student => {
        student[0].totNo += 1;
        if(diff.toLowerCase() == 'medium') student[0].mediumNo += 1;
        if(diff.toLowerCase() == 'hard') student[0].hardNo += 1;
        if(diff.toLowerCase() == 'easy') student[0].easyNo += 1;
        Student.findByIdAndUpdate(student[0]._id, student[0], { new: true })
        .then(stu => {
          console.log(stu)
          Question.aggregate([
            { 
              $match: { subject: { $eq: event.pathParameters.subject }, difficulty: {$eq: diff} }
            },
            {
              $sample: {size:fetchNumber}
            }, 
            {
              $project: { question: 1, questiontype: 1, difficulty:1, options:1, subject:1, answer:'' } 
            }
            
          ])
          .then(ques => callback(null, {
            statusCode: 200,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify(ques)
          }))
          .catch(err => callback(null, {
            statusCode: err.statusCode || 500,
            headers: { 'Content-Type': 'text/plain' },
            body: err
          }))
          }
        )
      })
      .catch(err => callback(null, {
        statusCode: err.statusCode || 500,
        headers: { 'Content-Type': 'text/plain' },
        body: err
      }))
    });
};


module.exports.getQuestions = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  connectToDatabase()
    .then(() => {
      Question.find()
        .then(que => callback(null, {
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: JSON.stringify(que)
        }))
        .catch(err => callback(null, {
          statusCode: err.statusCode || 500,
          headers: { 'Content-Type': 'text/plain' },
          body: 'Could not fetch the ans.'
        }));
    });
};

module.exports.getStudent = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  connectToDatabase()
    .then(() => {
      Student.find({learnerID: event.pathParameters.learnerid})
        .then(stu => callback(null, {
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: JSON.stringify(stu)
        }))
        .catch(err => callback(null, {
          statusCode: err.statusCode || 500,
          headers: { 'Content-Type': 'text/plain' },
          body: 'Could not fetch the ans.'
        }));
    });
};

module.exports.Result = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  var totMarks = 0;
  var ids = [];
  var obj = {};
  connectToDatabase()
    .then(() => {
      obj = JSON.parse(event.body)
      for (var i = 0; i < obj.length; i++) {
        ids.push(obj[i].question);
      }
      Question.find({
        _id: {$in : ids}
      }).then(ans => {

        for(var i=0; i<ans.length; i++){
          var anss;
          for(var j=0; j< obj.length; j++){
            if(obj[j].question == ans[i]._id){
              anss = obj[j].answer;
              obj[j].rightAns = ans[i].answer;
              obj[j].questiontype = ans[i].questiontype;
              obj[j].questionDesc = ans[i].question;
              obj[j].options = ans[i].options;
            }
          }
          if(ans[i].questiontype == 'chkbox' || ans[i].questiontype == 'radio'){
            if (ans[i].answer.length == anss.length
                && ans[i].answer.every(function(u, i) {
                    return anss.includes(u);
                })
              ) {
                totMarks += 1;
                for(var j=0; j< obj.length; j++){
                  if(obj[j].question == ans[i]._id){
                    obj[j].totMarks = 1;
                  }
                }
              }else{
                for(var j=0; j< obj.length; j++){
                  if(obj[j].question == ans[i]._id){
                    obj[j].totMarks = 0;
                  }
                }
              }
            }else{
              var answers = anss[0] + '#' + ans[i].answer[0];
              var apiURL="https://21wgg447m7.execute-api.ap-southeast-1.amazonaws.com/dev/questions/2/Maths";
              fetch(apiURL)
                .then(res => res.json())
                .then(() => {
                  let similarity = 1
                  totMarks += similarity
                  for(var j=0; j< obj.length; j++){
                    if(obj[j].question == ans[i]._id){
                      obj[j].totMarks = similarity;
                    }
                  }
                }
                )
                .catch(err => callback(null, {
                  statusCode: err.statusCode || 500,
                  headers: { 'Content-Type': 'text/plain' },
                  body: 'Could not fetch the ans.'+err
                }));
            }
          }
      })
      .then(() => {
        let diff = event.pathParameters.difficulty
        let learnerId = event.pathParameters.learnerID

        Student.find({learnerID: {$eq: learnerId}})
        .then(student => {
          let tot = ids.length;
          obj.totTestMarks = totMarks;
          
          if(diff.toLowerCase() == 'medium') student[0].Mmarks.push((totMarks*100)/tot);
          if(diff.toLowerCase() == 'hard') student[0].Hmarks.push((totMarks*100)/tot);
          if(diff.toLowerCase() == 'easy') student[0].Emarks.push((totMarks*100)/tot);

          student[0].Tmarks.push((totMarks*100)/tot);
          Student.findByIdAndUpdate(student[0]._id, student[0], { new: true })
          .then(stu => {
            console.log(stu);
            let finalAns = {};
            finalAns.Result = obj;
            finalAns.Total = obj.totTestMarks;
            callback(null, {
              statusCode: 200,
              headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
              },
              body: JSON.stringify(finalAns)
            })
          })
        })
        
      })
      .catch(err => callback(null, {
        statusCode: err.statusCode || 500,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Could not fetch the ans.'+err
      }));

    });

};


module.exports.deleteStudent = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  connectToDatabase()
    .then(() => {
      Student.findByIdAndRemove(event.pathParameters.id)
        .then(stu => callback(null, {
          statusCode: 200,
          body: JSON.stringify({ message: 'Removed note with id: ' + stu._id })
        }))
        .catch(err => callback(null, {
          statusCode: err.statusCode || 500,
          headers: { 'Content-Type': 'text/plain' },
          body: 'Could not fetch the students.'
        }));
    });
};

module.exports.truncateQuestion = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  connectToDatabase()
    .then(() => {
      Question.remove({})
        .then(note => callback(null, {
          statusCode: 200,
          body: JSON.stringify({ message: 'Removed all Questions' })
        }))
        .catch(err => callback(null, {
          statusCode: err.statusCode || 500,
          headers: { 'Content-Type': 'text/plain' },
          body: 'Could not fetch the notes.'
        }));
    });
};

module.exports.truncateAnswer = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  connectToDatabase()
    .then(() => {
      Answer.remove({})
        .then(note => callback(null, {
          statusCode: 200,
          body: JSON.stringify({ message: 'Removed all Answer' })
        }))
        .catch(err => callback(null, {
          statusCode: err.statusCode || 500,
          headers: { 'Content-Type': 'text/plain' },
          body: 'Could not fetch the notes.'
        }));
    });
};

// module.exports.getOne = (event, context, callback) => {
//   context.callbackWaitsForEmptyEventLoop = false;

//   connectToDatabase()
//     .then(() => {
//       Note.findById(event.pathParameters.id)
//         .then(note => callback(null, {
//           statusCode: 200,
//           body: JSON.stringify(note)
//         }))
//         .catch(err => callback(null, {
//           statusCode: err.statusCode || 500,
//           headers: { 'Content-Type': 'text/plain' },
//           body: 'Could not fetch the note.'
//         }));
//     });
// };

// module.exports.createAns = (event, context, callback) => {
//   context.callbackWaitsForEmptyEventLoop = false;

//   connectToDatabase()
//     .then(() => {
//       Answer.create(JSON.parse(event.body))
//         .then(que => callback(null, {
//           statusCode: 200,
//           body: JSON.stringify(que)
//         }))
//         .catch(err => callback(null, {
//           statusCode: err.statusCode || 500,
//           headers: { 'Content-Type': 'text/plain' },
//           body: err
//         }));
//     });
// };

// module.exports.createTest = (event, context, callback) => {
//   context.callbackWaitsForEmptyEventLoop = false;

//   connectToDatabase()
//     .then(() => {
//       Test.create(JSON.parse(event.body))
//         .then(test => callback(null, {
//           statusCode: 200,
//           body: JSON.stringify(test)
//         }))
//         .catch(err => callback(null, {
//           statusCode: err.statusCode || 500,
//           headers: { 'Content-Type': 'text/plain' },
//           body: err
//         }));
//     });
// };

// module.exports.getAns = (event, context, callback) => {
//   context.callbackWaitsForEmptyEventLoop = false;

//   connectToDatabase()
//     .then(() => {
//       Answer.find({question: event.pathParameters.id})
//         .then(ans => callback(null, {
//           statusCode: 200,
//           headers: {
//             'Access-Control-Allow-Origin': '*',
//             'Access-Control-Allow-Credentials': true,
//           },
//           body: JSON.stringify(ans)
//         }))
//         .catch(err => callback(null, {
//           statusCode: err.statusCode || 500,
//           headers: { 'Content-Type': 'text/plain' },
//           body: 'Could not fetch the ans.'
//         }));
//     });
// };




// module.exports.getAllAns = (event, context, callback) => {
//   context.callbackWaitsForEmptyEventLoop = false;

//   connectToDatabase()
//     .then(() => {
//       Answer.find()
//         .then(ans => callback(null, {
//           statusCode: 200,
//           headers: {
//             'Access-Control-Allow-Origin': '*',
//             'Access-Control-Allow-Credentials': true,
//           },
//           body: JSON.stringify(ans)
//         }))
//         .catch(err => callback(null, {
//           statusCode: err.statusCode || 500,
//           headers: { 'Content-Type': 'text/plain' },
//           body: 'Could not fetch the ans.'
//         }));
//     });
// };


