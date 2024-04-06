const createError = require("http-errors");
const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const winston = require("./winston");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const hpp = require("hpp");
const cors = require("cors");
const compression = require("compression");
const chalk = require("chalk");
require("dotenv").config();
const session = require('express-session');
const mongoStore = require('connect-mongo');
const path = require('path');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');

const indexRouter = require("./routes/index_router");
const usersRouter = require("./routes/users_router");
const quizRouter = require("./routes/quiz_router");
const submitRouter = require("./routes/history_router");
const histRouter = require("./routes/get_hist_router");
const seriesRouter = require("./routes/series_router");

const mongoose = require("mongoose");
const Teacher = require("./models/teacher_model");
const paymentRouter = require("./routes/payment_router");
const teacherRouter = require("./routes/teachers_router");
const notification = require("./routes/notification_router");
const pyqRouter = require("./routes/pyq_router");
const resetPassword = require("./routes/reset_pass_router");
const adminRouter = require("./routes/admin_router");

mongoose.set("autoIndex", true);

const connectDB = async () => {
  const con = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    autoIndex: true,
  });
  console.log(
    chalk.bgGreen.black(`MongoDB Connected: ${con.connection.host}.`)
  );
};

connectDB();

var app = express();

app.use(favicon(path.join(__dirname, 'public', 'exam_booster.png')));

app.enable("trust proxy");

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    cookie: {
      domain: 'localhost',
      path: '/',
      maxAge: 5 * 24 * 60 * 60 * 1000, // 5 days in milliseconds
      httpOnly: true,
      secure: false
    },
    store: mongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collection: 'sessions',
      touchAfter: 10 * 60 * 60, // 10 hours in seconds
      autoRemove: 'native',
    })
  })
);

// Set Body parser, reading data from body into req.body;
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(bodyParser.json());

// Set security HTTP headers
app.use(helmet());

app.use(morgan("combined", { stream: winston.stream }));

app.use(cookieParser("12345-67890"));

// Limit requests from the same API
const limiter = rateLimit({
  max: 500,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, Please try again in an hour!",
});
app.use("/", limiter);

// Prevent http param pollution
app.use(hpp());
app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true
}));

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', 'http://localhost:3001');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,UPDATE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  next();
});

app.use(compression());

app.disable("x-powered-by");

app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));
app.use('/resources', express.static(path.join(__dirname, 'public')));

// Middleware to check if the user is logged in
app.use("/", indexRouter);
app.use('/admin', adminRouter);
app.use("/reset", resetPassword);
app.use((req, res, next) => {
  const userAgent = req.headers['user-agent'];

  if (userAgent.includes('Mozilla') || userAgent.includes('Chrome') || userAgent.includes('Safari') || userAgent.includes('Firefox') || userAgent.includes('Edge') || userAgent.includes('Opera') || userAgent.includes('OPR') || userAgent.includes('Trident') || userAgent.includes('MSIE')) {
    res.status(403).send('Access denied');
  } else {
    next();
  }
});
app.use("/users", usersRouter);

app.get('/checkSession', async (req, res) => {
  try {
    if (req.session.userId) {
      const id = req.session.userId;
      const User = await user.findById(id); // Find user by object ID
      if (!User) {
        const teacher = await Teacher.findById(id);
        res.status(200).json({
          profession: false,
          mot: teacher.MOT
        }).send();
      }
      else {
        res.status(200).json({
          // check if user is student then send the student data else send the teacher data 

          purchasedSeries: User.purchasedSeries,
          enrolledFor: User.enrolledFor,
          profession: true,
        });
      }
    } else {
      res.status(401).json({ msg: "Not logged in!" }).send();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal Server Error").send();
  }
});
app.use((req, res, next) => {
  if (req.session.userId) {
    next(); // Call the next middleware
  } else {
    return res.status(401).json("Login again!").send(); // Set status to 401 as Unauthorized and send an empty response  
  }
});
app.use("/quizes", quizRouter);
app.use("/testSubmit", submitRouter);
app.use("/history", histRouter);
app.use("/series", seriesRouter);
app.use("/payment", paymentRouter);
app.use("/teachers", teacherRouter);
app.use("/notifications", notification);
app.use("/pyqs", pyqRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  winston.error(
    `${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method
    } - ${req.ip}`
  );
  // render the error page
  res.status(err.status || 500);
  // res.render("error");
});

module.exports = app;
