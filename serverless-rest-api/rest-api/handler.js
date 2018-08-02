'use strict';
require('dotenv').config({ path: './variables.env' });
const connectToDatabase = require('./db');
//const Note = require('./models/Note.js');
var Question = require('./models/Question');
var Answer = require('./models/Answer');
// module.exports.create = (event, context, callback) => {
//   context.callbackWaitsForEmptyEventLoop = false;

//   connectToDatabase()
//     .then(() => {
//       Note.create(JSON.parse(event.body))
//         .then(note => callback(null, {
//           statusCode: 200,
//           body: JSON.stringify(note)
//         }))
//         .catch(err => callback(null, {
//           statusCode: err.statusCode || 500,
//           headers: { 'Content-Type': 'text/plain' },
//           body: 'Could not create the note.'
//         }));
//     });
// };

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

module.exports.createAns = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  connectToDatabase()
    .then(() => {
      Answer.create(JSON.parse(event.body))
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

// module.exports.createOption = (event, context, callback) => {
//   context.callbackWaitsForEmptyEventLoop = false;

//   connectToDatabase()
//     .then(() => {
//       Option.create(JSON.parse(event.body))
//         .then(opt => callback(null, {
//           statusCode: 200,
//           body: JSON.stringify(opt)
//         }))
//         .catch(err => callback(null, {
//           statusCode: err.statusCode || 500,
//           headers: { 'Content-Type': 'text/plain' },
//           body: err
//         }));
//     });
// };

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

// module.exports.getAll = (event, context, callback) => {
//   context.callbackWaitsForEmptyEventLoop = false;

//   connectToDatabase()
//     .then(() => {
//       Note.find()
//         .then(notes => callback(null, {
//           statusCode: 200,
//           body: JSON.stringify(notes)
//         }))
//         .catch(err => callback(null, {
//           statusCode: err.statusCode || 500,
//           headers: { 'Content-Type': 'text/plain' },
//           body: 'Could not fetch the notes.'
//         }))
//     });
// };

module.exports.getAllQue = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  connectToDatabase()
    .then(() => {
      let fetchNumber = parseInt(event.pathParameters.total)
      // let n = Question.count() - fetchNumber
      // let r = Math.floor(Math.random() * n);
      Question.aggregate([
        { $match: { subject: { $eq: event.pathParameters.subject } } },
        {
          $sample: {size:fetchNumber}
        }, 
        {
          $project: { question: 1, questiontype: 1, difficulty:1, options:1, subject:1, answer:'' } 
        }
        
      ])
      //Question.find().limit(fetchNumber).skip(r)
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
    });
};

module.exports.getAns = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  connectToDatabase()
    .then(() => {
      Answer.find({questionid: event.pathParameters.id})
        .then(ans => callback(null, {
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: JSON.stringify(ans)
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

  connectToDatabase()
    .then(() => {
      let res = JSON.parse(event.body);
      let ans = "";
      // for(var s in res){
      //   ans += s + " ";
      // }
      res.forEach(element => {
        ans += element._id
      });
      callback(null, {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({"response":ans})
      })
      // for(var s in res){
      //   console.log(s);
      // }
  
      // Answer.find({questionid: event.pathParameters.id})
      //   .then(ans => callback(null, {
      //     statusCode: 200,
      //     headers: {
      //       'Access-Control-Allow-Origin': '*',
      //       'Access-Control-Allow-Credentials': true,
      //     },
      //     body: JSON.stringify(ans)
      //   }))
      //   .catch(err => callback(null, {
      //     statusCode: err.statusCode || 500,
      //     headers: { 'Content-Type': 'text/plain' },
      //     body: 'Could not fetch the ans.'
      //   }));
    });

};


// module.exports.update = (event, context, callback) => {
//   context.callbackWaitsForEmptyEventLoop = false;

//   connectToDatabase()
//     .then(() => {
//       Note.findByIdAndUpdate(event.pathParameters.id, JSON.parse(event.body), { new: true })
//         .then(note => callback(null, {
//           statusCode: 200,
//           body: JSON.stringify(note)
//         }))
//         .catch(err => callback(null, {
//           statusCode: err.statusCode || 500,
//           headers: { 'Content-Type': 'text/plain' },
//           body: 'Could not fetch the notes.'
//         }));
//     });
// };

// module.exports.delete = (event, context, callback) => {
//   context.callbackWaitsForEmptyEventLoop = false;

//   connectToDatabase()
//     .then(() => {
//       Note.findByIdAndRemove(event.pathParameters.id)
//         .then(note => callback(null, {
//           statusCode: 200,
//           body: JSON.stringify({ message: 'Removed note with id: ' + note._id, note: note })
//         }))
//         .catch(err => callback(null, {
//           statusCode: err.statusCode || 500,
//           headers: { 'Content-Type': 'text/plain' },
//           body: 'Could not fetch the notes.'
//         }));
//     });
// };

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

