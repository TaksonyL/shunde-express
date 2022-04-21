var createError = require('http-errors');
var express = require('express');
var bodyParser = require('body-parser');

var devRouter = require('./routes/dev');
var payRouter = require('./routes/pay')


var app = express();

// 日志打印
const morgan = require('morgan');
const logger = require('./logger');
app.use(morgan('dev'));


// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// set routes
app.use(bodyParser.text({ type: 'text/*' }))
app.use('/dev', devRouter);
app.use('/pay', payRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  logger.error(`${req.method} ${req.originalUrl} ` + err.message)   // error log
  res.status(err.status || 500).json({
    code: -1,
    success:false,
    message: err.message,
    data: {}
  })
});

module.exports = app;
