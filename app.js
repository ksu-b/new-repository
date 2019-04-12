const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const methodOverride = require('method-override');
const session = require('express-session');
const app = express();
const redis = require("redis");
const RedisStore = require('connect-redis')(session);
const client = redis.createClient();
const { cookiesCleaner } = require('./middleware/auth');

// Подключаем mongoose.
const mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/broccoli', { useNewUrlParser: true });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser()); //порядок: cookieParser, app.use(session.., импорт маршрутов

// initialize express-session to allow us track the logged-in user across sessions.
app.use(session({
  store: new RedisStore({ 
    client,
    host: 'localhost', 
    port: 6379, 
    // ttl :  26000
  }),
  key: 'user_sid',
  secret: 'anything here',
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 600000
  }
}));

app.use(express.static(path.join(__dirname, 'public'))); // Подключаем статику

// Allows you to use PUT, DELETE with forms.
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    const method = req.body._method;
    delete req.body._method;
    return method;
  }
}));
// Импорт маршрутов.
const indexRouter = require('./routes/index');
const entriesRouter = require('./routes/entries');
const usersRouter = require('./routes/users');
// Подключаем импортированные маршруты с определенным url префиксом.
app.use('/', indexRouter);
app.use('/entries', entriesRouter);
app.use('/users', usersRouter);

// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
app.use(cookiesCleaner);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
