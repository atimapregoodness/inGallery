if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

console.log(process.env.SECRET);

const express = require('express');
const path = require('path');
const app = express();
const ejsMate = require('ejs-mate');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('./models/user');
const passport = require('passport');
const localStrategy = require('passport-local');
const session = require('express-session');
const userRoute = require('./routes/userRoute');
const flash = require('connect-flash');


mongoose.connect(`${process.env.MONGO_CONNECT}`, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('DB CONNECTION OPEN');
  })
  .catch(err => {
    console.log('DB CONNECTION FAILED');
    console.log(err);
  });

const sessionConfig = {
  secret: 'ohboythisismysecret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
};

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currentPage = req.originalUrl;
  next();
});

passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate);

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/explore', (req, res) => {
  res.render('explore');
});



app.use('/', userRoute);

app.get('/dashboard', (req, res) => {
  if (req.isAuthenticated()) {
    res.render('user/acct/dashboard', { user: req.user });
  } else {
    req.flash('error', 'Please login first');
    res.redirect('/login');
  }
});


app.listen(3000, () => {
  console.log('LISTENING TO PORT:3000');
});