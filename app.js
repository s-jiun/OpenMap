var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const passport = require('passport');
const passportConfig = require('./passport');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const compRouter = require('./routes/compRegist');
const myPageRouter = require('./routes/mypage');
var sequelize = require('./models').sequelize; // mysql 시퀄라이즈 모델
var app = express();
const port = 3000;

passportConfig();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', 'layout');
app.set("layout extractScripts", true);


app.use(session({
  key : 'sid',
  secret : 'secret',
  resave:false,
  saveUninitialized : true,
  cookie:{
    maxAge : 24000 * 60 * 60
  }
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressLayouts);
app.use('/node_modules', express.static(path.join(__dirname+'/node_modules')));
app.use(express.static(path.join(__dirname, 'uploads')));

app.use(function (req, res, next) {
  res.locals.islogin = req.session.user_id;
  next();
});/////////// app.use 라우터들 위에 있어야 함!

app.use(passport.initialize()); // 요청 객체에 passport 설정을 심음
app.use(passport.session()); // req.session 객체에 passport정보를 추가 저장

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/compRegist', compRouter);
app.use('/mypage',myPageRouter);

//const { sequelize } = require('./models');

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});



sequelize.sync()
.then(() => {
    console.log('데이터베이스 연결 성공');
})
.catch((err) => {
    console.error(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

module.exports = app;



