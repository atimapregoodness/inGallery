if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

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
const acctRoute = require('./routes/acctRoute');
const flash = require('connect-flash');
const appError = require('./utils/appError');
const multer = require('multer');
const MongoStore = require('connect-mongo');
const UploadImg = require('./models/publish');

const bodyParser = require('body-parser');

const { storage } = require('./cloudinary');
const PublishImg = require("./models/publish");
const upload = multer({ storage });

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

app.use(bodyParser.json());
app.use(session(sessionConfig));
app.use(flash());

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
  res.redirect('/home');
});

app.get('/home', (req, res) => {
  res.render('index');
});

// Route to handle exploring images with pagination
app.get('/explore', async (req, res) => {
  const { search } = req.query;
  const skip = parseInt(req.query.skip) || 0;
  const limit = parseInt(req.query.limit) || 30;

  if (search) {
    try {
      const imgs = await PublishImg.find({
        $or: [
          { category: new RegExp(search, 'i') },
          { 'img.filename': new RegExp(search, 'i') },
          { description: new RegExp(search, 'i') }
        ]
      }).populate('user').skip(skip).limit(limit);
      res.render('explore', { imgs, search });
    } catch (error) {
      console.error(error);
      res.redirect('/explore');
    }
  } else {
    try {
      const imgs = await PublishImg.find({}).populate('user').skip(skip).limit(limit);
      res.render('explore', { imgs });
    } catch (error) {
      console.error(error);
      res.redirect('/explore');
    }
  }
});

// Route to handle searching images by category
// app.get('/explore/:search', async (req, res) => {
//   const { search } = req.params;
//   console.log(search);
//   try {
//     const imgs = await PublishImg.find({ category: new RegExp(search, 'i') });
//     res.render('explore', { imgs, search });
//   } catch (error) {
//     console.error(error);
//     res.redirect('/explore');
//   }
// });



app.get('/explore/image/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const user = req.user;
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 30;

    const imgs = await UploadImg.findById(id).populate('user');
    const findImg = await PublishImg.findById(imgs._id).populate('user');


    if (user && findImg && imgs) {
      const userId = req.user._id.toString();
      const findImgId = findImg.user._id.toString();

      if (userId !== findImgId && !findImg.views.includes(user._id)) {
        findImg.views.push(user._id);
        await findImg.save();
        // console.log('user is not the owner');
      } else if (findImg.views.includes(user._id)) {
        // console.log('user has already viewed the image');
      } else {
        // console.log('user is the owner');
      }
    }

    let views = findImg.views.length;

    const findCateogory = await PublishImg.find({
      $or: [
        { category: new RegExp(imgs.category, 'i') },
        { 'img.filename': new RegExp(imgs.filename, 'i') },
        { description: new RegExp(imgs.description, 'i') }
      ]
    }).populate('user').skip(skip).limit(limit);

    res.render('imgPreview', { imgs, findCateogory, views });

  } catch (err) {
    console.log(err);
    res.redirect('/explore');
  }
});



app.use('/', acctRoute);
app.use('/user', userRoute);

app.all('*', (req, res, next) => {
  next(new appError('Page not found', 404));
});

app.use((err, req, res, next) => {
  const { status = 500 } = err;
  if (!err.message) {
    err.message = 'something went wrong';
  }
  res.status(status).render('error/errorPage', { err, url: req.originalUrl });
});

app.listen(3000, () => {
  console.log('LISTENING TO PORT:3000');
});