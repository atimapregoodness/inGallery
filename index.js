if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require('express');
const path = require('path');

const app = express();
const ejs = require('ejs');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const User = require('./models/user');
const localStrategy = require('passport-local');
const session = require('express-session');
const routes = require('./routes');
const flash = require('connect-flash');
const appError = require('./utils/appError');
const MongoStore = require('connect-mongo');
const cors = require("cors");

const bodyParser = require('body-parser');

const morgan = require('morgan');
const moment = require('moment');


// const wrapAsync = require('./utils/wrapAsync');

// const upload = multer({ dest: "upload" });

mongoose.connect(process.env.MONGO_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('DB CONNECTION OPEN');
  })
  .catch(err => {
    console.log('DB CONNECTION FAILED');
    console.log(err);
  });

const sessionConfig = {
  secret: 'thisshouldbeabettersecret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_CONNECT,
    collectionName: 'sessions'
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
};



const methodOverride = require('method-override');

app.use(methodOverride('_method'));

app.use((req, res, next) => {
  // Do not update the previous URL on the first request (when there's no referrer)
  if (req.session) {
    req.session.previousUrl = req.session.currentUrl || req.headers.referer;
    req.session.currentUrl = req.originalUrl;
  }

  res.locals.previousUrl = req.session?.previousUrl || "/"; // Default to home if none
  next();
});


morgan.token("date", () => moment().format("YYYY-MM-DD HH:mm:ss"));

app.use(morgan(':method :url :status :response-time ms - [:date]'));

app.use(bodyParser.json());
app.use(session(sessionConfig));
app.use(flash());

app.use(cors());

const passport = require('./config/passportConfig'); // Import the Passport configuration

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currentPage = req.originalUrl;
  res.locals.fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
  res.locals.user = req.user;
  res.locals.search = req.query;
  res.locals.moment = moment;

  next();
});


app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));

app.engine('ejs', ejsMate);

app.use((req, res, next) => {
  // Do not update the previous URL on the first request (when there's no referrer)
  if (req.session) {
    req.session.previousUrl = req.session.currentUrl || req.headers.referer;
    req.session.currentUrl = req.originalUrl;
  }

  res.locals.previousUrl = req.session?.previousUrl || "/"; // Default to home if none
  next();
});
app.use('/', routes);

app.get('/back', (req, res) => {
  res.redirect(req.session.previousUrl);
});

app.all('*', (req, res, next) => {
  next(new appError('Page not found', 404));
});

app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`);
  console.error(`Previous URL: ${res.locals.previousUrl}`);

  res.status(err.status || 500).render('error/errorPage', { err, previousUrl: res.locals.previousUrl });
});

app.listen(3000, () => {
  console.log('LISTENING TO PORT:3000');
});