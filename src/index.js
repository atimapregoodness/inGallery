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
const methodOverride = require("method-override");
const morgan = require("morgan");
const moment = require("moment");
const ejsMate = require("ejs-mate");
const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");
const appError = require("./utils/appError");

const app = express();

// 🟢 1. CONNECT TO DATABASE
mongoose
  .connect(process.env.MONGO_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Database connected successfully"))
  .catch((err) => console.error("❌ Database con  nection failed", err));

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
app.use(express.static(path.join(__dirname, "../dist")));
app.use(express.static(path.join(__dirname, "../zohoverify")));
app.use(morgan(":method :url :status :response-time ms - [:date]"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session(sessionConfig));
app.use(flash());
app.use(methodOverride("_method"));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, "../public")));
app.use(
  "/bootstrap",
  express.static(path.join(__dirname, "../node_modules/bootstrap/dist"))
);

// 🟢 4. VIEW ENGINE SETUP
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const personalMsgMiddleware = require("./middleware/personalMsg");

const commMsgMiddleware = require("./middleware/commMsg");

app.use(personalMsgMiddleware);
app.use(commMsgMiddleware);

// 🟢 5. GLOBAL VARIABLES
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.info = req.flash("info");
  res.warning = req.flash("warning");
  res.locals.currentUser = req.user;
  res.locals.currentPage = req.originalUrl;
  res.locals.fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
  res.locals.search = req.query;
  res.locals.moment = moment;
  res.locals.IGPRate = 0.002;

  if (req.session) {
    req.session.previousUrl = req.session.currentUrl || req.headers.referer;
    req.session.currentUrl = req.originalUrl;
  }

  res.locals.previousUrl = req.session?.previousUrl || "/";
  next();
});


// On localhost or fallback, use path-based routing
app.use("/admin", adminRoutes);
app.use("/", userRoutes);

// const createAdminRoute = require("./routes/api/createAdmin");
// app.use("/api/admin/create", createAdminRoute);

// 🟢 8. BACK BUTTON SUPPORT
app.get("/back", (req, res) => {
  res.redirect(req.session.previousUrl || "/");
});

// 🟢 9. ERROR HANDLING
app.all("*", (req, res, next) => next(new appError("Page not found", 404)));

app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`);
  res.status(err.status || 500).render("error/errorPage", { err });
});

// 🟢 10. START SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
