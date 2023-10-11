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

//errorHandler
app.use((err,req,res)=>{
   if(err){
      const statuCode = err.status || 500;
      res.status(statuCode).send({ message: err })
   }
})

module.exports = app;
