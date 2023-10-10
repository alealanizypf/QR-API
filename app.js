var express = require('express');
var path = require('path');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var blobRouter = require('./routes/blob');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ 
   extended: false,
}));

app.use('/', indexRouter);
app.use('/blob', blobRouter);

module.exports = app;
