const express = require("express");
const mongoose = require("mongoose");
const entryRouter = require("./routes/entries");
const methodOverride = require("method-override");
const path = require('path');
const app = express();

const User = require('./models/user')
const Entry = require("./models/entries");
const authRoutes = require('./routes/auth');
app.use(authRoutes);

app.use((req, res, next) => {
  // throw new Error('Sync Dummy');
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch(err => {
      next(new Error(err));
    });
});

const MONGODB_URL = "mongodb+srv://journal-admin:CSE341@cluster0.8ktbu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

mongoose.connect(MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride("_method"));

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.get("/", async (req, res) => {
  const entries = await Entry.find().sort({ createdAt: "desc" });
  res.render("entries/index", {
     entries: entries,
     isAuthenticated: req.session.isLoggedIn
    });
});

app.use("/entries", entryRouter);

app.listen(process.env.PORT || 3000);