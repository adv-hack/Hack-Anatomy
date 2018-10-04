"use strict";


// const uuid = require('uuid');
// const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
// require("dotenv").config({ path: "./variables.env" });
// //const connectToDatabase = require("./db");
// //const Note = require('./models/Note.js');
// var Question = require("./models/Question");
// var Student = require("./models/Student");
// var Request = require("sync-request");

// AWS.config.update({region:'ap-southeast-1'});

// const dynamoDb = new AWS.DynamoDB.DocumentClient();

const uuid = require('uuid');
const dynamoDb = require('./dynamodb');
var shuffle = require('shuffle-array')
var fetch2 = require("node-fetch");


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
          headers: {
            "Content-Type": "text/plain" ,
            "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
            "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
          },
          body: err
        })
      );
  });
};

module.exports.createDynamoQue = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);

  if (typeof data.question !== 'string') {
    console.error('Validation Failed');
    callback(null, {
      statusCode: 400,
      headers: {
        'Content-Type': 'text/plain',
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true
      },
      body: 'Couldn\'t create the todo item.',
    });
    return;
  }

  const params = {
    TableName: process.env.QUESTIONS_TABLE,
    Item: {
      id: uuid.v1(),
      question: data.question,
      questiontype: data.questiontype,
      difficulty: data.difficulty,
      options: data.options,
      subject: data.subject,
      answer: data.answer
    },
  };

  // write the todo to the database
  dynamoDb.put(params, (error) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: {
          'Content-Type': 'text/plain',
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true
        },
        body: 'Couldn\'t create the todo item.',
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(params.Item),
    };
    callback(null, response);
  });
};

module.exports.createStudentD = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const data = JSON.parse(event.body);
  if (typeof data.learnerID !== 'string') {
    console.error('Validation Failed');
    callback(null, {
      statusCode: 400,
      headers: {
        'Content-Type': 'text/plain',
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true
      },
      body: 'Couldn\'t create the student.',
    });
    return;
  }

  const params = {
    TableName: process.env.STUDENTS_TABLE,
    Item: {
      learnerID: data.learnerID,
      totNo: 0,
      Tmarks: [],
      easyNo: 0,
      Emarks: [],
      mediumNo: 0,
      Mmarks: [],
      hardNo: 0,
      Hmarks: []
    },
  };

  // write the todo to the database
  dynamoDb.put(params, (error) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: {
          'Content-Type': 'text/plain',
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true
        },
        body: 'Couldn\'t create the todo item.',
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      headers: {
        "Content-Type": "text/plain" ,
        "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
      },
      body: JSON.stringify(params.Item),
    };
    callback(null, response);
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
          headers: {
            "Content-Type": "text/plain" ,
            "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
            "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
          },
          body: err
        })
      );
  });
};


var fetchStudent = function (lid) {
  return new Promise((resolve, reject) => {
    const params = {
      TableName: process.env.STUDENTS_TABLE,
      Key: {
        learnerID: lid,
      },
    };
    dynamoDb.get(params, (error, result) => {
      // handle potential errors
      if (error) {
        console.error(error);
        reject(null, {
          statusCode: error.statusCode || 501,
          headers: {
            'Content-Type': 'text/plain',
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true
          },
          body: 'Couldn\'t fetch the todo item.',
        });
        //return;
      }
      resolve(result.Item);
    });
  });
}

var updateStudentDB = function (params) {
  return new Promise((resolve, reject) => {
    dynamoDb.update(params, (error, result) => {
      // handle potential errors
      if (error) {
        console.error(error);
        reject(null, {
          statusCode: error.statusCode || 501,
          headers: {
            'Content-Type': 'text/plain',
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true
          },
          body: 'Couldn\'t update the todo item.',
        });
        return;
      }
      resolve(result.Attributes);
    });
  });
}

