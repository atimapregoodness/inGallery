if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const passport = require("./config/passportConfig");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const cors = require("cors");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const morgan = require("morgan");
const moment = require("moment");
const ejsMate = require("ejs-mate");
const routes = require("./routes");
const appError = require("./utils/appError");

const app = express();

// 🟢 1. CONNECT TO DATABASE
mongoose
  .connect(process.env.MONGO_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Database connected successfully"))
  .catch((err) => console.error("❌ Database connection failed", err));

// 🟢 2. SESSION CONFIGURATION
const sessionConfig = {
  secret: "thisshouldbeabettersecret",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_CONNECT,
    collectionName: "sessions",
  }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day
};

// 🟢 3. MIDDLEWARE SETUP
app.use(express.static(path.join(__dirname, 'dist')));
app.use(morgan(":method :url :status :response-time ms - [:date]"));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session(sessionConfig));
app.use(flash());
app.use(methodOverride("_method"));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  "/bootstrap",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist"))
);

// 🟢 4. VIEW ENGINE SETUP
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// 🟢 5. GLOBAL VARIABLES
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  res.locals.currentPage = req.originalUrl;
  res.locals.fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
  res.locals.search = req.query;
  res.locals.moment = moment;
  res.locals.gbpRate = 0.002;

  if (req.session) {
    req.session.previousUrl = req.session.currentUrl || req.headers.referer;
    req.session.currentUrl = req.originalUrl;
  }

  res.locals.previousUrl = req.session?.previousUrl || "/";
  next();
});

// 🟢 6. ROUTES
app.use("/", routes);

app.get("/back", (req, res) => {
  res.redirect(req.session.previousUrl);
});

// 🟢 7. ERROR HANDLING
app.all("*", (req, res, next) => next(new appError("Page not found", 404)));

app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`);
  res.status(err.status || 500).render("error/errorPage", { err });
});

// 🟢 8. START SERVER
app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});
