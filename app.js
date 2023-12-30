const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const winston = require("./winston");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");
const hpp = require("hpp");
const cors = require("cors");
const compression = require("compression");
const chalk = require("chalk");
require("dotenv").config();
const session = require('express-session');
const passport = require('passport');
const mongoStore = require('connect-mongo');

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const quizRouter = require("./routes/quizRouter");
const submitRouter = require("./routes/history");
const histRouter = require("./routes/getHistory");
const seriesRouter = require("./routes/seriesRouter");
const config = require("./config");

const mongoose = require("mongoose");
const Quizes = require("./models/quizes");
const user = require("./models/user");

const DB = config.mongoUrl;

mongoose.set("autoIndex", true);
// const sampleQuizData = {
//   name: 'Science',
//   instructions: 'Answer the following questions:',
//   isEnabled: true,
//   questions: [
//     {
//       question: 'What is the capital of France?',
//       answers: [
//         { option: 'Paris' },
//         { option: 'London' },
//         { option: 'Delhi' },
//         { option: 'Madrid' },
//       ],
//       answer: 0, // Correct answer is 'Paris'
//       isEnabled: true,
//       explanation: 'Paris is the capital of France.',
//     },
//     {
//       question: 'Which planet is known as the Blue Planet?',
//       answers: [
//         { option: 'Mars' },
//         { option: 'Earth' },
//         { option: 'Jupiter' },
//         { option: 'Saturn' },
//       ],
//       answer: 0, // Correct answer is 'Mars'
//       isEnabled: true,
//       explanation: 'Earth is often referred to as the blue Planet due presence of water.',
//     },
//     {
//       question: 'What is the largest mammal on Earth?',
//       answers: [
//         { option: 'Elephant' },
//         { option: 'Giraffe' },
//         { option: 'Blue Whale' },
//         { option: 'Lion' },
//       ],
//       answer: 2, // Correct answer is 'Blue Whale'
//       isEnabled: true,
//       explanation: 'The Blue Whale is the largest mammal on Earth.',
//     },
//   ],
//   duration: {
//     hours: 0,
//     minutes: 30,
//     seconds: 0,
//   },
// };
const connectDB = async () => {
  const con = await mongoose.connect('mongodb+srv://nishantv:zZoXw67FMyloEryM@cluster0.rqzzldr.mongodb.net/ExamBooster?retryWrites=true&w=majority', {
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

// // Create a new Quiz document in the database
// const newQuiz = new Quizes(sampleQuizData);

// // Save the quiz document
// newQuiz.save((err, savedQuiz) => {
//   if (err) {
//     console.error('Error saving quiz data:', err);
//   } else {
//     console.log('Sample quiz data saved to the database:', savedQuiz);
//   }
// })
// const quizData = [
//   {
//     name: 'Biology',    
//     chapter: [
//       {
//         chapter: 'Environmental issues',
//         questions: [
//           {
//             question: 'Which is the most important factors of Greenhouse Effect?',
//             answers: [{ option: 'Water Vapour' }, { option: 'Carbon Dioxide' }, {'option': 'CCl'}, {'option': 'Nitrogen'}],
//             answer: 1,
//             explanation: "Water vapour"
//           },
//           {
//             question: 'Which one of the following is a wrong statement?',
//             answers: [{ option: 'Ozone in upper part of atmosphere is harmful to animals' }, { option: 'Most of the forests have been lost in tropical areas' }, {'option': 'Eutrophication is a natural phenomenon in freshwater bodies'}, {'option': 'Greenhouse effect is a natural phenomenon'}],
//             answer: 4,
//             explanation: 'Greenhouse effect is cause by release of certain gases which are caused by human activity.'
//           }, 
//           {
//             question: 'The major contributors to the greenhouses gases are',
      //       answers: [{'option': 'factories'}, {'option': 'automobiles'},{'option': 'deforestation'},{'option': 'All of the above'} ],
      //       answer: 4,
      //       explanation: 'All affects greenhouse'
      //     }         
      //   ],
      //   instructions: 'Instructions for Environmental Test',
      // },
      // {
      //   chapter: ' Molecular Basis of Inheritance',
      //   instructions: 'Instructions for Test',
      //   questions: [
      //     {
      //       question: 'Three H-bonds is exhibited by which DNA bases in the double helix structure?',
      //       answers: [{ option: 'Guanine, Cytosine' }, { option: 'Adenine, Guanine' },{'option': 'Adenine, Thymine'}, {'option': 'Cytosine, Thymine'}],
      //       answer: 1,
      //       explanation: 'Cytosine and Guanine exhibit three hydrogen-bonds.'
      //     },
      //     {
      //       question: 'A nitrogenous base is linked to the pentose sugar through',
      //       answers: [{ option: 'Phosphodiester linkage' }, { option: 'Phosphoester linkage' },{'option': 'O-glycosidic linkage'}, {'option': 'N-glycosidic linkage'}],
      //       answer: 4,
      //       explanation: 'A nitrogenous base is linked to the pentose sugar through a glycosidic bond'
      //     },
      //   ],
      // },
      //  {
      //     chapter: 'Trigonometry',
      //     instructions: 'Instructions for Trigonomtry Test',
      //     questions: [
      //       {
      //         question: 'what is columbs law?',
      //         answers: [{ option: 'Option A' }, { option: 'Option B' }],
      //         answer: 1,
      //       },
      //       {
      //         question: 'what is maxwell law?',
      //         answers: [{ option: 'Option A' }, { option: 'Option B' }],
      //         answer: 1,
      //       },
      //     ],
      //   },
  //   ],
  // },
//   {
//     name: 'Chemistry',
//     instructions: 'Instructions for Quiz 2',
//     chapter: [
//       {
//         chapter: 'Quantum Chemistry',
//         questions: [
//           {
//             question: 'what is spin quantum number?',
//             answers: [{ option: 'Option A' }, { option: 'Option B' }],
//             answer: 1,
//           },
//           {
//             question: 'what is degenerate orbitals?',
//             answers: [{ option: 'Option A' }, { option: 'Option B' }],
//             answer: 2,
//           },
//         ],
//       }
//     ],
//   },
// ];

// // Insert the data into the database
// Quizes.insertMany(quizData)
//   .then(function () {
//     console.log('Data inserted successfully');
//   })
//   .catch(function (error) {
//     console.error('Error inserting data:', error);
//   })

var app = express();

app.enable("trust proxy");
// ...
app.use(
  session({
    secret: 'sV4T3Qnxjd8',
    resave: true,
    saveUninitialized: false,
    cookie: {
      domain: 'localhost:3000',
      path: '/',
      maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days in milliseconds
      httpOnly: true,
      secure: false
    },
    store: mongoStore.create({
      mongoUrl: DB,
      collection: 'sessions',
      touchAfter: 24 * 60 * 60, // 24 hours in seconds
      autoRemove: 'native',
    })
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Set Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// Set security HTTP headers
app.use(helmet());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(morgan("combined", { stream: winston.stream }));

app.use(cookieParser("12345-67890"));

// Limit requests from the same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  messege: "Too many requests from this IP, Please try again in an hour!",
});
app.use("/", limiter);

// Data sanitization against XSS
app.use(xss());

// Prevent http param pollution
app.use(hpp());

// Implement CORS
// app.use(cors({
//   origin: function(origin, callback){
//     // allow requests with no origin 
//     // (like mobile apps or curl requests)
//     if(!origin) return callback(null, true);
//     if(origin.startsWith('http://localhost:')) {
//       return callback(null, true);
//      }// else {
//     //   return callback(new Error('Not allowed by CORS'));
//     // }
//   },
//   credentials: true,
//   exposedHeaders: ["Set-Cookie"],
// }));

app.options("*", cors());
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,UPDATE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  next();
});

app.use(compression());

app.disable("x-powered-by");

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Middleware to check if the user is logged in
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.get('/checkSession', async (req, res) => {
  try {
    if (req.session.userId) {
      const id = req.session.userId;
      const User = await user.findById(id); // Find user by object ID
      // console.log(User);
      res.status(200).json({
        purchasedSeries: User.purchasedSeries,
        enrolledFor: User.enrolledFor,
        profession: User.profession,
      });
    } else {
      res.status(401).json("Not logged in!").send();
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
    // res.redirect('/login'); // Redirect to the login page
  }
});
app.use("/quizes", quizRouter);
app.use("/testSubmit", submitRouter);
app.use("/history", histRouter);
app.use("/series", seriesRouter);
app.use("/payment", require("./routes/payment"));
app.use("/teachers", require("./routes/teachers"));
app.use("/notifications", require("./routes/notification"));

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
    `${err.status || 500} - ${err.message} - ${req.originalUrl} - ${
      req.method
    } - ${req.ip}`
  );
  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