module.exports.getAllQueD = (event, context, callback) => {
  let fetchNumber = parseInt(event.pathParameters.total);
  let diff = event.pathParameters.difficulty;
  let learnerId = event.pathParameters.learnerID;
  let subject = event.pathParameters.subject;
  console.log(learnerId);
  fetchStudent(learnerId)
    .then((result) => {
      let student = result;
      console.log(JSON.stringify(student));
      student.totNo += 1;
      if (diff.toLowerCase() == "medium") student.mediumNo += 1;
      if (diff.toLowerCase() == "hard") student.hardNo += 1;
      if (diff.toLowerCase() == "easy") student.easyNo += 1;

      const updateStudent = {
        TableName: process.env.STUDENTS_TABLE,
        Key: {
          learnerID: learnerId,
        },
        UpdateExpression: "set totNo=:t, mediumNo = :m, hardNo=:h, easyNo=:e",
        ExpressionAttributeValues: {
          ":t": student.totNo,
          ":m": student.mediumNo,
          ":h": student.hardNo,
          ":e": student.easyNo
        },
        ReturnValues: "ALL_NEW"
      };

      updateStudentDB(updateStudent)
        .then(result => {
          const getQues = {
            TableName: process.env.QUESTIONS_TABLE,
            FilterExpression: 'subject = :sub AND difficulty = :diff',
            ProjectionExpression: "id, question, questiontype, difficulty, options, subject",
            ExpressionAttributeValues: {
              ":sub": subject,
              ":diff": diff
            }
          };
          dynamoDb.scan(getQues, (error, result) => {
            // handle potential errors
            if (error) {
              console.error(error);
              callback(null, {
                statusCode: error.statusCode || 501,
                headers: {
                  'Content-Type': 'text/plain',
                  "Access-Control-Allow-Origin": "*",
                  "Access-Control-Allow-Credentials": true
                },
                body: 'Couldn\'t fetch questions.',
              });
              return;
            }
            // create a response
            const response = {
              statusCode: 200,
              headers: {
                "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
                "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
              },
              //body: 'Nach mari sathe',
              body: JSON.stringify(shuffle.pick(result.Items, { 'picks': fetchNumber })),
            };
            callback(null, response);
          });
        });
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

module.exports.getStudentD = (event, context, callback) => {
  fetchStudent(event.pathParameters.learnerid)
  .then(result => {
    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
      },
      //body: 'Nach mari sathe',
      body: JSON.stringify(result),
    };
    callback(null, response);
  })
};


module.exports.getTemp = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  connectToDatabase().then(() => {
    Student.find({ learnerID: event.pathParameters.learnerid })
      .then(stu => {
        var req = Request('GET', 'http://54.255.204.22:5001/sen_sim/sen');
        console.log(req.getBody());

        callback(null, {
          statusCode: 200,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true
          },
          body: JSON.stringify(stu)
        })
      }
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
var finalAns = {};
var anss;
var ques = [];

var getTextAns = function (modelAns, actAns) {
  return new Promise((resolve, reject) => {
    var answers = {};
    answers.modelAns = modelAns;
    answers.actAns = actAns;
    console.log('asdasdasdad :      ' + JSON.stringify(answers));
    var apiURL = "http://54.255.204.22:5001/sen_sim/sen";
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
      .then(ans => {
        if (ans == null) {
          reject(ans);
        } else {
          resolve(ans);
        }
      })
  });
}


var TextArea = function (ans, i, event, objj, isEnd) {
  return new Promise(function (resolve, reject) {
    {
      // console.log('answer for API : '+objj.rightAns[0]);
      // console.info('answer for API : '+ansd.answer[0]);
      console.log(objj);
      getTextAns(objj.rightAns[0], objj.answer)
        .then(ansd => {
          let similarity = ansd;
          // console.log('answer from API : '+ansd);
          // console.info('answer from API : '+ansd);
          totMarks += similarity;
          for (var j = 0; j < obj.length; j++) {
            if (obj[j].id == ans[i].id) {
              obj[j].totMarks = similarity;
            } else {
              if (obj[j].totMarks == undefined || obj[j].totMarks == null || obj[j].totMarks == 0)
                obj[j].totMarks = 0;
            }
          }
        })
        .then(() => {
          let diff = event.pathParameters.difficulty;
          let learnerId = event.pathParameters.learnerID;
          fetchStudent(learnerId)
            .then((student) => {
              let tot = ques.length;
              obj.totTestMarks = totMarks;
              let query = '';
              let arr = [];
              let value = (totMarks * 100) / tot;
              arr.push(value);
              console.log(value);
              if (diff.toLowerCase() == "medium")
                query = "set Mmarks = list_append(Mmarks, :val), Tmarks = list_append(Tmarks, :val)";
              if (diff.toLowerCase() == "hard")
                query = "set Hmarks = list_append(Hmarks, :val), Tmarks = list_append(Tmarks, :val)";
              if (diff.toLowerCase() == "easy")
                query = "set Emarks = list_append(Emarks, :val), Tmarks = list_append(Tmarks, :val)";

              const updateStudent = {
                TableName: process.env.STUDENTS_TABLE,
                Key: {
                  learnerID: learnerId,
                },
                UpdateExpression: query,
                ExpressionAttributeValues: {
                  ":val": arr
                },
                ReturnValues: "ALL_NEW"
              };
              if(isEnd){
                console.log('student updated....');
                updateStudentDB(updateStudent)
                .then(result => {
                  finalAns.Result = obj;
                  finalAns.Total = obj.totTestMarks;
                  resolve(JSON.stringify(finalAns));
                  // create a response
                  // const response = {
                  //   statusCode: 200,
                  //   body: JSON.stringify(result.Attributes),
                  // };
                  // callback(null, response);
                });
              }else{
                finalAns.Result = obj;
                finalAns.Total = obj.totTestMarks;
                resolve(JSON.stringify(finalAns));
              }
            });
        })
        .catch(err => {
          console.log(err);
          reject(err);
        }
        );
    }
  });
};
var checkboxRadio = function (ans, i, j, event, isEnd) {
  return new Promise(function (resolve, reject) {
    if (
      ans[i].questiontype == "chkbox" ||
      ans[i].questiontype == "radio"
    ) {
      if (
        ans[i].answer.length == anss.length &&
        ans[i].answer.every(function (u, i) {
          return anss.includes(u);
        })
      ) {
        totMarks += 1;
        if (obj[j].question == ans[i]._id) {
          obj[j].totMarks = 1;
        }
      } else {
        if (obj[j].question == ans[i]._id) {
          obj[j].totMarks = 0;
        }
      }

      let diff = event.pathParameters.difficulty;
      let learnerId = event.pathParameters.learnerID;
      fetchStudent(learnerId)
        .then((student) => {
          let tot = ques.length;
          obj.totTestMarks = totMarks;
          let query = '';
          let arr = [];
          let value = (totMarks * 100) / tot;
          arr.push(value);
          console.log(value);
          if (diff.toLowerCase() == "medium")
            query = "set Mmarks = list_append(Mmarks, :val), Tmarks = list_append(Tmarks, :val)";
          if (diff.toLowerCase() == "hard")
            query = "set Hmarks = list_append(Hmarks, :val), Tmarks = list_append(Tmarks, :val)";
          if (diff.toLowerCase() == "easy")
            query = "set Emarks = list_append(Emarks, :val), Tmarks = list_append(Tmarks, :val)";

          const updateStudent = {
            TableName: process.env.STUDENTS_TABLE,
            Key: {
              learnerID: learnerId,
            },
            UpdateExpression: query,
            ExpressionAttributeValues: {
              ":val": arr
            },
            ReturnValues: "ALL_NEW"
          };
          if(isEnd){
            updateStudentDB(updateStudent)
            .then(result => {
              finalAns.Result = obj;
              finalAns.Total = obj.totTestMarks;
              resolve(JSON.stringify(finalAns));
              // create a response
              // const response = {
              //   statusCode: 200,
              //   body: JSON.stringify(result.Attributes),
              // };
              // callback(null, response);
            });
          }else{
            finalAns.Result = obj;
            finalAns.Total = obj.totTestMarks;
            resolve(JSON.stringify(finalAns));
          }

        });

      // finalAns.Result = obj;
      // finalAns.Total = obj.totTestMarks;

      // console.log(JSON.stringify(finalAns));

      //resolve(JSON.stringify(finalAns));
    }
  })
};

var promises = [];
var someFunction = function (ans, event, i) {

  for (var j = 0; j < obj.length; j++) {


    if (obj[j].id == ans[i].id) {
      anss = obj[j].answer;
      obj[j].rightAns = ans[i].answer;
      obj[j].questiontype = ans[i].questiontype;
      obj[j].questionDesc = ans[i].question;
      obj[j].options = ans[i].options;
      //console.log(obj[j]);
      if (ans[i].questiontype == "text") {
        promises.push(TextArea(ans, i, event, obj[j], j==(obj.length-1)));
      } else {
        promises.push(checkboxRadio(ans, i, j, event, j==(obj.length-1)));
      }
    }
  }
}

var getQues = function (QueId) {
  return new Promise(function (resolve, reject) {
    const getQue = {
      TableName: process.env.QUESTIONS_TABLE,
      Key: {
        id: QueId,
      },
    };

    // fetch todo from the database
    dynamoDb.get(getQue, (error, result) => {
      // handle potential errors
      if (error) {
        console.error(error);
        reject(null, {
          statusCode: error.statusCode || 501,
          headers: {
            'Content-Type': 'text/plain',
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true
          },
          body: 'Couldn\'t fetch the todo item.',
        });
        return;
      }
      ques.push(result.Item);
      resolve(result.Item);
    });
  });
}


module.exports.ResultD = (event, context, callback) => {
  totMarks = 0;
  ids = [];
  obj = {};
  finalAns = {};
  anss = '';
  promises = [];
  ques = [];
  obj = JSON.parse(event.body);

  let quePromises = [];
  for (var i = 0; i < obj.length; i++) {
    //call query function to fetch question and fill it into ques json
    quePromises.push(getQues(obj[i].id))
  }
  Promise.all(quePromises)
    .then(() => {
      //will get all questions with correct answers
      for (var i = 0; i < ques.length; i++) {
        someFunction(ques, event, i);
      }

      Promise.all(promises)
        .then(data => {
          var max = 0;
          var index = 0;
          for (var i = 0; i < data.length; i++) {
            if (max < data[i].length) {
              max = data[i].length;
              index = i;
            }
          }

          var finalData = data.map(
            function (a) {
              return a.length;
            }).indexOf(Math.max.apply(
              Math, data.map(function (a) {
                return a.length;
              })
            ));
          callback(null, {
            statusCode: 200,
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Credentials": true
            },
            body: data[index]
          })
        })
        .catch(function (err) {
          console.log(err);
        })
    });
};

module.exports.Result = (event, context, callback) => {
  totMarks = 0;
  ids = [];
  obj = {};
  finalAns = {};
  anss = '';
  promises = [];
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
        var i = 0;

        for (var i = 0; i < ans.length; i++) {
          someFunction(ans, event, i);
        }

        Promise.all(promises)
          .then(data => {
            var max = 0;
            var index = 0;
            for (var i = 0; i < data.length; i++) {
              if (max < data[i].length) {
                max = data[i].length;
                index = i;
              }
            }

            var finalData = data.map(function (a) { return a.length; }).indexOf(Math.max.apply(Math, data.map(function (a) { return a.length; })));
            callback(null, {
              statusCode: 200,
              headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true
              },
              body: data[index]
            })
          })
          .catch(function (err) {
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
