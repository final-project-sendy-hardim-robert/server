require('dotenv').config()
var createError = require('http-errors');
var express = require('express');
var logger = require('morgan');

var usersRouter = require('./routes/users');
var app = express();
var cors = require('cors');


var mongoose = require('mongoose');
mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@ds211625.mlab.com:11625/final-project-db`, {useNewUrlParser: true});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('connected to final-project-db on mlab')
});

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log(err, 'apa nih')
  // render the error page
  res.status(err.status || 500);
});

module.exports = app;
