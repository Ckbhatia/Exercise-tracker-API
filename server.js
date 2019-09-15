const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const cors = require('cors')
const User = require('./models/User');
const Exercise = require('./models/Exercise');

const mongoose = require('mongoose')
mongoose.connect(process.env.MLAB_URI || 'mongodb://localhost/exercise-track' )

app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// Here're routes
app.post('/api/exercise/new-user', (req, res, next) => {
  const data = req.body;
  User.create(data, (err, user) => {
    // delete user.password
    if (err) return res.status(400).json({status: 'error', msg: err});
    res.status(200).json({user});
  });
}); 

// Get users
app.get('/api/exercise/users', (req, res, next) => {
  // const data = req.body;
  User.find({}, "-password", (err, users) => {
    // delete user.password
    if (err) return res.status(400).json({status: "error", msg: "There's error"});
    res.status(200).json({users});
  });
}); 


// Post add exercise
app.post('/api/exercise/add', (req, res, next) => {
  const data = req.body;
  const { username } = req.body;
  
  // Saves in Exercise schema
  Exercise.create(data ,(err, exercise) => {
    if(err) return res.status(400).json({status: 'error', msg: err});
    // res.status(200).json({exercise});
    // console.log(exercise.id, "Obtain exercise id");
    User.findOneAndUpdate({username}, {$push: {exercise: exercise.id}}, (err, user) => {
      // In testing
      if(err) return  res.status(400).json({status: 'error', msg: err});
      if(!user) return  res.status(400).json({status: 'error', msg: err});
      // return next();
      // user.exercise.push()
      // res.status(200).json({user})
    });
    res.status(200).json({exercise});
  });
  // Exercise.create(data, (err, exercise) => {
  //   if (err) return next(err);
  //   res.status(200).json({exercise});
  // });
}); 

// Get log
app.get('/api/exercise/log?', (req, res) => {
  // const { username, query } = req.params;
  let { username, from, to, limit } = req.query;
  // Exercise.find({username}, (err, exercise) => {
  //   if (err) return next(err);
  //   res.status(200).json({exercise});
  // });
  // With optional parameters
  if(limit) limit = Number(limit);
  if(from) from = new Date(from);
  if(to) { 
    to = new Date(to);
    to.setDate(to.getDate() + 1);
  }
  console.log(limit, from, to);
  // limit = !limit ? '' : Number(limit);
  console.log(username, from, to, limit, 'From console');
  User
  .find({
    username: username,
    // match: { $gt: from, $lt: to }
  })
  .select('username description duration date')
  .limit(limit)
  .populate('exercise')
  .exec((err, exercise) => {
    if (err) return res.status(400).json({status: 'error', msg: err});
    res.status(200).json({exercise});
  });
}); 

// Not found middleware
app.use((req, res, next) => {
  return next({status: 404, message: 'not found'})
})

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
