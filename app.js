const express = require("express");
const mongoose = require("mongoose");
const Entry = require("./models/entries");
const entryRouter = require("./routes/entries");
const methodOverride = require("method-override");
const path = require('path');
const app = express();

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

app.get("/", async (req, res) => {
  const entries = await Entry.find().sort({ createdAt: "desc" });
  res.render("entries/index", { entries: entries });
});

app.use("/entries", entryRouter);

app.listen(process.env.PORT || 3000);