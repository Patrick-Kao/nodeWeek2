var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var mongoose = require('mongoose');
var Posts = require('./modules/post');
var headers = require('./headers');
var handleSuccess = require('./handleSuccess');
var handleError = require('./handleError');



var app = express();

// dotenv.config({ path: '.env' });
require('dotenv').config()
// const mongoURL = process.env.mongoURL.replace(
//     '<password>',
//     process.env.DATABASE_PASSWORD
// );
const mongoURL = 'mongodb+srv://a468223:963a4k5j@cluster0.g73qfcw.mongodb.net/test'
mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'testPost' // 替換為你要連接的資料庫名稱
}).then(() => console.log('資料庫連接成功'));
const requestListener = async (req, res) => {

  let body = "";
  req.on('data', chunk => {
    body += chunk;
  })
  if (req.url == "/posts" && req.method == "GET") {
    const allPosts = await Posts.find();
    handleSuccess(res, allPosts);

  } else if (req.url == "/posts" && req.method == "POST") {
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        if (data.name !== undefined && data.content !== undefined) {
          const newPost = await Posts.create(
            {
              name: data.name,
              content: data.content,
              tags: data.tags,
              image: data.image,
              likes: data.likes,
              comments: data.comments
            }
          );
          handleSuccess(res, newPost);
        } else {
          handleError(res)
        }

      } catch (err) {
        handleError(res, err)
      }
    })


  } else if (req.method == 'OPTIONS') {
    res.writeHead(200, headers);
    res.end();
  } else if (req.url.includes("/posts") && req.method == 'PATCH') {


    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        const id = decodeURIComponent(req.url.slice(7))
        const patch = await Posts.findByIdAndUpdate(id, {
          name: data.name,
          content: data.content,
          tags: data.tags,
          image: data.image,
          likes: data.likes,
          comments: data.comments

        })
        handleSuccess(res, patch);

      } catch (err) {
        handleError(res, err)
      }
    })
  } else if (req.url.includes("/posts") && req.method == 'DELETE') {
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);

        const id = decodeURIComponent(req.url.slice(7))

        const patch = await Posts.deleteOne({ _id: id })
        handleSuccess(res, patch);

      } catch (err) {
        handleError(res, err)
      }
    })
  }

}
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use(requestListener)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
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
