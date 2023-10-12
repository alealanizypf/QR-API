let express = require('express');
let path = require('path');
let logger = require('morgan');
let cors = require('cors');

let indexRouter = require('./routes/index');
let blobRouter = require('./routes/blob');

let app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ 
   extended: false,
}));
app.use(cors({
   origin: "*",
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
