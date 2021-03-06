require('dotenv').config()
var createError = require('http-errors');
var express = require('express');
var logger = require('morgan');

var scheduleRouter  = require('./routes/schedules')
var usersRouter = require('./routes/users');
var weatherRouter = require('./routes/weather.js')
var app = express();
var cors = require('cors');


const deploymentDB = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@ds211625.mlab.com:11625/final-project-db`
const developmentDB = 'mongodb://localhost/namadbnya'

var mongoose = require('mongoose');
/* istanbul ignore next */ 
mongoose.connect(process.env.NODE_ENV === 'dev' ? deploymentDB : developmentDB, { useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('connected to final-project-db on mlab')
});

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/users', usersRouter);
app.use('/schedule', scheduleRouter);
app.use('/weather', weatherRouter)
// catch 404 and forward to error handler

module.exports = app;
